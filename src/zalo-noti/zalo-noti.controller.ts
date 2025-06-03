import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { ZaloNotiService } from './zalo-noti.service';
import { CreateZaloNotiDto } from './dto/create-zalo-noti.dto';
import { UpdateZaloNotiDto } from './dto/update-zalo-noti.dto';

@Controller('zalo-noti')
export class ZaloNotiController {
  constructor(private readonly zaloNotiService: ZaloNotiService) {}

  @Post('send-zns')
  sendZNS(
    @Headers('access_token') access_token: string,
    @Body() body: CreateZaloNotiDto,
  ) {
    return this.zaloNotiService.sendZNS(access_token, body);
  }

  @Post('send-zns/hashphone')
  sendZNSHashphone(
    @Headers('access_token') access_token: string,
    @Body() body: CreateZaloNotiDto,
  ) {
    return this.zaloNotiService.sendZNSHashphone(access_token, body);
  }
}
