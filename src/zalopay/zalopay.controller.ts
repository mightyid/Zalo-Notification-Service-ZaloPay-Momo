import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RefundOrderDto } from './dto/refund-order.dto';


@Controller('zalopay')
export class ZaloPayController {
  constructor(private readonly zaloPayService: ZaloPayService) {}
  //Tạo đơn hàng
  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.zaloPayService.createOrder(createOrderDto);
  }

  //Callback
  @Post('callback')
  async handleCallback(@Body() body: any) {
    const { mac, data } = body;
    return await this.zaloPayService.handleCallback(data, mac);
  }

  //Truy vấn trạng thái thanh toán
  @Get('order-status/:app_trans_id')
  async orderStatus(@Param('app_trans_id') app_trans_id: string) {
    return await this.zaloPayService.orderStatus(app_trans_id);
  }

  //Hoàn tiền giao dịch
  @Post('refund')
  async refund(@Body() refundOrderDto: RefundOrderDto) {
    return await this.zaloPayService.refund(refundOrderDto);
  }

  //Truy vấn trạng thái hoàn tiền
  @Get('refund-status/:m_refund_id')
  async refundStatus(@Param('m_refund_id') m_refund_id: string) {
    return await this.zaloPayService.refundStatus(m_refund_id);
  }
}
