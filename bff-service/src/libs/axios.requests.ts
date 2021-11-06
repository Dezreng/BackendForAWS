import axios, { AxiosResponse, Method } from 'axios';
import { CreateItemDto } from '../dto/create-item.dto';
import { HttpException } from '@nestjs/common';

export const requestToEb = async (
  pathToReq: string,
  method: string,
  createItemDto?: CreateItemDto,
): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios({
      method: method as Method,
      url: pathToReq,
      ...(Object.keys(createItemDto || {}).length > 0 && {
        data: createItemDto,
      }),
    });
    return response.data;
  } catch (error) {
    console.log(`ERROR MESSAGE: ${JSON.stringify(error)}`);
    if (error.response) {
      const { status, data } = error.response;
      throw new HttpException(data, status);
    }
  }
};
