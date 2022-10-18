import {
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  IsPort,
  IsIP,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class FileDto {
  @IsString()
  path: string;

  root: number;
}

export class FileDetailDto {
  @IsString()
  path: string;
}
