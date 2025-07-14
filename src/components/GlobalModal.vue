<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()
const { show, title, message, type, mode, inputValue } = storeToRefs(modal)

const headerClass = computed(() => {
  switch (type.value) {
    case 'success':
      return 'bg-success text-white'
    case 'danger':
      return 'bg-danger text-white'
    case 'warning':
      return 'bg-warning'
    case 'info':
      return 'bg-info text-white'
    default:
      return 'bg-primary text-white'
  }
})

function close(result: any) {
  modal.close(result)
}
</script>

<template>
  <teleport to="body">
    <div v-if="show">
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div :class="['modal-header', headerClass]">
              <h5 class="modal-title">{{ title }}</h5>
              <button type="button" class="btn-close" @click="close(mode === 'confirm' ? false : mode === 'prompt' ? null : undefined)"></button>
            </div>
            <div class="modal-body">
              <p>{{ message }}</p>
              <input v-if="mode === 'prompt'" type="text" class="form-control" v-model="inputValue" />
            </div>
            <div class="modal-footer">
              <button v-if="mode === 'alert'" type="button" class="btn btn-primary" @click="close(undefined)">Aceptar</button>
              <template v-else-if="mode === 'confirm'">
                <button type="button" class="btn btn-secondary" @click="close(false)">Cancelar</button>
                <button type="button" class="btn btn-primary" @click="close(true)">Aceptar</button>
              </template>
              <template v-else-if="mode === 'prompt'">
                <button type="button" class="btn btn-secondary" @click="close(null)">Cancelar</button>
                <button type="button" class="btn btn-primary" @click="close(inputValue)">Aceptar</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1055;
}
.modal {
  z-index: 1056;
}
</style>
