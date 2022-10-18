import { Module } from '@nestjs/common';
// import { BookModule } from './modules/book/book.module';
import { Client } from './modules/client/client.module';

@Module({
  imports: [Client],
  controllers: [],
  providers: [],
})
export class AppModule {}
