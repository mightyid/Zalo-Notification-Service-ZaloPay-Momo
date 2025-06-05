import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns-tz';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RefundTransactionDto } from './dto/refund-transaction.dto';

@Injectable()
export class ZaloPayService {
  private app_id: number;
  private key1: string;
  private key2: string;
  private create_endpoint: string;
  private query_endpoint: string;
  private refund_endpoint: string;
  private query_refund_endpoint: string;
  constructor(private readonly configService: ConfigService) {
    this.app_id = 2554;
    this.key1 = this.configService.get<string>('KEY1')!;
    this.key2 = this.configService.get<string>('KEY2')!;
    this.create_endpoint = this.configService.get<string>(
      'ZALO_CREATE_ENDPOINT',
    )!;
    this.query_endpoint = this.configService.get<string>('QUERY_ENDPOINT')!;
    this.refund_endpoint = this.configService.get<string>(
      'ZALO_REFUND_ENDPOINT',
    )!;
    this.query_refund_endpoint = this.configService.get<string>(
      'ZALO_QUERY_REFUND_ENDPOINT',
    )!;
  }

  async createTransaction(dto: CreateTransactionDto) {
    const {
      app_user,
      amount,
      item,
      bank_code,
      description,
      embed_data,
      ...rest
    } = dto;

    const vietnamTime = format(new Date(), 'yyMMdd', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    const app_time = Date.now();
    const app_trans_id = `${vietnamTime}_${Math.floor(Math.random() * 1000000)}`;

    const data = `${this.app_id}|${app_trans_id}|${app_user}|${amount}|${app_time}|${JSON.stringify(embed_data)}|${JSON.stringify(item)}`;
    const mac = CryptoJS.HmacSHA256(data, this.key1).toString();

    const body = {
      app_id: this.app_id,
      app_user,
      app_time,
      amount,
      app_trans_id,
      bank_code,
      embed_data: JSON.stringify(embed_data),
      item: JSON.stringify(item),
      description,
      mac,
      ...rest,
      callback_url:
        'https://b834-222-253-45-164.ngrok-free.app/zalopay/callback',
    };

    console.log('Request body:', body);

    try {
      const response = await axios.post(this.create_endpoint, body);
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to create ZaloPay transaction: ' +
          err.response?.data?.message || err.message,
      );
    }
  }

  async handleCallback(data: any, mac: string) {
    const hmac = CryptoJS.HmacSHA256(data, this.key2).toString();
    if (hmac !== mac) {
      console.log('Invalid MAC:', hmac, mac);
    } else {
      // Xử lý logic khi MAC hợp lệ
      console.log('Valid MAC:', hmac, mac);
    }
  }

  async transactionStatus(app_trans_id: string) {
    const data = `${this.app_id}|${app_trans_id}|${this.key1}`;
    const mac = CryptoJS.HmacSHA256(data, this.key1).toString();

    const body = {
      app_trans_id,
      app_id: this.app_id,
      mac,
    };

    try {
      const response = await axios.post(this.query_endpoint, body);
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to query transaction ZaloPay: ' + err.response?.data?.message ||
          err.message,
      );
    }
  }

  async refund(refundTransactionDto: RefundTransactionDto) {
    const timestamp = Date.now();

    const { zp_trans_id, amount, refund_fee_amount, description } =
      refundTransactionDto;
    let data = '';
    if (refund_fee_amount !== undefined && refund_fee_amount !== null) {
      // Nếu có refund_fee_amount thì thêm vào chuỗi data
      data = `${this.app_id}|${zp_trans_id}|${amount}|${refund_fee_amount}|${description}|${timestamp}`;
    } else {
      // Nếu không có thì bỏ qua
      data = `${this.app_id}|${zp_trans_id}|${amount}|${description}|${timestamp}`;
    }

    const mac = CryptoJS.HmacSHA256(data, this.key1).toString();

    const vietnamTime = format(new Date(), 'yyMMdd', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`;

    const body: any = {
      app_id: this.app_id,
      m_refund_id: `${vietnamTime}_${this.app_id}_${uid}`,
      timestamp,
      zp_trans_id,
      amount,
      description,
      mac,
    };

    console.log('Refund request body:', body);

    if (refund_fee_amount !== undefined && refund_fee_amount !== null) {
      body.refund_fee_amount = refund_fee_amount;
    }

    try {
      const response = await axios.post(this.refund_endpoint, body);
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to refund transaction ZaloPay: ' +
          err.response?.data?.message || err.message,
      );
    }
  }

  async refundStatus(m_refund_id: string) {
    const timestamp = Date.now();
    const data = `${this.app_id}|${m_refund_id}|${timestamp}`;
    const mac = CryptoJS.HmacSHA256(data, this.key1).toString();

    const body = {
      app_id: this.app_id,
      timestamp,
      m_refund_id,
      mac,
    };

    console.log('Refund status request body:', body);

    try {
      const response = await axios.post(this.query_refund_endpoint, body);
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to query refund ZaloPay: ' + err.response?.data?.message ||
          err.message,
      );
    }
  }

  async getListMerchantBanks() {
    const reqTime = Date.now();
    const mac = CryptoJS.HmacSHA256(
      `${this.app_id}|${reqTime}`,
      this.key1,
    ).toString();
    const body = {
      appid: this.app_id,
      reqtime: reqTime,
      mac,
    };

    try {
      const response = await axios.post(
        'https://sbgateway.zalopay.vn/api/getlistmerchantbanks',
        body,
      );
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to get list of merchant banks: ' +
          err.response?.data?.message || err.message,
      );
    }
  }
}
