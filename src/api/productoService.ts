import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_PRODUCTO || 'http://localhost:8096/api/productos'

// Estructura básica del Producto
export interface Producto {
  idProducto: number
  nombreProducto: string
  descripcion?: string
  sku?: string
  imagen?: string
  precioCompra: number
  precioSinDescuento?: number
  precioVenta: number
  fechaCreacion?: Date
  fechaActualizacion?: Date
  idCategoria: number
  idSubcategoria: number
  idGenero: number
  idColor: number
  idTalla: number
  idEstado: number
  idPedido?: number
}

export default {
  // GET /api/productos
  async getAll(): Promise<Producto[]> {
    const response = await axios.get<Producto[]>(BASE_URL)
    return response.data
  },

  // GET /api/productos/{id}
  async getById(id: number): Promise<Producto> {
    const response = await axios.get<Producto>(`${BASE_URL}/${id}`)
    return response.data
  },

  // POST multipart/form-data
  //  => { "producto": JSON, "imagen": file }
  async createProduct(formData: FormData): Promise<Producto> {
    const response = await axios.post<Producto>(BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // PUT /api/productos/{id} (multipart/form-data)
  async updateProduct(id: number, formData: FormData): Promise<Producto> {
    const response = await axios.put<Producto>(`${BASE_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // DELETE /api/productos/{id}
  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  },

  // GET /api/productos/buscar?nombre=...
  async searchByName(nombre: string): Promise<Producto[]> {
    const response = await axios.get<Producto[]>(`${BASE_URL}/buscar`, {
      params: { nombre },
    })
    return response.data
  },

  // GET /api/productos/sku/{sku}
  async getBySku(sku: string): Promise<Producto> {
    const response = await axios.get<Producto>(`${BASE_URL}/sku/${sku}`)
    return response.data
  },
}
