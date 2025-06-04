import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  storeId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  orderInfo: string;

  @IsArray()
  items: Array<Object>;

  @IsObject()
  userInfo: Object;

  @IsBoolean()
  autoCapture: boolean;

  @IsString()
  lang: string;
}
