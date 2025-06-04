import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ConfirmTransactionDto } from "./confirm-transaction.dto";

export class RefundTransactionDto extends ConfirmTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  transId: number;
  
}
