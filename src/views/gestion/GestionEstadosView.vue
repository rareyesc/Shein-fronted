<script setup lang="ts">
import { ref, onMounted } from 'vue'
import estadoService, { Estado } from '@/api/estadoService'

import CategoryTable from '@/components/CategoryTable.vue'
import TransparentCard from '@/components/TransparentCard.vue'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

function openModal(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info') {
  modal.alert(title, message, type)
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

async function handleModify(est: Estado) {
  const newName = await modal.prompt('Editar', 'Nuevo nombre del estado:', est.nombreEstado)
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

async function handleDelete(est: Estado) {
  const confirmDelete = await modal.confirm('Confirmar', `¿Eliminar el estado "${est.nombreEstado}"?`, 'warning')
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

  </div>
</template>
