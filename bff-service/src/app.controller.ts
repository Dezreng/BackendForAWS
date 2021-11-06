import {
  Controller,
  Req,
  Body,
  All,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Request } from 'express';
import { AppService } from './app.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @All()
  async getAll(
    @Req() req: Request,
    @Body() createItemDto?: CreateItemDto,
  ): Promise<AxiosResponse<any>> {
    const recipient = req.originalUrl.split('/')[1].split('?')[0];
    const objQuery = req.query;
    const productId = objQuery.productId as string;
    if (Object.keys(objQuery).length > 0) {
      const strictMatch = req.originalUrl
        .split('/')[1]
        .split('?')[1]
        .split('=')[0];
      if (strictMatch !== 'productId') {
        throw new HttpException(
          'Incorrect key in query string parameters, must be < productId > !',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const method = req.method;
    const res = await this.appService.getAll(
      recipient,
      method,
      createItemDto,
      productId,
    );
    return res;
  }
}
