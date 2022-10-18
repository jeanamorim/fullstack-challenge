import { HttpException } from '@nestjs/common';
import { ClientDTO } from 'src/modules/client/client.dto';
import * as Yup from 'yup';

const Create = async (dados: ClientDTO): Promise<any> => {
  const { endereco, geolocalização } = dados;

  const schema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    peso: Yup.string().required('peso is required'),
  });
  const schemaEndereco = Yup.object().shape({
    logradouro: Yup.string().required('logradouro is required'),
    numero: Yup.string().required('numero is required'),
    bairro: Yup.string().required('bairro is required'),
    complemento: Yup.string().required('complemento is required'),
    cidade: Yup.string().required('cidade is required'),
    estado: Yup.string().required('estado is required'),
    pais: Yup.string().required('pais is required'),
  });

  const schemaGeolocalização = Yup.object().shape({
    latitude: Yup.string().required('latitude is required'),
    longitude: Yup.string().required('longitude is required'),
  });

  try {
    await schema.validate(dados);
    await schemaEndereco.validate(endereco);
    await schemaGeolocalização.validate(geolocalização);
  } catch (err) {
    throw new HttpException(err, 400);
  }
  return;
};

export default Create;
