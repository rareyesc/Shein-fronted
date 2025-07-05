<script setup lang="ts">
import { defineProps } from 'vue'
import type { Producto } from '@/api/productoService'

const { product } = defineProps<{ product: Producto }>()
</script>

<template>
  <div class="card h-100 border">
    <img
      v-if="product.imagen"
      :src="product.imagen"
      class="card-img-top"
      alt="Imagen del producto"
    />
    <div class="card-body">
      <p class="card-text mb-0">{{ product.sku }}</p>
      <p class="card-text mb-0"><strong>Precio compra:</strong> {{ product.precioCompra }}</p>
      <p class="card-text mb-0"><strong>Precio sin descuento:</strong> {{ product.precioSinDescuento }}</p>
      <p class="card-text"><strong>Precio venta:</strong> {{ product.precioVenta }}</p>
    </div>
  </div>
</template>

<style scoped>
.card-img-top {
  object-fit: contain;
  width: 100%;
  height: 200px;
}
</style>
