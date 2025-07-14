<script setup lang="ts">
import { ref, watch } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')

const errors = ref({
  name: '',
  email: '',
  password: ''
})

function validateName() {
  errors.value.name = name.value.trim() ? '' : 'Nombre requerido'
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errors.value.email = emailRegex.test(email.value)
    ? ''
    : 'Correo electrónico inválido'
}

function validatePassword() {
  errors.value.password =
    password.value.length >= 6
      ? ''
      : 'La contraseña debe tener al menos 6 caracteres'
}

watch(name, validateName, { immediate: true })
watch(email, validateEmail, { immediate: true })
watch(password, validatePassword, { immediate: true })

function handleSubmit() {
  validateName()
  validateEmail()
  validatePassword()

  if (!errors.value.name && !errors.value.email && !errors.value.password) {
    alert('Formulario válido!')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">Nombre</label>
      <input
        type="text"
        class="form-control"
        v-model="name"
        :class="{ 'is-invalid': errors.name, 'is-valid': !errors.name && name }"
      />
      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Correo Electrónico</label>
      <input
        type="email"
        class="form-control"
        v-model="email"
        :class="{ 'is-invalid': errors.email, 'is-valid': !errors.email && email }"
      />
      <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Contraseña</label>
      <input
        type="password"
        class="form-control"
        v-model="password"
        :class="{ 'is-invalid': errors.password, 'is-valid': !errors.password && password }"
      />
      <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
    </div>

    <button type="submit" class="btn btn-primary">Enviar</button>
  </form>
</template>
