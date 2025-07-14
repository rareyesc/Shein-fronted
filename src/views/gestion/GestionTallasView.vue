<script setup lang="ts">
import { ref, onMounted } from 'vue'
import tallaService, { Talla } from '@/api/tallaService'

import CategoryTable from '@/components/CategoryTable.vue'
import TransparentCard from '@/components/TransparentCard.vue'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

function openModal(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info') {
  modal.alert(title, message, type)
}

const columns = [
  {
    key: 'nombreTalla' as const,
    label: 'Nombre de la Talla',
    type: 'string' as const,
    sortable: true,
  },
]

const rows = ref<Talla[]>([])

const newTallaName = ref('')

onMounted(async () => {
  try {
    const data = await tallaService.getAll()
    rows.value = data
  } catch (error) {
    openModal('Error', 'No se pudo obtener la lista de tallas.', 'danger')
  }
})

async function addTalla() {
  if (!newTallaName.value.trim()) {
    openModal('Información Incompleta', 'Ingrese el nombre de la talla.', 'info')
    return
  }
  try {
    const created = await tallaService.create({ nombreTalla: newTallaName.value })
    rows.value.push(created)
    newTallaName.value = ''
    openModal('¡Éxito!', 'Talla creada correctamente.', 'success')
  } catch (error) {
    openModal('Error', 'No se pudo crear la talla.', 'danger')
  }
}

async function handleModify(tal: Talla) {
  const newName = await modal.prompt('Editar', 'Nuevo nombre de la talla:', tal.nombreTalla)
  if (!newName || !newName.trim()) return

  tallaService
    .update(tal.idTalla, { idTalla: tal.idTalla, nombreTalla: newName })
    .then((updated) => {
      const idx = rows.value.findIndex((t) => t.idTalla === tal.idTalla)
      if (idx !== -1) rows.value[idx] = updated
      openModal('¡Éxito!', 'Talla actualizada.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo actualizar la talla.', 'danger')
    })
}

async function handleDelete(tal: Talla) {
  const confirmDelete = await modal.confirm('Confirmar', `¿Eliminar la talla "${tal.nombreTalla}"?`, 'warning')
  if (!confirmDelete) return

  tallaService
    .remove(tal.idTalla)
    .then(() => {
      rows.value = rows.value.filter((t) => t.idTalla !== tal.idTalla)
      openModal('¡Éxito!', 'Talla eliminada.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo eliminar la talla.', 'danger')
    })
}
</script>

<template>
  <div class="container mt-4">
    <h2>Gestión de Tallas</h2>

    <TransparentCard>
      <div class="my-3">
        <h4>Agregar Nueva Talla</h4>
        <form @submit.prevent="addTalla" class="row g-3">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Nombre de la talla"
              v-model="newTallaName"
              required
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Agregar</button>
          </div>
        </form>
      </div>

      <div class="my-3">
        <h4>Listado de Tallas</h4>
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
