import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';

const PORT = config.PORT || 3000;
console.log(PORT);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
