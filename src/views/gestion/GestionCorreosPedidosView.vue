<script setup lang="ts">
import { ref, onMounted } from 'vue'
import correoPedidoService, { CorreoPedido } from '@/api/correoPedidoService'

import CategoryTable from '@/components/CategoryTable.vue'
import TransparentCard from '@/components/TransparentCard.vue'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

function openModal(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info') {
  modal.alert(title, message, type)
}

const columns = [
  {
    key: 'nombreCorreoPedido' as const,
    label: 'Nombre del Correo',
    type: 'string' as const,
    sortable: true,
  },
]

const rows = ref<CorreoPedido[]>([])

const newCorreoName = ref('')

onMounted(async () => {
  try {
    const data = await correoPedidoService.getAll()
    rows.value = data
  } catch (error) {
    openModal('Error', 'No se pudo obtener la lista de correos.', 'danger')
  }
})

async function addCorreo() {
  if (!newCorreoName.value.trim()) {
    openModal('Información Incompleta', 'Ingrese el nombre del correo.', 'info')
    return
  }
  try {
    const created = await correoPedidoService.create({ nombreCorreoPedido: newCorreoName.value })
    rows.value.push(created)
    newCorreoName.value = ''
    openModal('¡Éxito!', 'Correo creado correctamente.', 'success')
  } catch (error) {
    openModal('Error', 'No se pudo crear el correo.', 'danger')
  }
}

async function handleModify(cor: CorreoPedido) {
  const newName = await modal.prompt('Editar', 'Nuevo nombre del correo:', cor.nombreCorreoPedido)
  if (!newName || !newName.trim()) return

  correoPedidoService
    .update(cor.idCorreoPedido, { idCorreoPedido: cor.idCorreoPedido, nombreCorreoPedido: newName })
    .then((updated) => {
      const idx = rows.value.findIndex((c) => c.idCorreoPedido === cor.idCorreoPedido)
      if (idx !== -1) rows.value[idx] = updated
      openModal('¡Éxito!', 'Correo actualizado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo actualizar el correo.', 'danger')
    })
}

async function handleDelete(cor: CorreoPedido) {
  const confirmDelete = await modal.confirm('Confirmar', `¿Eliminar el correo "${cor.nombreCorreoPedido}"?`, 'warning')
  if (!confirmDelete) return

  correoPedidoService
    .remove(cor.idCorreoPedido)
    .then(() => {
      rows.value = rows.value.filter((c) => c.idCorreoPedido !== cor.idCorreoPedido)
      openModal('¡Éxito!', 'Correo eliminado.', 'success')
    })
    .catch(() => {
      openModal('Error', 'No se pudo eliminar el correo.', 'danger')
    })
}
</script>

<template>
  <div class="container mt-4">
    <h2>Gestión de Correos de Pedido</h2>

    <TransparentCard>
      <div class="my-3">
        <h4>Agregar Nuevo Correo</h4>
        <form @submit.prevent="addCorreo" class="row g-3">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Nombre del correo"
              v-model="newCorreoName"
              required
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Agregar</button>
          </div>
        </form>
      </div>

      <div class="my-3">
        <h4>Listado de Correos</h4>
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
