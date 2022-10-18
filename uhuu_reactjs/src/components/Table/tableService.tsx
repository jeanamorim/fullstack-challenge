import api from '../../services/api'

export const getClientesAlls = async (page: number, limit: number) => {
  return await api.get(
    `/client/list?pag=${page + 1}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
    } }
  )
}