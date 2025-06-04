import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefundOrderDto {
  @IsString()
  @IsNotEmpty()
  zp_trans_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  refund_fee_amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
