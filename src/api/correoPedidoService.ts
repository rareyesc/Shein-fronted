import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_CORREOPEDIDO || 'http://localhost:8092/api/correospedidos'

export interface CorreoPedido {
  idCorreoPedido: number
  nombreCorreoPedido: string
}

export default {
  async getAll(): Promise<CorreoPedido[]> {
    const response = await axios.get<CorreoPedido[]>(BASE_URL)
    return response.data
  },

  async getById(id: number): Promise<CorreoPedido> {
    const response = await axios.get<CorreoPedido>(`${BASE_URL}/${id}`)
    return response.data
  },

  async create(correo: Omit<CorreoPedido, 'idCorreoPedido'>): Promise<CorreoPedido> {
    const response = await axios.post<CorreoPedido>(BASE_URL, correo)
    return response.data
  },

  async update(id: number, correo: CorreoPedido): Promise<CorreoPedido> {
    const response = await axios.put<CorreoPedido>(`${BASE_URL}/${id}`, correo)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  },
}
