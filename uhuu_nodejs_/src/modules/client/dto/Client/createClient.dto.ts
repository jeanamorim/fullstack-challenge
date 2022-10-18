import { ApiProperty } from '@nestjs/swagger';

class Endereco {
  @ApiProperty({ example: 'Rua Manoel Bispo' })
  'logradouro': string;
  @ApiProperty({ example: '320' })
  'numero': string;
  @ApiProperty({ example: 'centro' })
  'bairro': string;
  @ApiProperty({ example: 'Edif. Cidade' })
  'complemento': string;
  @ApiProperty({ example: 'Aracaju' })
  'cidade': string;
  @ApiProperty({ example: 'SE' })
  'estado': string;
  @ApiProperty({ example: 'BRL' })
  'pais': string;
}

class Geolocalização {
  @ApiProperty({ example: '-10.921332944444444' })
  'latitude': string;
  @ApiProperty({ example: '-37.03045655555556' })
  'longitude': string;
}

export class CreateClientDTO {
  @ApiProperty({ example: 'Jean Amorim' })
  'name': string;
  @ApiProperty({ example: '10kg' })
  'peso': string;
  @ApiProperty({ type: Endereco })
  'endereco': Endereco;
  @ApiProperty({ type: Geolocalização })
  'geolocalização': Geolocalização;
}
