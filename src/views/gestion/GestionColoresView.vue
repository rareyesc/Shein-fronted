<script setup lang="ts">
import { ref, onMounted } from 'vue'
import colorService, { Color } from '@/api/colorService'

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
    key: 'nombreColor' as const,
    label: 'Nombre del Color',
    type: 'string' as const,
    sortable: true,
  },
]

const rows = ref<Color[]>([])

const newColorName = ref('')

onMounted(async () => {
  try {
    const data = await colorService.getAll()
    rows.value = data
  } catch (error) {
    openModal('Error', 'No se pudo obtener la lista de colores.', 'danger')
  }
})

async function addColor() {
  if (!newColorName.value.trim()) {
    openModal('Información Incompleta', 'Ingrese el nombre del color.', 'info')
    return
  }
  try {
    const created = await colorService.create({ nombreColor: newColorName.value })
    rows.value.push(created)
    newColorName.value = ''
    openModal('¡Éxito!', 'Color creado correctamente.', 'success')
  } catch (error) {
    openModal('Error', 'No se pudo crear el color.', 'danger')
  }
}

function handleModify(col: Color) {
  const newName = prompt('Nuevo nombre del color:', col.nombreColor)
  if (!newName || !newName.trim()) return

  colorService
    .update(col.idColor, { idColor: col.idColor, nombreColor: newName })
    .then((updated) => {
      const idx = rows.value.findIndex((c) => c.idColor === col.idColor)
      if (idx !== -1) rows.value[idx] = updated
      openModal('¡Éxito!', 'Color actualizado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo actualizar el color.', 'danger')
    })
}

function handleDelete(col: Color) {
  const confirmDelete = confirm(`¿Eliminar el color "${col.nombreColor}"?`)
  if (!confirmDelete) return

  colorService
    .remove(col.idColor)
    .then(() => {
      rows.value = rows.value.filter((c) => c.idColor !== col.idColor)
      openModal('¡Éxito!', 'Color eliminado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo eliminar el color.', 'danger')
    })
}
</script>

<template>
  <div class="container mt-4">
    <h2>Gestión de Colores</h2>

    <TransparentCard>
      <div class="my-3">
        <h4>Agregar Nuevo Color</h4>
        <form @submit.prevent="addColor" class="row g-3">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Nombre del color"
              v-model="newColorName"
              required
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Agregar</button>
          </div>
        </form>
      </div>

      <div class="my-3">
        <h4>Listado de Colores</h4>
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
