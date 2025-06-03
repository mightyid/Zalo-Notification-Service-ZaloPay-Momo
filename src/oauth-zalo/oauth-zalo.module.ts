import { Module } from '@nestjs/common';
import { OauthZaloService } from './oauth-zalo.service';
import { OauthZaloController } from './oauth-zalo.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [OauthZaloController],
  providers: [OauthZaloService],
  exports: [OauthZaloService],
})
export class OauthZaloModule {}
