import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_TALLA || 'http://localhost:8098/api/tallas'

export interface Talla {
  idTalla: number
  nombreTalla: string
}

export default {
  async getAll(): Promise<Talla[]> {
    const response = await axios.get<Talla[]>(BASE_URL)
    return response.data
  },

  async getById(id: number): Promise<Talla> {
    const response = await axios.get<Talla>(`${BASE_URL}/${id}`)
    return response.data
  },

  async create(talla: Omit<Talla, 'idTalla'>): Promise<Talla> {
    const response = await axios.post<Talla>(BASE_URL, talla)
    return response.data
  },

  async update(id: number, talla: Talla): Promise<Talla> {
    const response = await axios.put<Talla>(`${BASE_URL}/${id}`, talla)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  },
}
