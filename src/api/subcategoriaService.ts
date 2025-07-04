import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_SUBCATEGORIA || 'http://localhost:8097/api/subcategorias'

export interface Subcategoria {
  idSubcategoria: number
  nombreSubcategoria: string
  idCategoria: number
}

export default {
  async getAll(): Promise<Subcategoria[]> {
    const response = await axios.get<Subcategoria[]>(BASE_URL)
    return response.data
  },

  async getById(id: number): Promise<Subcategoria> {
    const response = await axios.get<Subcategoria>(`${BASE_URL}/${id}`)
    return response.data
  },

  async create(subcat: Omit<Subcategoria, 'idSubcategoria'>): Promise<Subcategoria> {
    const response = await axios.post<Subcategoria>(BASE_URL, subcat)
    return response.data
  },

  async update(id: number, subcat: Subcategoria): Promise<Subcategoria> {
    const response = await axios.put<Subcategoria>(`${BASE_URL}/${id}`, subcat)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  },
}
