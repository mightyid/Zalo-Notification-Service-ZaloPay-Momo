import { Module } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { ZaloPayController } from './zalopay.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ZaloPayController],
  providers: [ZaloPayService],
  exports: [ZaloPayService],
})
export class ZaloPayModule {}
