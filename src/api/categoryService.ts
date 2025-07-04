import axios from 'axios'

// 1. Carga la URL del .env
//    Si la variable no existe, usa un fallback por si acaso.
const BASE_URL = import.meta.env.VITE_API_CATEGORIAS || 'http://localhost:8090/api/categorias'

// 2. Define la interfaz
export interface Categoria {
  idCategoria: number
  nombreCategoria: string
}

// 3. Exporta las funciones CRUD
//    Cada función llama al endpoint correspondiente usando Axios.
export default {
  // a) Obtener todas las categorías
  async getAll(): Promise<Categoria[]> {
    const response = await axios.get<Categoria[]>(BASE_URL)
    return response.data
  },

  // b) Obtener una categoría por ID
  async getById(id: number): Promise<Categoria> {
    const response = await axios.get<Categoria>(`${BASE_URL}/${id}`)
    return response.data
  },

  // c) Crear una nueva categoría
  //    Usamos "Omit<Categoria, 'idCategoria'>" para no requerir la ID en el objeto de creación
  async create(categoria: Omit<Categoria, 'idCategoria'>): Promise<Categoria> {
    const response = await axios.post<Categoria>(BASE_URL, categoria)
    return response.data
  },

  // d) Actualizar una categoría existente
  async update(id: number, categoria: Categoria): Promise<Categoria> {
    const response = await axios.put<Categoria>(`${BASE_URL}/${id}`, categoria)
    return response.data
  },

  // e) Eliminar una categoría
  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`)
  }
}
