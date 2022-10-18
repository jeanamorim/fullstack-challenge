export type ClientDTO = {
  name: string;
  peso: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    complemento: string;
    cidade: string;
    estado: string;
    pais: string;
  };
  geolocalização: {
    latitude: string;
    longitude: string;
  };
};
