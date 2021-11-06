import { Controller, HttpException, HttpStatus, All } from '@nestjs/common';

@Controller('*')
export class ErrorHandlerController {
  @All()
  getHandler(): string {
    throw new HttpException('Cannot process request!', HttpStatus.BAD_GATEWAY);
  }
}
