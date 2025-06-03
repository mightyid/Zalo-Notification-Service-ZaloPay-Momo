import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateZaloNotiDto {
  mode: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  template_id: string;

  @IsNotEmpty()
  @IsObject()
  template_data: Record<string, string>;

  @IsString()
  sending_mode: string;

  @IsNotEmpty()
  @IsString()
  tracking_id: string;
}
