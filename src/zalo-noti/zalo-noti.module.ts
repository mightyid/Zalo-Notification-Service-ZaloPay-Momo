import { Module } from '@nestjs/common';
import { ZaloNotiService } from './zalo-noti.service';
import { ZaloNotiController } from './zalo-noti.controller';

@Module({
  controllers: [ZaloNotiController],
  providers: [ZaloNotiService],
  exports: [ZaloNotiService],
})
export class ZaloNotiModule {}
