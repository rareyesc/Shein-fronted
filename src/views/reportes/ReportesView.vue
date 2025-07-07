<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import productoService, { type Producto } from '@/api/productoService'
import TransparentCard from '@/components/TransparentCard.vue'
import CategoryTable from '@/components/CategoryTable.vue'

interface ColumnDef {
  key: string
  label: string
  type: 'string' | 'number' | 'date'
  sortable?: boolean
}

const inventario = ref<Producto[]>([])

const productColumns: ColumnDef[] = [
  { key: 'sku', label: 'SKU', type: 'string', sortable: true },
  { key: 'nombreProducto', label: 'Nombre', type: 'string', sortable: true },
  { key: 'precioCompra', label: 'Precio Compra', type: 'number' },
  { key: 'precioVenta', label: 'Precio Venta', type: 'number' },
  { key: 'idEstado', label: 'Estado', type: 'number' },
]

onMounted(async () => {
  try {
    inventario.value = await productoService.getAll()
  } catch (error) {
    console.error(error)
    alert('Error al cargar inventario')
  }
})

function exportInventario() {
  const data = inventario.value.map(p => ({
    SKU: p.sku,
    Nombre: p.nombreProducto,
    PrecioCompra: p.precioCompra,
    PrecioVenta: p.precioVenta,
    Estado: p.idEstado,
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
      <CategoryTable :columns="productColumns" :rows="inventario" />
    </TransparentCard>
  </div>
</template>

<style scoped>
</style>
