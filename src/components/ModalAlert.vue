<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  show: boolean
  title: string
  message: string
  type?: 'success' | 'danger' | 'warning' | 'info'
}>()

const emits = defineEmits<(e: 'close') => void>()

const headerClass = computed(() => {
  switch (props.type) {
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

function closeModal() {
  emits('close')
}
</script>

<template>
  <!-- Mostramos el teleport solo si show === true -->
  <teleport to="body">
    <div v-if="show">
      <!-- Backdrop -->
      <div class="modal-backdrop fade show"></div>
      
      <!-- Modal -->
      <div class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div :class="['modal-header', headerClass]">
              <h5 class="modal-title">{{ title }}</h5>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Cerrar
              </button>
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
