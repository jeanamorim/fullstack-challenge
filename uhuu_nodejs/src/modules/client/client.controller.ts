import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ClientDTO } from './client.dto';

import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/Client/createClient.dto';

@ApiTags('Client')
@Controller('client')
@ApiBearerAuth('token')
export class ClientController {
  constructor(private readonly clienteService: ClientService) {}

  @Post('/create')
  @ApiBody({
    type: CreateClientDTO,
    description: 'Exemplo do JSON a ser enviado',
  })
  async createClient(@Body() params: ClientDTO) {
    return await this.clienteService.createClient(params);
  }

  @Get('/list')
  @ApiQuery({ name: 'pag', required: true, type: 'number' })
  @ApiQuery({ name: 'limit', required: true, type: 'number' })
  async getAllClient(@Query() { pag, limit }) {
    return await this.clienteService.getAllClient({ pag, limit });
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, type: 'number' })
  async getById(@Param() { id }) {
    return await this.clienteService.getById({ id });
  }

  @Delete('/delete')
  async deleteAllRegister() {
    return await this.clienteService.deleteAllRegister();
  }

  @Get('/geocode/:postalcode')
  @ApiParam({ name: 'postalcode', required: true, type: 'string' })
  async getGeocode(@Param() { postalcode }) {
    return await this.clienteService.getGeocode({ postalcode });
  }
}
