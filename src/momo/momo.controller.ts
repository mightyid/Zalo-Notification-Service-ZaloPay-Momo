import { Body, Controller, Post } from '@nestjs/common';
import { MomoService } from './momo.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';
import { RefundTransactionDto } from './dto/refund-transaction.dto';

@Controller('momo')
export class MomoController {
  constructor(private readonly momoService: MomoService) {}

  @Post('transactions')
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.momoService.createTransaction(createTransactionDto);
  }

  @Post('transactions/callback')
  async handleCallback(@Body() body: any) {
    console.log('Received callback:', body);
    return body;
  }

  @Post('transactions/status')
  async transactionStatus(@Body('orderId') orderId: string, @Body('lang') lang: string) {
    return await this.momoService.transactionStatus(orderId, lang);
  }

  @Post('transactions/confirm')
  async confirmTransaction(@Body() confirmTransactionDto: ConfirmTransactionDto) {
    return await this.momoService.confirmTransaction(confirmTransactionDto);
  }

  @Post('transactions/refund')
  async refundTransaction(@Body() refundTransactionDto: RefundTransactionDto) {
    return await this.momoService.refundTransaction(refundTransactionDto);
  }

}
