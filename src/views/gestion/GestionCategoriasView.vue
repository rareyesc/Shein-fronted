<script setup lang="ts">
import { ref, onMounted } from 'vue'
import categoryService, { Categoria } from '@/api/categoryService'

// Componentes
import CategoryTable from '@/components/CategoryTable.vue'
import TransparentCard from '@/components/TransparentCard.vue'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

function openModal(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info') {
  modal.alert(title, message, type)
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
async function handleModify(cat: Categoria) {
  const newName = await modal.prompt('Editar', 'Nuevo nombre de la categoría:', cat.nombreCategoria)
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

async function handleDelete(cat: Categoria) {
  const confirmDelete = await modal.confirm('Confirmar', `¿Eliminar la categoría "${cat.nombreCategoria}"?`, 'warning')
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

  </div>
</template>

<style scoped>
/* Opcional */
</style>
