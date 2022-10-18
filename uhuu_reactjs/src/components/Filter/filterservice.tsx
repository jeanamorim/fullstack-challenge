import api from '../../services/api'

export const getGeoCode = async (postalcode: string) => {
  return await api.get(
    `/client/geocode/${postalcode}`, {
      headers: {
        'Content-Type': 'application/json',
    } }
  )
}
export const submitClient = async (fields) => {
  const form = {
    "name":fields.name,
    "peso": fields.peso,
    "endereco": {
      "logradouro": fields.logradouro,
      "numero": fields.numero,
      "bairro": fields.bairro,
      "complemento": fields.complemento,
      "cidade": fields.cidade,
      "estado":fields.estado,
      "pais":fields.pais,
    },
    "geolocalização": {
      "latitude": fields.latitude,
      "longitude": fields.longitude,
    }
  }
  return await api.post(`/client/create`, form)
}

export const deleteAll = async () => {
  return await api.delete(`/client/delete`)
}

