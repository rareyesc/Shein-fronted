<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import productoService, { type Producto } from '@/api/productoService'
import categoryService, { type Categoria } from '@/api/categoryService'
import subcategoriaService, { type Subcategoria } from '@/api/subcategoriaService'
import generoService, { type Genero } from '@/api/generoService'
import colorService, { type Color } from '@/api/colorService'
import tallaService, { type Talla } from '@/api/tallaService'
import estadoService, { type Estado } from '@/api/estadoService'
import pedidoService, { type Pedido } from '@/api/pedidoService'
import categoryService from '@/api/categoryService'
import subcategoriaService from '@/api/subcategoriaService'
import generoService from '@/api/generoService'
import colorService from '@/api/colorService'
import tallaService from '@/api/tallaService'
import estadoService from '@/api/estadoService'
import pedidoService, { type Pedido } from '@/api/pedidoService'
import pedidoService from '@/api/pedidoService'
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
const categorias = ref<any[]>([])
const subcategorias = ref<any[]>([])
const generos = ref<any[]>([])
const colores = ref<any[]>([])
const tallas = ref<any[]>([])
const estados = ref<any[]>([])
const pedidos = ref<any[]>([])

interface Filtros {
  idCategoria: number
  idSubcategoria: number
  idGenero: number
  idColor: number
  idTalla: number
  idEstado: number
  idPedido: number
}

const filtros = ref<Filtros>({
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
    alert('Error al cargar datos')
  }
})

const filteredProductos = computed(() => {
  return productos.value.filter((p: Producto) => {
  return productos.value.filter((p) => {
    const f = filtros.value
    if (f.idCategoria && p.idCategoria !== f.idCategoria) return false
    if (f.idSubcategoria && p.idSubcategoria !== f.idSubcategoria) return false
    if (f.idGenero && p.idGenero !== f.idGenero) return false
    if (f.idColor && p.idColor !== f.idColor) return false
    if (f.idTalla && p.idTalla !== f.idTalla) return false
    if (f.idEstado && p.idEstado !== f.idEstado) return false
    if (f.idPedido && p.idPedido !== f.idPedido) return false
    return true
  })
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
              {{ ped.numeroPedido }}
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
