<script setup lang="ts">
import { ref, onMounted } from 'vue'
import estadoService, { Estado } from '@/api/estadoService'

import CategoryTable from '@/components/CategoryTable.vue'
import TransparentCard from '@/components/TransparentCard.vue'
import ModalAlert from '@/components/ModalAlert.vue'

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
  {
    key: 'nombreEstado' as const,
    label: 'Nombre del Estado',
    type: 'string' as const,
    sortable: true,
  },
]

const rows = ref<Estado[]>([])

const newEstadoName = ref('')

onMounted(async () => {
  try {
    const data = await estadoService.getAll()
    rows.value = data
  } catch (error) {
    openModal('Error', 'No se pudo obtener la lista de estados.', 'danger')
  }
})

async function addEstado() {
  if (!newEstadoName.value.trim()) {
    openModal('Información Incompleta', 'Ingrese el nombre del estado.', 'info')
    return
  }
  try {
    const created = await estadoService.create({ nombreEstado: newEstadoName.value })
    rows.value.push(created)
    newEstadoName.value = ''
    openModal('¡Éxito!', 'Estado creado correctamente.', 'success')
  } catch (error) {
    openModal('Error', 'No se pudo crear el estado.', 'danger')
  }
}

function handleModify(est: Estado) {
  const newName = prompt('Nuevo nombre del estado:', est.nombreEstado)
  if (!newName || !newName.trim()) return

  estadoService
    .update(est.idEstado, { idEstado: est.idEstado, nombreEstado: newName })
    .then((updated) => {
      const idx = rows.value.findIndex((e) => e.idEstado === est.idEstado)
      if (idx !== -1) rows.value[idx] = updated
      openModal('¡Éxito!', 'Estado actualizado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo actualizar el estado.', 'danger')
    })
}

function handleDelete(est: Estado) {
  const confirmDelete = confirm(`¿Eliminar el estado "${est.nombreEstado}"?`)
  if (!confirmDelete) return

  estadoService
    .remove(est.idEstado)
    .then(() => {
      rows.value = rows.value.filter((e) => e.idEstado !== est.idEstado)
      openModal('¡Éxito!', 'Estado eliminado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo eliminar el estado.', 'danger')
    })
}
</script>

<template>
  <div class="container mt-4">
    <h2>Gestión de Estados</h2>

    <TransparentCard>
      <div class="my-3">
        <h4>Agregar Nuevo Estado</h4>
        <form @submit.prevent="addEstado" class="row g-3">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Nombre del estado"
              v-model="newEstadoName"
              required
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Agregar</button>
          </div>
        </form>
      </div>

      <div class="my-3">
        <h4>Listado de Estados</h4>
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
