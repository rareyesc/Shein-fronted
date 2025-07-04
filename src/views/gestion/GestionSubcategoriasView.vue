<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Importamos el servicio de subcategorías
import subcategoriaService, { Subcategoria } from '@/api/subcategoriaService'
// Importamos el servicio de categorías (para obtener la lista y mostrarlas en un select)
import categoryService, { Categoria } from '@/api/categoryService'

// Opcional: ModalAlert y TransparentCard si los usas para tu diseño
import ModalAlert from '@/components/ModalAlert.vue'
import TransparentCard from '@/components/TransparentCard.vue'

// Estado del modal
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalType = ref<'success' | 'danger' | 'warning' | 'info'>('info')

function openModal(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info') {
  modalTitle.value = title
  modalMessage.value = message
  modalType.value = type
  showModal.value = true
}
function handleClose() {
  showModal.value = false
}

// Lista de categorías (para el dropdown)
const categories = ref<Categoria[]>([])
// Lista de subcategorías
const subcategories = ref<Subcategoria[]>([])

// Formulario para crear una nueva subcategoría
const newSubcatName = ref('')
const selectedCategoryId = ref<number>(0)

// Al montar, cargar categorías y subcategorías
onMounted(async () => {
  try {
    // Cargar todas las categorías
    const catResult = await categoryService.getAll()
    categories.value = catResult

    // Cargar todas las subcategorías
    const subcatResult = await subcategoriaService.getAll()
    subcategories.value = subcatResult
  } catch (error) {
    console.error(error)
    openModal('Error', 'No se pudo cargar la información.', 'danger')
  }
})

// Función para crear subcategoría
async function addSubcategoria() {
  // Validar
  if (!newSubcatName.value.trim() || selectedCategoryId.value === 0) {
    openModal('Información incompleta', 'Ingrese el nombre y seleccione la categoría.', 'info')
    return
  }

  try {
    const created = await subcategoriaService.create({
      nombreSubcategoria: newSubcatName.value,
      idCategoria: selectedCategoryId.value,
    })
    subcategories.value.push(created)

    // Limpiar formulario
    newSubcatName.value = ''
    selectedCategoryId.value = 0
    openModal('Éxito', 'Subcategoría creada correctamente.', 'success')
  } catch (error) {
    console.error(error)
    openModal('Error', 'No se pudo crear la subcategoría.', 'danger')
  }
}

// Modificar subcategoría (prompt sencillo)
async function modifySubcat(subcat: Subcategoria) {
  // Podrías usar un modal si prefieres
  const newName = prompt('Nuevo nombre de la subcategoría:', subcat.nombreSubcategoria)
  if (!newName || !newName.trim()) return // Cancelado

  try {
    const updated = await subcategoriaService.update(subcat.idSubcategoria, {
      ...subcat,
      nombreSubcategoria: newName,
    })
    // Actualizar la lista local
    const idx = subcategories.value.findIndex(s => s.idSubcategoria === subcat.idSubcategoria)
    if (idx !== -1) {
      subcategories.value[idx] = updated
    }
    openModal('Éxito', 'Subcategoría actualizada.', 'success')
  } catch (error) {
    console.error(error)
    openModal('Error', 'No se pudo actualizar la subcategoría.', 'danger')
  }
}

// Eliminar subcategoría
async function deleteSubcat(subcat: Subcategoria) {
  const confirmDelete = confirm(`¿Eliminar la subcategoría "${subcat.nombreSubcategoria}"?`)
  if (!confirmDelete) return

  try {
    await subcategoriaService.remove(subcat.idSubcategoria)
    subcategories.value = subcategories.value.filter(s => s.idSubcategoria !== subcat.idSubcategoria)
    openModal('Éxito', 'Subcategoría eliminada.', 'success')
  } catch (error) {
    console.error(error)
    openModal('Error', 'No se pudo eliminar la subcategoría.', 'danger')
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2>Gestión de Subcategorías</h2>

    <TransparentCard>
      <!-- Formulario para agregar subcategoría -->
      <div class="my-3">
        <h4>Agregar Nueva Subcategoría</h4>
        <form @submit.prevent="addSubcategoria" class="row g-3">
          <!-- Nombre Subcategoría -->
          <div class="col-auto">
            <input
              id="subcatName"
              type="text"
              class="form-control"
              v-model="newSubcatName"
              placeholder="Nombre de subcategoría"
              required
            />
          </div>

          <!-- Selección de Categoría -->
          <div class="col-auto">
            <select class="form-select" v-model="selectedCategoryId" required>
              <option value="0" disabled>Seleccione una categoría</option>
              <option v-for="cat in categories" :key="cat.idCategoria" :value="cat.idCategoria">
                {{ cat.nombreCategoria }}
              </option>
            </select>
          </div>

          <div class="col-auto">
            <button type="submit" class="btn btn-primary">
              Agregar
            </button>
          </div>
        </form>
      </div>

      <!-- Listado de subcategorías -->
      <div class="my-3">
        <h4>Listado de Subcategorías</h4>
        <table class="table table-hover table-striped table-bordered">
          <thead>
            <tr>
              <th>Subcategoría</th>
              <th>Categoría</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in subcategories" :key="sub.idSubcategoria">
              <td>{{ sub.nombreSubcategoria }}</td>
              <!-- Buscamos la categoría a la que pertenece -->
              <td>
                {{ categories.find(cat => cat.idCategoria === sub.idCategoria)?.nombreCategoria || 'Desconocida' }}
              </td>
              <td class="text-end">
                <button class="btn btn-warning me-2" @click="modifySubcat(sub)">
                  Modificar
                </button>
                <button class="btn btn-danger" @click="deleteSubcat(sub)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </TransparentCard>

    <!-- Modal para alertas -->
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
/* Personaliza si deseas */
</style>
