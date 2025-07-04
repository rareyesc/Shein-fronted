<script setup lang="ts">
import { ref, onMounted } from 'vue'
import categoryService, { Categoria } from '@/api/categoryService'

// Componentes
import CategoryTable from '@/components/CategoryTable.vue'
import TransparentCard from '@/components/TransparentCard.vue'
import ModalAlert from '@/components/ModalAlert.vue'

// Estado del modal
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalType = ref<'success' | 'danger' | 'warning' | 'info'>('info')

// Funciones del modal
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

/**
 * Definimos la(s) columna(s) de la tabla.
 * - key: 'nombreCategoria' (o 'idCategoria' si quisieras)
 * - label: el encabezado a mostrar
 * - type: 'string' (literal)
 * - sortable: true (para permitir ordenar)
 */
 const columns = [
  {
    key: 'nombreCategoria' as const,
    label: 'Nombre de la Categoría',
    type: 'string' as const,
    sortable: true,
  },
]

// Aquí guardamos las categorías a mostrar en la tabla
const rows = ref<Categoria[]>([])

// Para crear una nueva categoría
const newCategoryName = ref('')

// Al montar, cargamos las categorías
onMounted(async () => {
  try {
    const data = await categoryService.getAll()
    rows.value = data
  } catch (error) {
    openModal('Error', 'No se pudo obtener las categorías.', 'danger')
  }
})

// Crear categoría
async function addCategory() {
  if (!newCategoryName.value.trim()) {
    openModal('Información Incompleta', 'Ingresa el nombre de la categoría.', 'info')
    return
  }
  try {
    const createdCat = await categoryService.create({ nombreCategoria: newCategoryName.value })
    rows.value.push(createdCat)
    newCategoryName.value = ''
    openModal('¡Éxito!', 'Categoría creada correctamente.', 'success')
  } catch (error) {
    openModal('Error', 'No se pudo crear la categoría.', 'danger')
  }
}

/**
 * handleModify y handleDelete deben recibir un cat: Categoria
 * => coincide con CategoryTable.vue, que emite (e: 'modify', cat: Categoria)
 */
function handleModify(cat: Categoria) {
  const newName = prompt('Nuevo nombre de la categoría:', cat.nombreCategoria)
  if (!newName || !newName.trim()) return

  categoryService
    .update(cat.idCategoria, {
      idCategoria: cat.idCategoria,
      nombreCategoria: newName,
    })
    .then((updated) => {
      const idx = rows.value.findIndex((c) => c.idCategoria === cat.idCategoria)
      if (idx !== -1) rows.value[idx] = updated
      openModal('¡Éxito!', 'Categoría actualizada.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo actualizar la categoría.', 'danger')
    })
}

function handleDelete(cat: Categoria) {
  const confirmDelete = confirm(`¿Eliminar la categoría "${cat.nombreCategoria}"?`)
  if (!confirmDelete) return

  categoryService
    .remove(cat.idCategoria)
    .then(() => {
      rows.value = rows.value.filter((c) => c.idCategoria !== cat.idCategoria)
      openModal('¡Éxito!', 'Categoría eliminada.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo eliminar la categoría.', 'danger')
    })
}
</script>

<template>
  <div class="container mt-4">
    <b><h2>Gestión de Categorías</h2></b>

    <TransparentCard>
      <!-- Formulario de crear categoría -->
      <div class="my-3">
        <h4>Agregar Nueva Categoría</h4>
        <form @submit.prevent="addCategory" class="row g-3">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Nombre de categoría"
              v-model="newCategoryName"
              required
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Agregar</button>
          </div>
        </form>
      </div>

      <!-- Tabla de categorías -->
      <div class="my-3">
        <h4>Listado de Categorías</h4>
        <CategoryTable
          :columns="columns"
          :rows="rows"
          enableActions
          @modify="handleModify"
          @delete="handleDelete"
        />
      </div>
    </TransparentCard>

    <!-- Modal Alertas -->
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
/* Opcional */
</style>
