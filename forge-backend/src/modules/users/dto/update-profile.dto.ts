import { IsOptional, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @ValidateIf((_, v) => v != null && v !== '')
  @IsUrl({}, { message: 'Please provide a valid avatar URL' })
  @MaxLength(500)
  avatarUrl?: string | null;
}
