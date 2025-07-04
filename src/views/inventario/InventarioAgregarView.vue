<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 1) Importa todos los servicios que necesitas
import categoryService from '@/api/categoryService'
import subcategoriaService from '@/api/subcategoriaService'
import generoService from '@/api/generoService'
import colorService from '@/api/colorService'
import tallaService from '@/api/tallaService'
import estadoService from '@/api/estadoService'
import pedidoService from '@/api/pedidoService'
import productoService from '@/api/productoService'
import TransparentCard from '@/components/TransparentCard.vue'

// 2) Ajusta la interfaz para manejar el File
interface ProductoForm {
  // O usar la misma nomenclatura del backend:
  nombreProducto: string
  descripcion: string
  sku: string

  imagenFile: File | null

  precioCompra: number
  precioSinDescuento: number | null
  precioVenta: number

  idCategoria: number
  idSubcategoria: number
  idGenero: number
  idColor: number
  idTalla: number
  idEstado: number
  idPedido: number | null
}

// 3) Refs (v-model)
const productoForm = ref<ProductoForm>({
  nombreProducto: '',
  descripcion: '',
  sku: '',
  imagenFile: null,
  precioCompra: 0,
  precioSinDescuento: null,
  precioVenta: 0,
  idCategoria: 0,
  idSubcategoria: 0,
  idGenero: 0,
  idColor: 0,
  idTalla: 0,
  idEstado: 0,
  idPedido: null,
})

// 4) Refs para listas
const categorias = ref<any[]>([])
const subcategorias = ref<any[]>([])
const generos = ref<any[]>([])
const colores = ref<any[]>([])
const tallas = ref<any[]>([])
const estados = ref<any[]>([])
const pedidos = ref<any[]>([])

// 5) onMounted: Cargar datos reales en paralelo
onMounted(async () => {
  try {
    const [
      catData,
      subcatData,
      genData,
      colData,
      tallData,
      estData,
      pedData,
    ] = await Promise.all([
      categoryService.getAll(),
      subcategoriaService.getAll(),
      generoService.getAll(),
      colorService.getAll(),
      tallaService.getAll(),
      estadoService.getAll(),
      pedidoService.getAll(),
    ])

    categorias.value = catData
    subcategorias.value = subcatData
    generos.value = genData
    colores.value = colData
    tallas.value = tallData
    estados.value = estData
    pedidos.value = pedData
  } catch (error) {
    console.error(error)
    alert('Error al cargar datos de microservicios')
  }
})

// 6) Manejar archivo
const handleImagen = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) {
    productoForm.value.imagenFile = null
    return
  }
  productoForm.value.imagenFile = input.files[0]
}

// 7) Al hacer submit
const agregarProducto = async () => {
  try {
    // Construir JSON (propiedades => back)
    const productoPayload = {
      nombreProducto: productoForm.value.nombreProducto,
      descripcion: productoForm.value.descripcion,
      sku: productoForm.value.sku,
      precioCompra: productoForm.value.precioCompra,
      precioSinDescuento: productoForm.value.precioSinDescuento,
      precioVenta: productoForm.value.precioVenta,
      idCategoria: productoForm.value.idCategoria,
      idSubcategoria: productoForm.value.idSubcategoria,
      idGenero: productoForm.value.idGenero,
      idColor: productoForm.value.idColor,
      idTalla: productoForm.value.idTalla,
      idEstado: productoForm.value.idEstado,
      idPedido: productoForm.value.idPedido,
    }

    const formData = new FormData()
    formData.append(
      'producto',
      new Blob([JSON.stringify(productoPayload)], { type: 'application/json' })
    )
    if (productoForm.value.imagenFile) {
      formData.append('imagen', productoForm.value.imagenFile)
    }

    // Llamamos al microservicio
    const created = await productoService.createProduct(formData)
    alert('Producto agregado correctamente')
    console.log('Producto creado:', created)

    // Resetear formulario
    productoForm.value = {
      nombreProducto: '',
      descripcion: '',
      sku: '',
      imagenFile: null,
      precioCompra: 0,
      precioSinDescuento: null,
      precioVenta: 0,
      idCategoria: 0,
      idSubcategoria: 0,
      idGenero: 0,
      idColor: 0,
      idTalla: 0,
      idEstado: 0,
      idPedido: null,
    }
  } catch (error) {
    console.error(error)
    alert('Error al agregar producto')
  }
}
  function autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement
    // Paso 1: Ajustar altura a "auto" para calcular el scrollHeight
    textarea.style.height = 'auto'
    // Paso 2: Asignar la altura según su scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`
  }
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Agregar Producto</h1>

    <TransparentCard>
    <form @submit.prevent="agregarProducto">
      <div class="row">
        <!-- Columna 1 -->
        <div class="col-md-6">
          <!-- Nombre -->
          <div class="mb-3">
            <label class="form-label">Nombre del Producto</label>
            <input
              type="text"
              class="form-control"
              v-model="productoForm.nombreProducto"
              required
            />
          </div>
          <!-- Descripción -->
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" rows="1" v-model="productoForm.descripcion" @input="autoResize"></textarea>
          </div>
          <!-- SKU -->
          <div class="mb-3">
            <label class="form-label">SKU</label>
            <input type="text" class="form-control" v-model="productoForm.sku" />
          </div>
          <!-- Imagen -->
          <div class="mb-3">
            <label class="form-label">Imagen</label>
            <input type="file" class="form-control" @change="handleImagen" />
          </div>
          <!-- Precio compra -->
          <div class="mb-3">
            <label class="form-label">Precio de Compra</label>
            <input type="number" class="form-control" v-model="productoForm.precioCompra" step="0.01" required />
          </div>
          <!-- Precio sin descuento -->
          <div class="mb-3">
            <label class="form-label">Precio Sin Descuento</label>
            <input type="number" class="form-control" v-model="productoForm.precioSinDescuento" step="0.01" />
          </div>
          <!-- Precio venta -->
          <div class="mb-3">
            <label class="form-label">Precio de Venta</label>
            <input type="number" class="form-control" v-model="productoForm.precioVenta" step="0.01" required />
          </div>
        </div>

        <!-- Columna 2 -->
        <div class="col-md-6">
          <!-- Categoría -->
          <div class="mb-3">
            <label class="form-label">Categoría</label>
            <select class="form-select" v-model="productoForm.idCategoria" required>
              <option value="0" disabled>Selecciona una categoría</option>
              <option v-for="cat in categorias" :key="cat.idCategoria" :value="cat.idCategoria">
                {{ cat.nombreCategoria }}
              </option>
            </select>
          </div>

          <!-- Subcategoría -->
          <div class="mb-3">
            <label class="form-label">Subcategoría</label>
            <select class="form-select" v-model="productoForm.idSubcategoria" required>
              <option value="0" disabled>Selecciona una subcategoría</option>
              <option v-for="sub in subcategorias" :key="sub.idSubcategoria" :value="sub.idSubcategoria">
                {{ sub.nombreSubcategoria }}
              </option>
            </select>
          </div>

          <!-- Género -->
          <div class="mb-3">
            <label class="form-label">Género</label>
            <select class="form-select" v-model="productoForm.idGenero" required>
              <option value="0" disabled>Selecciona un género</option>
              <option v-for="gen in generos" :key="gen.idGenero" :value="gen.idGenero">
                {{ gen.nombreGenero }}
              </option>
            </select>
          </div>

          <!-- Color -->
          <div class="mb-3">
            <label class="form-label">Color</label>
            <select class="form-select" v-model="productoForm.idColor" required>
              <option value="0" disabled>Selecciona un color</option>
              <option v-for="col in colores" :key="col.idColor" :value="col.idColor">
                {{ col.nombreColor }}
              </option>
            </select>
          </div>

          <!-- Talla -->
          <div class="mb-3">
            <label class="form-label">Talla</label>
            <select class="form-select" v-model="productoForm.idTalla" required>
              <option value="0" disabled>Selecciona una talla</option>
              <option v-for="tal in tallas" :key="tal.idTalla" :value="tal.idTalla">
                {{ tal.nombreTalla }}
              </option>
            </select>
          </div>

          <!-- Estado -->
          <div class="mb-3">
            <label class="form-label">Estado</label>
            <select class="form-select" v-model="productoForm.idEstado" required>
              <option value="0" disabled>Selecciona un estado</option>
              <option v-for="est in estados" :key="est.idEstado" :value="est.idEstado">
                {{ est.nombreEstado }}
              </option>
            </select>
          </div>

          <!-- Pedido (opcional) -->
          <div class="mb-3">
            <label class="form-label">Pedido</label>
            <select class="form-select" v-model="productoForm.idPedido">
              <option :value="0" disabled>¿Asociar a un pedido?</option>
              <option v-for="ped in pedidos" :key="ped.idPedido" :value="ped.idPedido">
                {{ ped.numeroPedido }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Agregar Producto</button>
    </form>
  </TransparentCard>
  </div>
</template>

<style scoped>
  .auto-resize-textarea {
    overflow-y: hidden;
    resize: none;
    min-height: 38px;
    max-height: 200px; 
  }
</style>
