<script setup lang="ts">
import { ref, onMounted } from 'vue'
import pedidoService, { type Pedido } from '@/api/pedidoService'
import correoPedidoService, { type CorreoPedido } from '@/api/correoPedidoService'

import CategoryTable from '@/components/CategoryTable.vue'
import TransparentCard from '@/components/TransparentCard.vue'
import ModalAlert from '@/components/ModalAlert.vue'

interface PedidoRow {
  idPedido: number
  numeroPedido: string
  fechaPedido: string
  fechaLlegada?: string
  totalPedido?: string
  nota?: string
  idCorreoPedido: number
  correoNombre: string
}

function formatDate(d: string | Date | undefined) {
  if (!d) return ''
  const dateObj = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(dateObj.getTime())) return ''
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  return `${day}-${month}-${year}`
}

function parseDate(str: string) {
  const [day, month, year] = str.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatCurrency(n?: number) {
  if (n === undefined || n === null) return ''
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n)
}

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalType = ref<'success' | 'danger' | 'warning' | 'info'>('info')

function openModal(
  title: string,
  message: string,
  type: 'success' | 'danger' | 'warning' | 'info',
) {
  modalTitle.value = title
  modalMessage.value = message
  modalType.value = type
  showModal.value = true
}

function handleClose() {
  showModal.value = false
}

const columns = [
  { key: 'numeroPedido' as const, label: 'Número', type: 'string' as const, sortable: true },
  { key: 'fechaPedido' as const, label: 'Fecha Pedido', type: 'date' as const, sortable: true },
  { key: 'fechaLlegada' as const, label: 'Fecha Llegada', type: 'date' as const, sortable: true },
  { key: 'totalPedido' as const, label: 'Precio Pedido', type: 'string' as const, sortable: true },
  { key: 'nota' as const, label: 'Nota', type: 'string' as const },
  { key: 'correoNombre' as const, label: 'Correo', type: 'string' as const, sortable: true },
]

const rows = ref<PedidoRow[]>([])
const correos = ref<CorreoPedido[]>([])

const newPedido = ref({
  numeroPedido: '',
  fechaPedido: '',
  fechaLlegada: '',
  totalPedido: 0,
  nota: '',
  idCorreoPedido: 0,
})

onMounted(async () => {
  try {
    const [pedidosData, correosData] = await Promise.all([
      pedidoService.getAll(),
      correoPedidoService.getAll(),
    ])
    correos.value = correosData
    rows.value = pedidosData.map((p) => ({
      ...p,
      fechaPedido: formatDate(p.fechaPedido),
      fechaLlegada: formatDate(p.fechaLlegada),
      totalPedido: p.totalPedido ? formatCurrency(p.totalPedido) : '',
      correoNombre:
        correosData.find((c) => c.idCorreoPedido === p.idCorreoPedido)?.nombreCorreoPedido || '',
    }))
  } catch (error) {
    openModal('Error', 'No se pudieron obtener los datos.', 'danger')
  }
})

async function addPedido() {
  if (!newPedido.value.numeroPedido.trim() || !newPedido.value.fechaPedido) {
    openModal('Información Incompleta', 'Complete los datos obligatorios.', 'info')
    return
  }

  if (!/^\d+$/.test(newPedido.value.numeroPedido)) {
    openModal('Error', 'El número de pedido debe ser numérico.', 'danger')
    return
  }

  if (newPedido.value.totalPedido < 0) {
    openModal('Error', 'El precio no puede ser negativo.', 'danger')
    return
  }

  if (
    newPedido.value.fechaLlegada &&
    new Date(newPedido.value.fechaLlegada) < new Date(newPedido.value.fechaPedido)
  ) {
    openModal(
      'Error',
      'La fecha de llegada no puede ser anterior a la del pedido.',
      'danger',
    )
    return
  }

  const pedidoPayload: Omit<Pedido, 'idPedido'> = {
    numeroPedido: newPedido.value.numeroPedido,
    fechaPedido: new Date(newPedido.value.fechaPedido),
    fechaLlegada: newPedido.value.fechaLlegada
      ? new Date(newPedido.value.fechaLlegada)
      : undefined,
    totalPedido: newPedido.value.totalPedido || undefined,
    nota: newPedido.value.nota || undefined,
    idCorreoPedido: newPedido.value.idCorreoPedido,
  }

  try {
    const created = await pedidoService.create({ pedido: pedidoPayload, productos: [] })
    rows.value.push({
      ...created,
      fechaPedido: formatDate(created.fechaPedido),
      fechaLlegada: formatDate(created.fechaLlegada),
      totalPedido: created.totalPedido ? formatCurrency(created.totalPedido) : '',
      correoNombre:
        correos.value.find((c) => c.idCorreoPedido === created.idCorreoPedido)?.nombreCorreoPedido || '',
    })
    newPedido.value = {
      numeroPedido: '',
      fechaPedido: '',
      fechaLlegada: '',
      totalPedido: 0,
      nota: '',
      idCorreoPedido: 0,
    }
    openModal('¡Éxito!', 'Pedido creado correctamente.', 'success')
  } catch (error) {
    openModal('Error', 'No se pudo crear el pedido.', 'danger')
  }
}

function handleModify(ped: PedidoRow) {
  const totalStr = prompt(
    'Nuevo precio del pedido:',
    ped.totalPedido ? ped.totalPedido.replace(/\D/g, '') : '',
  )
  if (totalStr === null) return

  const total = parseFloat(totalStr)
  if (Number.isNaN(total) || total < 0) {
    openModal('Error', 'Debe ingresar un precio válido y no negativo.', 'danger')
    return
  }

  const payload: Pedido = {
    idPedido: ped.idPedido,
    numeroPedido: ped.numeroPedido,
    fechaPedido: parseDate(ped.fechaPedido),
    fechaLlegada: ped.fechaLlegada ? parseDate(ped.fechaLlegada) : undefined,
    totalPedido: total,
    nota: ped.nota,
    idCorreoPedido: ped.idCorreoPedido,
  }

  pedidoService
    .update(ped.idPedido, { pedido: payload, productos: [] })
    .then(() => {
      const idx = rows.value.findIndex((p) => p.idPedido === ped.idPedido)
      if (idx !== -1) {
        rows.value[idx].totalPedido = formatCurrency(total)
      }
      openModal('¡Éxito!', 'Precio actualizado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo actualizar el pedido.', 'danger')
    })
}

function handleDelete(ped: PedidoRow) {
  const confirmDelete = confirm(`¿Eliminar el pedido "${ped.numeroPedido}"?`)
  if (!confirmDelete) return

  pedidoService
    .remove(ped.idPedido)
    .then(() => {
      rows.value = rows.value.filter((p) => p.idPedido !== ped.idPedido)
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
              placeholder="Número de pedido"
              v-model="newPedido.numeroPedido"
              pattern="^\d+$"
              required
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Fecha Pedido</label>
            <input type="date" class="form-control" v-model="newPedido.fechaPedido" required />
          </div>
          <div class="col-md-4">
            <label class="form-label">Fecha Llegada</label>
            <input type="date" class="form-control" v-model="newPedido.fechaLlegada" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Precio Pedido</label>
            <input
              type="number"
              step="0.01"
              min="0"
              class="form-control"
              placeholder="Precio del pedido"
              v-model.number="newPedido.totalPedido"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Nota</label>
            <input type="text" class="form-control" placeholder="Nota" v-model="newPedido.nota" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Correo Pedido</label>
            <select class="form-select" v-model.number="newPedido.idCorreoPedido" required>
              <option value="0" disabled>Seleccione un correo</option>
              <option v-for="c in correos" :key="c.idCorreoPedido" :value="c.idCorreoPedido">{{ c.nombreCorreoPedido }}</option>
            </select>
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary">Agregar</button>
          </div>
        </form>
      </div>

      <div class="my-3">
        <h4>Listado de Pedidos</h4>
        <CategoryTable :columns="columns" :rows="rows" enableActions @modify="handleModify" @delete="handleDelete" />
      </div>
    </TransparentCard>

    <ModalAlert :show="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" @close="handleClose" />
  </div>
</template>

<style scoped>
</style>
