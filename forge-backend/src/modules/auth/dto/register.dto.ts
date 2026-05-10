import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  // @MaxLength(128)
  // @Matches(/(?=.*[a-zA-Z])(?=.*[0-9])/, {
  //   message: 'Password must contain at least one letter and one number',
  // })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;
}
