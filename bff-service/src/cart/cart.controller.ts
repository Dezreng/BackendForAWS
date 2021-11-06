import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Request } from 'express';
import { AppService } from '../app.service';

@Controller('cart')
export class CartController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async sendToCart(@Req() req: Request): Promise<AxiosResponse<any>> {
    const objQuery = req.query;
    if (Object.keys(objQuery || {}).length > 0) {
      throw new HttpException(
        'There is should not be any parameters!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const recipient = req.originalUrl.split('/')[1].split('?')[0];
    const method = req.method;
    const res = this.appService.sendToCart(recipient, method);
    return res;
  }
}
