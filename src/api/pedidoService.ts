import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_PEDIDO || 'http://localhost:8095/api/pedidos'

export interface Pedido {
  idPedido: number
  numeroPedido: string
  fechaPedido: Date
  fechaLlegada?: Date
  totalPedido?: number
  nota?: string
  idCorreoPedido: number
}

export interface ProductoPedido {
  id?: number
  idPedido?: number
  idProducto: number
  cantidad: number
  precio: number
}

export interface PedidoConProductos {
  pedido: Omit<Pedido, 'idPedido'>
  productos: ProductoPedido[]
}

export default {
  async getAll(): Promise<Pedido[]> {
    const response = await axios.get<Pedido[]>(BASE_URL)
    return response.data
  },

  async getById(id: number): Promise<Pedido> {
    const response = await axios.get<Pedido>(`${BASE_URL}/${id}`)
    return response.data
  },

  // El microservicio espera un objeto con { pedido, productos }
  async create(pedidoConProductos: PedidoConProductos): Promise<Pedido> {
    const response = await axios.post<Pedido>(BASE_URL, pedidoConProductos)
    return response.data
  },

  async update(id: number, pedidoConProductos: PedidoConProductos): Promise<Pedido> {
    const response = await axios.put<Pedido>(`${BASE_URL}/${id}`, pedidoConProductos)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  },

  // Extra: Obtener productos asociados a un pedido
  async getProductosDePedido(idPedido: number): Promise<ProductoPedido[]> {
    const response = await axios.get<ProductoPedido[]>(`${BASE_URL}/${idPedido}/productos`)
    return response.data
  }
}
