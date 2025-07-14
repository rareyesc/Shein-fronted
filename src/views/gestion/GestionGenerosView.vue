<script setup lang="ts">
import { ref, onMounted } from "vue";
import generoService, { Genero } from "@/api/generoService";

// Reutilizamos “CategoryTable” como tabla genérica
import CategoryTable from "@/components/CategoryTable.vue";
import TransparentCard from "@/components/TransparentCard.vue";
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

function openModal(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info') {
  modal.alert(title, message, type)
}

/**
 * DEFINIMOS LAS COLUMNAS DE LA TABLA
 *
 * Observa que “key: 'nombreGenero' as const”
 *  => coincide con “type GeneroKey = 'idGenero' | 'nombreGenero'”
 *    en el CategoryTable.vue
 */
const columns = [
  {
    key: "nombreGenero" as const,
    label: "Nombre del Género",
    type: "string" as const,
    sortable: true,
  },
];

/**
 * FILAS => array de Genero
 */
const rows = ref<Genero[]>([]);

/**
 * Para crear un nuevo género
 */
const newGeneroName = ref("");

/**
 * AL MONTAR => cargar la lista de géneros
 */
onMounted(async () => {
  try {
    const data = await generoService.getAll();
    rows.value = data;
  } catch (error) {
    openModal("Error", "No se pudo obtener la lista de géneros.", "danger");
  }
});

/**
 * CREAR GÉNERO
 */
async function addGenero() {
  if (!newGeneroName.value.trim()) {
    openModal(
      "Información Incompleta",
      "Ingrese el nombre del género.",
      "info",
    );
    return;
  }

  try {
    const created = await generoService.create({
      nombreGenero: newGeneroName.value,
    });
    rows.value.push(created);
    newGeneroName.value = "";
    openModal("¡Éxito!", "Género creado correctamente.", "success");
  } catch (error) {
    openModal("Error", "No se pudo crear el género.", "danger");
  }
}

/**
 * MANEJAR MODIFICAR
 * => prompt sencillo
 */
async function handleModify(gen: Genero) {
  const newName = await modal.prompt('Editar', 'Nuevo nombre del género:', gen.nombreGenero)
  if (!newName || !newName.trim()) return

  generoService
    .update(gen.idGenero, {
      idGenero: gen.idGenero,
      nombreGenero: newName,
    })
    .then((updated) => {
      // actualiza rows
      const idx = rows.value.findIndex((g) => g.idGenero === gen.idGenero);
      if (idx !== -1) rows.value[idx] = updated;
      openModal("¡Éxito!", "Género actualizado.", "success");
    })
    .catch(() => {
      openModal("Error", "No se pudo actualizar el género.", "danger");
    });
}

/**
 * MANEJAR ELIMINAR
 */
async function handleDelete(gen: Genero) {
  const confirmDelete = await modal.confirm('Confirmar', `¿Eliminar el género "${gen.nombreGenero}"?`, 'warning')
  if (!confirmDelete) return

  generoService
    .remove(gen.idGenero)
    .then(() => {
      rows.value = rows.value.filter((g) => g.idGenero !== gen.idGenero);
      openModal("¡Éxito!", "Género eliminado.", "success");
    })
    .catch(() => {
      openModal("Error", "No se pudo eliminar el género.", "danger");
    });
}
</script>

<template>
  <div class="container mt-4">
    <h2>Gestión de Géneros</h2>

    <TransparentCard>
      <!-- Form para crear género -->
      <div class="my-3">
        <h4>Agregar Nuevo Género</h4>
        <form @submit.prevent="addGenero" class="row g-3">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Nombre del género"
              v-model="newGeneroName"
              required
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Agregar</button>
          </div>
        </form>
      </div>

      <!-- Tabla de géneros -->
      <div class="my-3">
        <h4>Listado de Géneros</h4>
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
