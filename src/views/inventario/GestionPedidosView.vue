<script setup lang="ts">
import { ref, onMounted } from 'vue'
import pedidoService, { type Pedido } from '@/api/pedidoService'
import correoPedidoService, { type CorreoPedido } from '@/api/correoPedidoService'

import CategoryTable from '@/components/CategoryTable.vue'
import TransparentCard from '@/components/TransparentCard.vue'
import ModalAlert from '@/components/ModalAlert.vue'

// Define row type separately from Pedido
type PedidoRow = Omit<Pedido, 'fechaPedido' | 'fechaLlegada' | 'totalPedido'> & {
  fechaPedido: string
  fechaLlegada?: string
  totalPedido?: string
  correoNombre: string
}

type Correo = CorreoPedido

// Format Date to dd-mm-aaaa
function formatDate(d?: string | Date): string {
  if (!d) return ''
  const dateObj = typeof d === 'string' ? new Date(d) : d
  if (isNaN(dateObj.getTime())) return ''
  const dd = String(dateObj.getDate()).padStart(2, '0')
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
  const yyyy = dateObj.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

// Parse dd-mm-aaaa back to Date
function parseDate(str: string): Date {
  const [dd, mm, yyyy] = str.split('-').map(Number)
  return new Date(yyyy, mm - 1, dd)
}

// Format currency
function formatCurrency(n?: number): string {
  if (n == null) return ''
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(n)
}

// Modal state
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalType = ref<'success' | 'danger' | 'warning' | 'info'>('info')

function openModal(
  title: string,
  message: string,
  type: 'success' | 'danger' | 'warning' | 'info'
) {
  modalTitle.value = title
  modalMessage.value = message
  modalType.value = type
  showModal.value = true
}
function handleClose() {
  showModal.value = false
}

// ColumnDef type for table component
interface ColumnDef {
  key: string
  label: string
  type: 'string' | 'number' | 'date'
  sortable?: boolean
}

// Table columns
const columns: ColumnDef[] = [
  { key: 'numeroPedido', label: 'Número', type: 'string', sortable: true },
  { key: 'fechaPedido', label: 'Fecha Pedido', type: 'date', sortable: true },
  { key: 'fechaLlegada', label: 'Fecha Llegada', type: 'date', sortable: true },
  { key: 'totalPedido', label: 'Total', type: 'string', sortable: true },
  { key: 'nota', label: 'Nota', type: 'string' },
  { key: 'correoNombre', label: 'Correo', type: 'string', sortable: true }
]

// Data
const rows = ref<PedidoRow[]>([])
const correos = ref<Correo[]>([])
const newPedido = ref<{
  numeroPedido: string
  fechaPedido: string
  fechaLlegada: string
  totalPedido: number
  nota: string
  idCorreoPedido: number
}>({
  numeroPedido: '',
  fechaPedido: '',
  fechaLlegada: '',
  totalPedido: 0,
  nota: '',
  idCorreoPedido: 0
})

onMounted(async () => {
  try {
    const [pedidosData, correosData] = await Promise.all([
      pedidoService.getAll(),
      correoPedidoService.getAll()
    ])
    correos.value = correosData
    rows.value = pedidosData.map(p => ({
      ...p,
      fechaPedido: formatDate(p.fechaPedido),
      fechaLlegada: formatDate(p.fechaLlegada),
      totalPedido: p.totalPedido != null ? formatCurrency(p.totalPedido) : '',
      correoNombre:
        correosData.find(c => c.idCorreoPedido === p.idCorreoPedido)
          ?.nombreCorreoPedido || ''
    }))
  } catch (error) {
    openModal('Error', 'No se pudieron obtener los datos.', 'danger')
  }
})

async function addPedido() {
  if (!newPedido.value.numeroPedido.trim() || !newPedido.value.fechaPedido) {
    openModal('Información Incompleta', 'Complete los datos obligatorios.', 'warning')
    return
  }
  if (!/^[0-9]+$/.test(newPedido.value.numeroPedido)) {
    openModal('Error', 'El número de pedido debe ser numérico.', 'danger')
    return
  }
  if (newPedido.value.totalPedido < 0) {
    openModal('Error', 'El precio no puede ser negativo.', 'danger')
    return
  }
  if (
    newPedido.value.fechaLlegada &&
    parseDate(newPedido.value.fechaLlegada) < parseDate(newPedido.value.fechaPedido)
  ) {
    openModal(
      'Error',
      'La fecha de llegada no puede ser anterior a la del pedido.',
      'danger'
    )
    return
  }
  const payload: Omit<Pedido, 'idPedido'> = {
    numeroPedido: newPedido.value.numeroPedido,
    fechaPedido: parseDate(newPedido.value.fechaPedido),
    fechaLlegada: newPedido.value.fechaLlegada
      ? parseDate(newPedido.value.fechaLlegada)
      : undefined,
    totalPedido: newPedido.value.totalPedido || undefined,
    nota: newPedido.value.nota || undefined,
    idCorreoPedido: newPedido.value.idCorreoPedido
  }
  try {
    const created = await pedidoService.create({ pedido: payload, productos: [] })
    rows.value.push({
      ...created,
      fechaPedido: formatDate(created.fechaPedido),
      fechaLlegada: formatDate(created.fechaLlegada),
      totalPedido:
        created.totalPedido != null ? formatCurrency(created.totalPedido) : '',
      correoNombre:
        correos.value.find(c => c.idCorreoPedido === created.idCorreoPedido)
          ?.nombreCorreoPedido || ''
    })
    newPedido.value = {
      numeroPedido: '',
      fechaPedido: '',
      fechaLlegada: '',
      totalPedido: 0,
      nota: '',
      idCorreoPedido: 0
    }
    openModal('¡Éxito!', 'Pedido creado correctamente.', 'success')
  } catch (error) {
    openModal('Error', 'No se pudo crear el pedido.', 'danger')
  }
}

function handleModify(ped: PedidoRow) {
  const num = prompt('Número del pedido:', ped.numeroPedido) || ped.numeroPedido
  const fechaStr = prompt(
    'Fecha del pedido (dd-mm-aaaa):',
    ped.fechaPedido
  ) || ped.fechaPedido
  const llegadaStr = prompt(
    'Fecha llegada (dd-mm-aaaa):',
    ped.fechaLlegada || ''
  ) || ''
  const precioInput = prompt(
    'Precio del pedido (solo números):',
    ped.totalPedido?.replace(/\D/g, '') || '0'
  ) || '0'
  const precioNum = parseFloat(precioInput)
  if (isNaN(precioNum) || precioNum < 0) {
    openModal('Error', 'Precio inválido.', 'danger')
    return
  }
  const payload: Pedido = {
    idPedido: ped.idPedido,
    numeroPedido: num,
    fechaPedido: parseDate(fechaStr),
    fechaLlegada: llegadaStr ? parseDate(llegadaStr) : undefined,
    totalPedido: precioNum,
    nota: ped.nota,
    idCorreoPedido: ped.idCorreoPedido
  }
  pedidoService
    .update(ped.idPedido, { pedido: payload, productos: [] })
    .then(updated => {
      const idx = rows.value.findIndex(r => r.idPedido === ped.idPedido)
      if (idx !== -1) {
        rows.value[idx] = {
          ...updated,
          fechaPedido: formatDate(updated.fechaPedido),
          fechaLlegada: formatDate(updated.fechaLlegada),
          totalPedido:
            updated.totalPedido != null ? formatCurrency(updated.totalPedido) : '',
          correoNombre:
            correos.value.find(c => c.idCorreoPedido === updated.idCorreoPedido)
              ?.nombreCorreoPedido || ''
        }
      }
      openModal('¡Éxito!', 'Pedido actualizado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo actualizar el pedido.', 'danger')
    })
}

function handleDelete(ped: PedidoRow) {
  if (!confirm(`¿Eliminar el pedido "${ped.numeroPedido}"?`)) return
  pedidoService
    .remove(ped.idPedido)
    .then(() => {
      rows.value = rows.value.filter(r => r.idPedido !== ped.idPedido)
      openModal('¡Éxito!', 'Pedido eliminado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo eliminar el pedido.', 'danger')
    })
}
</script>

<template>
  <div class="container mt-4">
    <h2>Gestión de Pedidos</h2>
    <TransparentCard>
      <div class="my-3">
        <h4>Agregar Nuevo Pedido</h4>
        <form @submit.prevent="addPedido" class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Número de Pedido</label>
            <input
              type="text"
              class="form-control"
              v-model="newPedido.numeroPedido"
              required
              pattern="^[0-9]+$"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Fecha Pedido</label>
            <input
              type="date"
              class="form-control"
              v-model="newPedido.fechaPedido"
              required
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Fecha Llegada</label>
            <input
              type="date"
              class="form-control"
              v-model="newPedido.fechaLlegada"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Total Pedido</label>
            <input
              type="number"
              class="form-control"
              v-model.number="newPedido.totalPedido"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Nota</label>
            <input
              type="text"
              class="form-control"
              v-model="newPedido.nota"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Correo Pedido</label>
            <select
              class="form-select"
              v-model.number="newPedido.idCorreoPedido"
              required
            >
              <option value="0" disabled>Seleccione un correo</option>
              <option
                v-for="c in correos"
                :key="c.idCorreoPedido"
                :value="c.idCorreoPedido"
              >
                {{ c.nombreCorreoPedido }}
              </option>
            </select>
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary">
              Agregar Pedido
            </button>
          </div>
        </form>
      </div>
      <div class="my-3">
        <h4>Listado de Pedidos</h4>
        <CategoryTable
          :columns="columns"
          :rows="rows"
          enableActions
          @modify="handleModify"
          @delete="handleDelete"
        />
      </div>
    </TransparentCard>
    <ModalAlert
      :show="showModal"
      :title="modalTitle"
      :message="modalMessage"
      :type="modalType"
      @close="handleClose"
    />
  </div>
</template>

<style scoped>
</style>
