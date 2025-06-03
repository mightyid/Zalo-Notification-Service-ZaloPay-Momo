import { Injectable } from '@nestjs/common';
import { CreateZaloNotiDto } from './dto/create-zalo-noti.dto';
import { UpdateZaloNotiDto } from './dto/update-zalo-noti.dto';
import axios from 'axios';

@Injectable()
export class ZaloNotiService {
  async sendZNS(access_token: string, createZaloNotiDto: CreateZaloNotiDto) {
    const response = await axios.post(
      'https://business.openapi.zalo.me/message/template',
      {
        ...createZaloNotiDto,
      },
      {
        headers: {
          access_token,
        },
      },
    );

    return response.data;
  }

  async sendZNSHashphone(
    access_token: string,
    createZaloNotiDto: CreateZaloNotiDto,
  ) {
    const { mode, phone, template_id, template_data, tracking_id } =
      createZaloNotiDto;
    const response = await axios.post(
      'https://business.openapi.zalo.me/message/template/hashphone',
      {
        mode,
        hash_phone: phone,
        template_id,
        template_data,
        tracking_id,
      },
      {
        headers: {
          access_token,
        },
      },
    );

    return response.data;
  }
}
