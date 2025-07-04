import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_GENERO || 'http://localhost:8096/api/generos'

export interface Genero {
  idGenero: number
  nombreGenero: string
}

export default {
  async getAll(): Promise<Genero[]> {
    const response = await axios.get<Genero[]>(BASE_URL)
    return response.data
  },

  async getById(id: number): Promise<Genero> {
    const response = await axios.get<Genero>(`${BASE_URL}/${id}`)
    return response.data
  },

  async create(genero: Omit<Genero, 'idGenero'>): Promise<Genero> {
    const response = await axios.post<Genero>(BASE_URL, genero)
    return response.data
  },

  async update(id: number, genero: Genero): Promise<Genero> {
    const response = await axios.put<Genero>(`${BASE_URL}/${id}`, genero)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  },
}
