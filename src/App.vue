<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import GlobalModal from './components/GlobalModal.vue'
</script>

<template>
  <!-- Navbar que se muestra en todas las páginas -->
  <Navbar />

  <!-- Aquí se renderizan las vistas de tu router (Home, About, etc.) -->
  <router-view />
  <GlobalModal />
</template>

<style scoped>
</style>
