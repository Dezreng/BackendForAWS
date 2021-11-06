import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorHandlerController } from './path-handler/path-handler.controller';
import { CartController } from './cart/cart.controller';

@Module({
  imports: [CacheModule.register({ ttl: 120 })],
  controllers: [AppController, CartController, ErrorHandlerController],
  providers: [AppService],
})
export class AppModule {}
