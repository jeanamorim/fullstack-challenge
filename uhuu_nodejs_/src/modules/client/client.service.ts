import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { apiGeocode, apiPostalCode } from 'src/services/api';
import Create from '../schemas/client/create';
import { ClientDTO } from './client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async createClient(params: ClientDTO) {
    try {
      await Create(params);

      const { name, peso, endereco, geolocalização } = params;
      const { logradouro, numero, bairro, complemento, cidade, estado, pais } =
        endereco;
      const { latitude, longitude } = geolocalização;
      const client = await this.prisma.client.create({
        data: {
          name,
          peso,
          endereco: {
            create: [
              {
                logradouro,
                numero,
                bairro,
                complemento,
                cidade,
                estado,
                pais,
              },
            ],
          },
          geolocalizacao: {
            create: [
              {
                latitude,
                longitude,
              },
            ],
          },
        },
        include: {
          endereco: true,
          geolocalizacao: true,
        },
      });
      return client;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data?.errors ||
          error.response ||
          'there was an error when creating in the customer record',
        400,
      );
    }
  }

  async getAllClient({ pag, limit }) {
    try {
      const total = await this.prisma.client.findMany({});

      const client = await this.prisma.client.findMany({
        take: parseInt(limit),
        skip: parseInt(limit) * (parseInt(pag) <= 0 ? 0 : parseInt(pag) - 1),
        include: { endereco: true, geolocalizacao: true },
      });

      const lastPage = Math.ceil(total.length / parseInt(limit));
      const nextPage = parseInt(pag) + 1 > lastPage ? null : parseInt(pag) + 1;
      const prevPage = parseInt(pag) - 1 < 1 ? null : parseInt(pag) - 1;

      let totalWeight = 0;

      total.forEach((element) => {
        totalWeight += Number(element.peso);
      });

      const ticketMedio = totalWeight / total.length;

      return {
        client,
        total: total.length,
        totalWeight,
        ticketMedio: parseFloat(ticketMedio.toFixed(2)) || 0,
        currentPage: parseInt(pag),
        nextPage: nextPage,
        prevPage: prevPage,
        lastPage: lastPage,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.errors ||
          error.response ||
          'there was an error when list in the customer record',
        400,
      );
    }
  }

  async getById({ id }) {
    try {
      const client = await this.prisma.client.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          endereco: true,
          geolocalizacao: true,
        },
      });

      if (!client) {
        throw new HttpException('client does not exists!', 400);
      }

      return client;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.errors ||
          error.response ||
          'there was an error when list in the customer record',
        400,
      );
    }
  }
  async deleteAllRegister() {
    try {
      const users = await this.prisma.client.findMany({});
      const endereco = await this.prisma.endereco.findMany({});
      const geolocalizacao = await this.prisma.geolocalizacao.findMany({});

      const deleteUser = async (user: any) => {
        return await this.prisma.client.delete({
          where: { id: user.id },
        });
      };
      const deleteEndereco = async (end: any) => {
        return await this.prisma.endereco.delete({
          where: { id: end.id },
        });
      };
      const deleteGeolocalizacao = async (geo: any) => {
        return await this.prisma.geolocalizacao.delete({
          where: { id: geo.id },
        });
      };

      const deleteGeolocalizacaos = async () => {
        return Promise.all(
          geolocalizacao.map((geo) => deleteGeolocalizacao(geo)),
        );
      };
      const deleteEnderecos = async () => {
        return Promise.all(endereco.map((end) => deleteEndereco(end)));
      };

      const deleteUsers = async () => {
        return Promise.all(users.map((user) => deleteUser(user)));
      };

      await deleteGeolocalizacaos();
      await deleteEnderecos();
      await deleteUsers();

      return { success: 'documents deleted in success' };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.errors ||
          error.response ||
          'there was an error when delete in customer',
        400,
      );
    }
  }

  async getGeocode({ postalcode }) {
    try {
      const geocode = await apiGeocode(postalcode);

      if (!geocode) {
        throw new HttpException('Incorrect or invalid zip code !', 400);
      }

      if (geocode.length > 0) {
        const { lat, lon } = geocode[0];
        const geolocalizacao = { lat, lon };

        const resultPostalCode = await apiPostalCode(postalcode);

        return { geolocalizacao, address: resultPostalCode };
      }
      return { error: 'Incorrect or invalid zip code !' };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.errors ||
          error.response ||
          'There was an error listing the zip code',
        400,
      );
    }
  }
}
