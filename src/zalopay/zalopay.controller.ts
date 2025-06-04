import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RefundTransactionDto } from './dto/refund-transaction.dto';

@Controller('zalopay')
export class ZaloPayController {
  constructor(private readonly zaloPayService: ZaloPayService) {}
  //Tạo đơn hàng
  @Post('transactions')
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.zaloPayService.createTransaction(createTransactionDto);
  }

  //Callback
  @Post('callback')
  async handleCallback(@Body() body: any) {
    const { mac, data } = body;
    return await this.zaloPayService.handleCallback(data, mac);
  }

  //Truy vấn trạng thái thanh toán
  @Get('transactions/:app_trans_id/status')
  async transactionStatus(@Param('app_trans_id') app_trans_id: string) {
    return await this.zaloPayService.transactionStatus(app_trans_id);
  }

  //Hoàn tiền giao dịch
  @Post('refunds')
  async refund(@Body() refundTransactionDto: RefundTransactionDto) {
    return await this.zaloPayService.refund(refundTransactionDto);
  }

  //Truy vấn trạng thái hoàn tiền
  @Get('refunds/:m_refund_id/status')
  async refundStatus(@Param('m_refund_id') m_refund_id: string) {
    return await this.zaloPayService.refundStatus(m_refund_id);
  }
}
