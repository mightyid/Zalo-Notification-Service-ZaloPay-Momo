import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';
import { RefundTransactionDto } from './dto/refund-transaction.dto';

@Injectable()
export class MomoService {
  private partnerCode: string;
  private accessKey: string;
  private secretKey: string;
  private redirectUrl: string;
  private ipnUrl: string;
  private createEnpoint: string;
  private refundEndpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.partnerCode = this.configService.get<string>('PARTNER_CODE')!;
    this.accessKey = this.configService.get<string>('ACCESS_KEY')!;
    this.secretKey = this.configService.get<string>('SECRET_KEY')!;
    this.ipnUrl = this.configService.get<string>('IPN_URL')!;
    this.redirectUrl = this.configService.get<string>('REDIRECT_URL')!;
    this.createEnpoint = this.configService.get<string>(
      'MOMO_CREATE_ENDPOINT',
    )!;
    this.refundEndpoint = this.configService.get<string>(
      'MOMO_REFUND_ENDPOINT',
    )!;
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const { amount, orderId, orderInfo, ...rest } = createTransactionDto;
    const requestId = uuidv4();

    const rawSignature =
      'accessKey=' +
      this.accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      '&ipnUrl=' +
      this.ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      this.partnerCode +
      '&redirectUrl=' +
      this.redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      'payWithMethod';

    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);

    var signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    const body = {
      partnerCode: this.partnerCode,
      partnerName: 'Test',
      requestId: requestId,
      amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      requestType: 'payWithMethod',
      orderExpireTime: 10,
      extraData: '',
      signature: signature,
      ...rest,
    };

    try {
      const response = await axios.post(this.createEnpoint, body);
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to create Momo order: ' + err.response?.data?.message ||
          err.message,
      );
    }
  }

  async transactionStatus(orderId: string, lang: string) {
    const requestId = uuidv4();

    const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=${this.partnerCode}&requestId=${requestId}`;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');
    const body = {
      partnerCode: this.partnerCode,
      requestId,
      orderId,
      lang,
      signature,
    };
    try {
      const response = await axios.post(
        this.configService.get<string>('MOMO_QUERY_STATUS_ENDPOINT')!,
        body,
      );
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to get transaction status: ' + err.response?.data?.message ||
          err.message,
      );
    }
  }

  async confirmTransaction(confirmTransactionDto: ConfirmTransactionDto) {
    const requestId = uuidv4();

    const { orderId, requestType, amount, lang, description } =
      confirmTransactionDto;
    const rawSignature =
      'accessKey=' +
      this.accessKey +
      '&amount=' +
      amount +
      '&description=' +
      description! +
      '&orderId=' +
      orderId +
      '&partnerCode=' +
      this.partnerCode +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    const body = {
      partnerCode: this.partnerCode,
      requestId,
      orderId,
      requestType,
      amount,
      lang,
      description,
      signature,
    };

    try {
      const response = await axios.post(
        this.configService.get<string>('MOMO_CONFIRM_ENDPOINT')!,
        body,
      );
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to confirm transaction: ' + err.response?.data?.message ||
          err.message,
      );
    }
  }

  async refundTransaction(refundTransactionDto: RefundTransactionDto) {
    const requestId = uuidv4();
    const { orderId, amount, lang, transId, description } =
      refundTransactionDto;

    const rawSignature =
      'accessKey=' +
      this.accessKey +
      '&amount=' +
      amount +
      '&description=' +
      description +
      '&orderId=' +
      orderId +
      '&partnerCode=' +
      this.partnerCode +
      '&requestId=' +
      requestId +
      '&transId=' +
      transId;

    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    const body = {
      partnerCode: this.partnerCode,
      orderId,
      requestId,
      amount,
      transId,
      lang,
      description,
      signature,
    };

    console.log(body);

    try {
      const response = await axios.post(this.refundEndpoint, body);
      return response.data;
    } catch (err) {
      throw new Error(
        'Failed to refund transaction: ' + err.response?.data?.message ||
          err.message,
      );
    }
  }
}
