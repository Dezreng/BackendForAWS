import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { requestToEb } from './libs/axios.requests';
import { CreateItemDto } from './dto/create-item.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAll(
    recipient: string,
    method: string,
    createItemDto?: CreateItemDto,
    productId?: string,
  ): Promise<any> {
    const value = await this.cacheManager.get(recipient);
    if (value !== undefined && method === 'GET' && !productId) {
      return value;
    }

    const recipientURL = process.env[recipient];
    if (recipientURL) {
      const pathToReq = productId
        ? `${recipientURL}/${recipient}/${productId}`
        : `${recipientURL}/${recipient}`;
      const res = await requestToEb(pathToReq, method, createItemDto);
      if (method === 'GET' && !productId) {
        await this.cacheManager.set(recipient, res);
        console.log('Cashed!');
      }
      return res;
    } else {
      throw new HttpException(`Not recipient`, HttpStatus.NOT_FOUND);
    }
  }

  sendToCart(recipient: string, method: string): Promise<AxiosResponse<any>> {
    const recipientURL = process.env[recipient];
    if (recipientURL) {
      return requestToEb(recipientURL, method);
    } else {
      throw new HttpException(`Not recipient`, HttpStatus.NOT_FOUND);
    }
  }
}
