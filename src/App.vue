<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<template>
  <!-- Navbar que se muestra en todas las páginas -->
  <Navbar />

  <!-- Aquí se renderizan las vistas de tu router (Home, About, etc.) -->
  <router-view />
</template>

<style scoped>
</style>
