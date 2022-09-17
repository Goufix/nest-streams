import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // setInterval(() => {
  //   console.log(process.memoryUsage().heapUsed / 1024 / 1024);
  // });
  await app.listen(3000);
}
bootstrap();
