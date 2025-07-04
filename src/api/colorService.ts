import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_COLOR || 'http://localhost:8091/api/colores'

export interface Color {
  idColor: number
  nombreColor: string
}

export default {
  async getAll(): Promise<Color[]> {
    const response = await axios.get<Color[]>(BASE_URL)
    return response.data
  },

  async getById(id: number): Promise<Color> {
    const response = await axios.get<Color>(`${BASE_URL}/${id}`)
    return response.data
  },

  async create(color: Omit<Color, 'idColor'>): Promise<Color> {
    const response = await axios.post<Color>(BASE_URL, color)
    return response.data
  },

  async update(id: number, color: Color): Promise<Color> {
    const response = await axios.put<Color>(`${BASE_URL}/${id}`, color)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  },
}
