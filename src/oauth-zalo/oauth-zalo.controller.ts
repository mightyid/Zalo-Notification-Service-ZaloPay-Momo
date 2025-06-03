import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OauthZaloService } from './oauth-zalo.service';

@Controller('oauth-zalo')
export class OauthZaloController {
  constructor(private readonly oauthZaloService: OauthZaloService) {}

  @Get('authorize')
  async login(@Query('redirectUri') redirectUri: string) {
    return {
      authorizationUrl:
        await this.oauthZaloService.getAuthorizationUrl(redirectUri),
    };
  }

  @Get('new-token')
  async handleRedirect(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    return this.oauthZaloService.getNewToken(code, state);
  }

  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') refresh_token: string) {
    return this.oauthZaloService.refreshToken(refresh_token);
  }
}
