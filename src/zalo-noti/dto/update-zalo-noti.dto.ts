import { PartialType } from '@nestjs/mapped-types';
import { CreateZaloNotiDto } from './create-zalo-noti.dto';

export class UpdateZaloNotiDto extends PartialType(CreateZaloNotiDto) {}
