import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

const REFRESH_TOKEN_PREFIX = 'refresh:';

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  type: 'refresh';
  jti: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpiresIn: string;
  user: Omit<User, 'passwordHash'>;
}

function parseExpiryToSeconds(expiresIn: string): number {
  const match = /^(\d+)(d|h|m|s)?$/.exec(expiresIn.trim());
  if (!match) {
    throw new Error(`Invalid expiry format: ${expiresIn}. Use e.g. 15m, 7d (see JWT_REFRESH_EXPIRES_IN).`);
  }
  const n = parseInt(match[1], 10);
  const unit = match[2] ?? 's';
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return n * (multipliers[unit] ?? 1);
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) return null;
    const valid = await this.usersService.validatePassword(user, password);
    return valid ? user : null;
  }

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const publicUser = await this.usersService.create(dto);
    const user = await this.usersService.findById(publicUser.id);
    if (!user) {
      throw new InternalServerErrorException('User not found after registration');
    }
    return this.loginUser(user);
  }

  async loginUser(user: User): Promise<AuthTokens> {
    await this.usersService.updateLastLogin(user.id);
    const updatedUser = await this.usersService.findById(user.id);
    const userToReturn = updatedUser ?? user;
    return this.issueTokenPair(userToReturn);
  }

  private async issueTokenPair(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn')!;
    const jti = randomUUID();
    const refreshPayload: RefreshTokenPayload = { ...payload, type: 'refresh', jti };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: refreshExpiresIn as SignOptions['expiresIn'],
    });

    const ttlSeconds = parseExpiryToSeconds(refreshExpiresIn);
    await this.redisService.set(REFRESH_TOKEN_PREFIX + jti, user.id, ttlSeconds);

    const decoded = this.jwtService.decode(accessToken) as { exp?: number };
    return {
      accessToken,
      refreshToken,
      expiresIn: decoded?.exp ? String(decoded.exp) : '900',
      refreshExpiresIn,
      user: this.usersService.toPublicUser(user),
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify(refreshToken) as RefreshTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (payload.type !== 'refresh' || !payload.jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const stored = await this.redisService.get(REFRESH_TOKEN_PREFIX + payload.jti);
    if (!stored || stored !== payload.sub) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      await this.redisService.del(REFRESH_TOKEN_PREFIX + payload.jti);
      throw new UnauthorizedException('User not found or inactive');
    }

    await this.redisService.del(REFRESH_TOKEN_PREFIX + payload.jti);
    return this.issueTokenPair(user);
  }

  async logout(refreshToken: string): Promise<{ revoked: boolean }> {
    try {
      const payload = this.jwtService.verify(refreshToken) as RefreshTokenPayload;
      if (payload.type === 'refresh' && payload.jti) {
        await this.redisService.del(REFRESH_TOKEN_PREFIX + payload.jti);
        return { revoked: true };
      }
    } catch {
      // token invalid or expired
    }
    return { revoked: false };
  }

  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findById(userId);
    return user ? this.usersService.toPublicUser(user) : null;
  }
}
