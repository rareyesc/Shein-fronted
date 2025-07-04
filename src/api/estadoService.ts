import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_ESTADO || 'http://localhost:8093/api/estados'

export interface Estado {
  idEstado: number
  nombreEstado: string
}

export default {
  async getAll(): Promise<Estado[]> {
    const response = await axios.get<Estado[]>(BASE_URL)
    return response.data
  },

  async getById(id: number): Promise<Estado> {
    const response = await axios.get<Estado>(`${BASE_URL}/${id}`)
    return response.data
  },

  async create(estado: Omit<Estado, 'idEstado'>): Promise<Estado> {
    const response = await axios.post<Estado>(BASE_URL, estado)
    return response.data
  },

  async update(id: number, estado: Estado): Promise<Estado> {
    const response = await axios.put<Estado>(`${BASE_URL}/${id}`, estado)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  },
}
