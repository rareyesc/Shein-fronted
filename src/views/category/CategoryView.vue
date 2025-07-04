<script setup lang="ts">
import { ref, onMounted } from 'vue'
import categoryService, { Categoria } from '@/api/categoryService'

// Estado local para las categorías
const categories = ref<Categoria[]>([])

// Estado local para un campo de formulario (crear categoría)
const newCategoryName = ref('')

// Cargar datos cuando se monta el componente
onMounted(async () => {
  try {
    const result = await categoryService.getAll()
    categories.value = result
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    alert('No se pudieron cargar las categorías')
  }
})

// Función para crear una categoría
const addCategory = async () => {
  try {
    // Llamamos al servicio para crear
    const createdCat = await categoryService.create({
      nombreCategoria: newCategoryName.value,
    })
    // Agregar la nueva categoría a la lista local
    categories.value.push(createdCat)
    // Limpiar el input
    newCategoryName.value = ''
    alert('Categoría creada con éxito')
  } catch (error) {
    console.error('Error al crear la categoría:', error)
    alert('No se pudo crear la categoría')
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2>Categorías</h2>

    <!-- Listado de categorías -->
    <ul>
      <li v-for="cat in categories" :key="cat.idCategoria">
        {{ cat.idCategoria }} - {{ cat.nombreCategoria }}
      </li>
    </ul>

    <!-- Formulario para agregar categoría -->
    <div class="mt-4">
      <h3>Agregar nueva categoría</h3>
      <form @submit.prevent="addCategory" class="row g-3">
        <div class="col-auto">
          <label for="catName" class="visually-hidden">Nombre de categoría</label>
          <input
            id="catName"
            type="text"
            class="form-control"
            v-model="newCategoryName"
            placeholder="Nombre de categoría"
            required
          />
        </div>
        <div class="col-auto">
          <button type="submit" class="btn btn-primary">Agregar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Estilos opcionales */
</style>
