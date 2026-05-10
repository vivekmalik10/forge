import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      name: dto.name ?? null,
    });
    const saved = await this.userRepository.save(user);
    return this.toPublicUser(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
  }

  async updateProfile(
    userId: string,
    data: { name?: string | null; avatarUrl?: string | null },
  ): Promise<Omit<User, 'passwordHash'>> {
    await this.userRepository.update(userId, {
      ...(data.name !== undefined && { name: data.name ?? null }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl ?? null }),
    });
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found after update');
    return this.toPublicUser(user);
  }

  toPublicUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash: _, ...rest } = user;
    return rest;
  }
}
