<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import * as XLSX from 'xlsx'
import productoService, { type Producto } from '@/api/productoService'
import categoryService, { type Categoria } from '@/api/categoryService'
import subcategoriaService, { type Subcategoria } from '@/api/subcategoriaService'
import generoService, { type Genero } from '@/api/generoService'
import colorService, { type Color } from '@/api/colorService'
import tallaService, { type Talla } from '@/api/tallaService'
import estadoService, { type Estado } from '@/api/estadoService'
import pedidoService, { type Pedido } from '@/api/pedidoService'
import correoPedidoService, { type CorreoPedido } from '@/api/correoPedidoService'
import TransparentCard from '@/components/TransparentCard.vue'
import CategoryTable from '@/components/CategoryTable.vue'

interface ColumnDef {
  key: string
  label: string
  type: 'string' | 'number' | 'date'
  sortable?: boolean
}

function formatDate(d?: string | Date): string {
  if (!d) return ''
  const dateObj = typeof d === 'string' ? new Date(d) : d
  if (isNaN(dateObj.getTime())) return ''
  const dd = String(dateObj.getDate()).padStart(2, '0')
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
  const yyyy = dateObj.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

function formatCurrency(n?: number): string {
  if (n == null) return ''
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n)
}

const inventario = ref<Producto[]>([])
const categorias = ref<Categoria[]>([])
const subcategorias = ref<Subcategoria[]>([])
const generos = ref<Genero[]>([])
const colores = ref<Color[]>([])
const tallas = ref<Talla[]>([])
const estados = ref<Estado[]>([])
const pedidos = ref<Pedido[]>([])
const correos = ref<CorreoPedido[]>([])

interface InventarioRow {
  sku?: string
  nombre: string
  precioCompra: string
  precioSinDescuento?: string
  precioVenta: string
  fechaCreacion?: string
  fechaActualizacion?: string
  categoria: string
  subcategoria: string
  genero: string
  color: string
  talla: string
  estado: string
  numeroPedido?: string
  fechaPedido?: string
  fechaLlegada?: string
  correoPedido?: string
}

const inventarioRows = ref<InventarioRow[]>([])

interface VentaRow {
  sku?: string
  nombre: string
  fechaVenta: string
  precioCompra: string
  precioVenta: string
  ganancia: string
}

const fechaInicio = ref('')
const fechaFin = ref('')

const ventasRows = computed<VentaRow[]>(() => {
  return inventario.value
    .filter(p => {
      if (!p.fechaActualizacion) return false
      const f = new Date(p.fechaActualizacion)
      if (fechaInicio.value && f < new Date(fechaInicio.value)) return false
      if (fechaFin.value && f > new Date(fechaFin.value)) return false
      return true
    })
    .map(p => ({
      sku: p.sku,
      nombre: p.nombreProducto,
      fechaVenta: formatDate(p.fechaActualizacion),
      precioCompra: formatCurrency(p.precioCompra),
      precioVenta: formatCurrency(p.precioVenta),
      ganancia: formatCurrency(p.precioVenta - p.precioCompra),
    }))
})

const ventaColumns: ColumnDef[] = [
  { key: 'sku', label: 'SKU', type: 'string', sortable: true },
  { key: 'nombre', label: 'Nombre', type: 'string', sortable: true },
  { key: 'fechaVenta', label: 'Fecha Venta', type: 'date', sortable: true },
  { key: 'precioCompra', label: 'Precio Compra', type: 'string' },
  { key: 'precioVenta', label: 'Precio Venta', type: 'string' },
  { key: 'ganancia', label: 'Ganancia', type: 'string' },
]

function exportVentas() {
  const data = ventasRows.value.map(v => ({
    SKU: v.sku,
    Nombre: v.nombre,
    FechaVenta: v.fechaVenta,
    PrecioCompra: v.precioCompra,
    PrecioVenta: v.precioVenta,
    Ganancia: v.ganancia,
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Ventas')
  XLSX.writeFile(wb, 'ventas.xlsx')
}

const productColumns: ColumnDef[] = [
  { key: 'sku', label: 'SKU', type: 'string', sortable: true },
  { key: 'nombre', label: 'Nombre', type: 'string', sortable: true },
  { key: 'precioCompra', label: 'Precio Compra', type: 'string', sortable: true },
  { key: 'precioSinDescuento', label: 'Sin Descuento', type: 'string' },
  { key: 'precioVenta', label: 'Precio Venta', type: 'string', sortable: true },
  { key: 'fechaCreacion', label: 'Creación', type: 'date', sortable: true },
  { key: 'fechaActualizacion', label: 'Actualización', type: 'date', sortable: true },
  { key: 'categoria', label: 'Categoría', type: 'string', sortable: true },
  { key: 'subcategoria', label: 'Subcategoría', type: 'string', sortable: true },
  { key: 'genero', label: 'Género', type: 'string', sortable: true },
  { key: 'color', label: 'Color', type: 'string', sortable: true },
  { key: 'talla', label: 'Talla', type: 'string', sortable: true },
  { key: 'estado', label: 'Estado', type: 'string', sortable: true },
  { key: 'numeroPedido', label: 'Pedido', type: 'string', sortable: true },
  { key: 'fechaPedido', label: 'Fecha Pedido', type: 'date', sortable: true },
  { key: 'fechaLlegada', label: 'Fecha Llegada', type: 'date', sortable: true },
  { key: 'correoPedido', label: 'Correo', type: 'string', sortable: true },
]

onMounted(async () => {
  try {
    const [prods, cats, subs, gens, cols, tals, ests, peds, mails] =
      await Promise.all([
        productoService.getAll(),
        categoryService.getAll(),
        subcategoriaService.getAll(),
        generoService.getAll(),
        colorService.getAll(),
        tallaService.getAll(),
        estadoService.getAll(),
        pedidoService.getAll(),
        correoPedidoService.getAll(),
      ])

    inventario.value = prods
    categorias.value = cats
    subcategorias.value = subs
    generos.value = gens
    colores.value = cols
    tallas.value = tals
    estados.value = ests
    pedidos.value = peds
    correos.value = mails

    const catMap = Object.fromEntries(cats.map(c => [c.idCategoria, c.nombreCategoria]))
    const subMap = Object.fromEntries(subs.map(s => [s.idSubcategoria, s.nombreSubcategoria]))
    const genMap = Object.fromEntries(gens.map(g => [g.idGenero, g.nombreGenero]))
    const colMap = Object.fromEntries(cols.map(c => [c.idColor, c.nombreColor]))
    const talMap = Object.fromEntries(tals.map(t => [t.idTalla, t.nombreTalla]))
    const estMap = Object.fromEntries(ests.map(e => [e.idEstado, e.nombreEstado]))
    const pedMap: Record<number, Pedido> = {}
    peds.forEach(p => {
      pedMap[p.idPedido] = p
    })
    const mailMap = Object.fromEntries(mails.map(m => [m.idCorreoPedido, m.nombreCorreoPedido]))

    inventarioRows.value = prods.map(p => {
      const ped = p.idPedido ? pedMap[p.idPedido] : undefined
      const correoName = ped ? mailMap[ped.idCorreoPedido] || '' : ''
      return {
        sku: p.sku,
        nombre: p.nombreProducto,
        precioCompra: formatCurrency(p.precioCompra),
        precioSinDescuento: p.precioSinDescuento != null ? formatCurrency(p.precioSinDescuento) : '',
        precioVenta: formatCurrency(p.precioVenta),
        fechaCreacion: formatDate(p.fechaCreacion),
        fechaActualizacion: formatDate(p.fechaActualizacion),
        categoria: catMap[p.idCategoria] || '',
        subcategoria: subMap[p.idSubcategoria] || '',
        genero: genMap[p.idGenero] || '',
        color: colMap[p.idColor] || '',
        talla: talMap[p.idTalla] || '',
        estado: estMap[p.idEstado] || '',
        numeroPedido: ped?.numeroPedido || '',
        fechaPedido: ped ? formatDate(ped.fechaPedido) : '',
        fechaLlegada: ped ? formatDate(ped.fechaLlegada) : '',
        correoPedido: correoName,
      }
    })
  } catch (error) {
    console.error(error)
    alert('Error al cargar inventario')
  }
})

function exportInventario() {
  const data = inventarioRows.value.map(r => ({
    SKU: r.sku,
    Nombre: r.nombre,
    PrecioCompra: r.precioCompra,
    SinDescuento: r.precioSinDescuento,
    PrecioVenta: r.precioVenta,
    Creacion: r.fechaCreacion,
    Actualizacion: r.fechaActualizacion,
    Categoria: r.categoria,
    Subcategoria: r.subcategoria,
    Genero: r.genero,
    Color: r.color,
    Talla: r.talla,
    Estado: r.estado,
    Pedido: r.numeroPedido,
    FechaPedido: r.fechaPedido,
    FechaLlegada: r.fechaLlegada,
    Correo: r.correoPedido,
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario')
  XLSX.writeFile(wb, 'inventario.xlsx')
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Reportes</h1>
    <TransparentCard>
      <h3>Inventario</h3>
      <button class="btn btn-primary mb-3" @click="exportInventario">
        Exportar a Excel
      </button>
      <CategoryTable :columns="productColumns" :rows="inventarioRows" />
    </TransparentCard>

    <TransparentCard class="mt-4">
      <h3>Ventas</h3>
      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <label class="form-label">Fecha inicio</label>
          <input type="date" class="form-control" v-model="fechaInicio" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Fecha fin</label>
          <input type="date" class="form-control" v-model="fechaFin" />
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-primary me-2" @click="exportVentas">Descargar Excel</button>
        </div>
      </div>
      <CategoryTable :columns="ventaColumns" :rows="ventasRows" />
    </TransparentCard>
  </div>
</template>

<style scoped>
</style>
