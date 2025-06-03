import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';

import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class OauthZaloService {
  private readonly zaloTokenUrl =
    'https://oauth.zaloapp.com/v4/oa/access_token';
  private readonly zaloAuthorizationUrl =
    'https://oauth.zaloapp.com/v4/oa/permission';
  private readonly appId: string;
  private readonly secretKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.appId = this.configService.get<string>('ZALO_APP_ID', '');
    this.secretKey = this.configService.get<string>('ZALO_APP_SECRET', '');
  }

  generateCodeVerifier(length = 43): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verifier = '';
    for (let i = 0; i < length; i++) {
      verifier += charset.charAt(crypto.randomInt(0, charset.length));
    }
    return verifier;
  }

  generateCodeChallenge(): { codeVerifier: string; codeChallenge: string } {
    const codeVerifier = this.generateCodeVerifier();
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = hash
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return { codeVerifier, codeChallenge };
  }

  //Tạo url login cho OA
  async getAuthorizationUrl(redirectUri: string): Promise<string> {
    const { codeChallenge, codeVerifier } = this.generateCodeChallenge();
    const state = crypto.randomBytes(16).toString('hex');
    const params = new URLSearchParams({
      app_id: this.appId,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      state,
    });
    await this.redisService.set(state, codeVerifier, 600);
    return `${this.zaloAuthorizationUrl}?${params.toString()}`;
  }

  //Tạo access và refresh token
  async getNewToken(code: string, state: string): Promise<any> {
    let code_verifier = await this.redisService.get(state);
    if (code_verifier)
      return this.requestToken({
        code,
        grant_type: 'authorization_code',
        code_verifier,
      });
    else throw new NotFoundException(`Not found ${state}`);
  }

  //refresh token
  async refreshToken(refresh_token: string): Promise<any> {
    return this.requestToken({
      refresh_token,
      grant_type: 'refresh_token',
    });
  }

  async requestToken(params: Record<string, string>): Promise<any> {
    const data = new URLSearchParams({
      app_id: this.appId,
      ...params,
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      secret_key: this.secretKey,
    };

    try {
      const response = await axios.post(this.zaloTokenUrl, data, { headers });
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Zalo OAuth request failed';
      throw new InternalServerErrorException(message);
    }
  }
}
