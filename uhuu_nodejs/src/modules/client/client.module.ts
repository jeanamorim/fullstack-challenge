import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { PrismaService } from '../../database/PrismaService';

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [ClientService, PrismaService],
})
export class Client {}
