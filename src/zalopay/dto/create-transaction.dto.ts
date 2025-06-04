import {
  IsArray,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  app_user: string;

  @IsNumber()
  expire_duration_seconds: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty()
  @MaxLength(2048)
  item: Object[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  description: string;

  @IsJSON()
  @IsNotEmpty()
  embed_data: JSON;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  bank_code: string;

  @IsObject()
  @MaxLength(256)
  device_info: Object;

  @IsString()
  @MaxLength(50)
  sub_app_id: string;

  @IsString()
  @MaxLength(256)
  title: string;

  @IsString()
  currency: string;

  @IsString()
  @MaxLength(50)
  phone: string;

  @IsString()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(1024)
  address: string;
}
