<script setup lang="ts">

</script>

<template>
  <div class="frosted-card">
    <slot />
  </div>
</template>

<style scoped>
.frosted-card {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  position: relative;
}
</style>
