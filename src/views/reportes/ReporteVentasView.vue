<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import * as XLSX from 'xlsx'
import productoService, { type Producto } from '@/api/productoService'
import TransparentCard from '@/components/TransparentCard.vue'
import CategoryTable from '@/components/CategoryTable.vue'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

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

onMounted(async () => {
  try {
    inventario.value = await productoService.getAll()
  } catch (error) {
    console.error(error)
    modal.alert('Error', 'Error al cargar ventas', 'danger')
  }
})

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
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Reporte Ventas</h1>
    <TransparentCard>
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
