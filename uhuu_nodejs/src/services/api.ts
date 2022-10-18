import axios from 'axios';

export const apiGeocode = async (postalcode: string) => {
  const { data } = await axios.get(
    `${process.env.URL_GEOCODE}/search?postalcode=${postalcode}&format=json`,
  );
  return data;
};

export const apiPostalCode = async (cep: string) => {
  const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  return data;
};
