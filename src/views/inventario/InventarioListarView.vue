<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useModalStore } from '@/stores/modalStore'
import productoService, { type Producto } from '@/api/productoService'
import categoryService, { type Categoria } from '@/api/categoryService'
import subcategoriaService, { type Subcategoria } from '@/api/subcategoriaService'
import generoService, { type Genero } from '@/api/generoService'
import colorService, { type Color } from '@/api/colorService'
import tallaService, { type Talla } from '@/api/tallaService'
import estadoService, { type Estado } from '@/api/estadoService'
import pedidoService, { type Pedido } from '@/api/pedidoService'
import TransparentCard from '@/components/TransparentCard.vue'
import ProductCard from '@/components/ProductCard.vue'

const productos = ref<Producto[]>([])
const categorias = ref<Categoria[]>([])
const subcategorias = ref<Subcategoria[]>([])
const generos = ref<Genero[]>([])
const colores = ref<Color[]>([])
const tallas = ref<Talla[]>([])
const estados = ref<Estado[]>([])
const pedidos = ref<Pedido[]>([])

const modal = useModalStore()

const filtros = ref({
  idCategoria: 0,
  idSubcategoria: 0,
  idGenero: 0,
  idColor: 0,
  idTalla: 0,
  idEstado: 0,
  idPedido: 0,
})

onMounted(async () => {
  try {
    const [prods, cats, subs, gens, cols, tals, ests, peds] = await Promise.all([
      productoService.getAll(),
      categoryService.getAll(),
      subcategoriaService.getAll(),
      generoService.getAll(),
      colorService.getAll(),
      tallaService.getAll(),
      estadoService.getAll(),
      pedidoService.getAll(),
    ])

    productos.value = prods
    categorias.value = cats
    subcategorias.value = subs
    generos.value = gens
    colores.value = cols
    tallas.value = tals
    estados.value = ests
    pedidos.value = peds
  } catch (error) {
    console.error(error)
    modal.alert('Error', 'Error al cargar datos', 'danger')
  }
})

const filteredProductos = computed(() => {
  const f = filtros.value
  return productos.value.filter(
    (p: Producto) =>
      (!f.idCategoria || p.idCategoria === f.idCategoria) &&
      (!f.idSubcategoria || p.idSubcategoria === f.idSubcategoria) &&
      (!f.idGenero || p.idGenero === f.idGenero) &&
      (!f.idColor || p.idColor === f.idColor) &&
      (!f.idTalla || p.idTalla === f.idTalla) &&
      (!f.idEstado || p.idEstado === f.idEstado) &&
      (!f.idPedido || p.idPedido === f.idPedido)
  )
})

const formatPedido = (p: Pedido) => {
  const fecha = new Date(p.fechaPedido).toLocaleDateString('es-ES')
  return `${fecha} - ${p.numeroPedido}`
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Listar Productos</h1>

    <TransparentCard class="mb-4">
      <div class="row g-3">
        <div class="col-md-3">
          <select class="form-select" v-model.number="filtros.idCategoria">
            <option value="0">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat.idCategoria" :value="cat.idCategoria">
              {{ cat.nombreCategoria }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model.number="filtros.idSubcategoria">
            <option value="0">Todas las subcategorías</option>
            <option v-for="sub in subcategorias" :key="sub.idSubcategoria" :value="sub.idSubcategoria">
              {{ sub.nombreSubcategoria }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model.number="filtros.idGenero">
            <option value="0">Todos los géneros</option>
            <option v-for="gen in generos" :key="gen.idGenero" :value="gen.idGenero">
              {{ gen.nombreGenero }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model.number="filtros.idColor">
            <option value="0">Todos los colores</option>
            <option v-for="col in colores" :key="col.idColor" :value="col.idColor">
              {{ col.nombreColor }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model.number="filtros.idTalla">
            <option value="0">Todas las tallas</option>
            <option v-for="tal in tallas" :key="tal.idTalla" :value="tal.idTalla">
              {{ tal.nombreTalla }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model.number="filtros.idEstado">
            <option value="0">Todos los estados</option>
            <option v-for="est in estados" :key="est.idEstado" :value="est.idEstado">
              {{ est.nombreEstado }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model.number="filtros.idPedido">
            <option value="0">Todos los pedidos</option>
            <option v-for="ped in pedidos" :key="ped.idPedido" :value="ped.idPedido">
              {{ formatPedido(ped) }}
            </option>
          </select>
        </div>
      </div>
    </TransparentCard>

    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="prod in filteredProductos" :key="prod.idProducto" class="col">
        <ProductCard :product="prod" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
