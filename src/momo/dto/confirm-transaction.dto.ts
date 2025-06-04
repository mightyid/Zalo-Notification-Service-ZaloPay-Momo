import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ConfirmTransactionDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  requestType: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  lang: string;

  @IsString()
  description: string;
}
