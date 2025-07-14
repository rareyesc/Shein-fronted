<script setup lang="ts">
import { ref } from 'vue'
import GestionCategoriasView from './gestion/GestionCategoriasView.vue'
import GestionSubcategoriasView from './gestion/GestionSubcategoriasView.vue'
import GestionGenerosView from './gestion/GestionGenerosView.vue'
import GestionColoresView from './gestion/GestionColoresView.vue'
import GestionTallasView from './gestion/GestionTallasView.vue'
import GestionEstadosView from './gestion/GestionEstadosView.vue'
import GestionCorreosPedidosView from './gestion/GestionCorreosPedidosView.vue'
import TransparentCard from '@/components/TransparentCard.vue'

interface Module {
  key: string
  label: string
  component: any
}

const modules: Module[] = [
  { key: 'categorias', label: 'Categorías', component: GestionCategoriasView },
  { key: 'subcategorias', label: 'Subcategorías', component: GestionSubcategoriasView },
  { key: 'generos', label: 'Géneros', component: GestionGenerosView },
  { key: 'colores', label: 'Colores', component: GestionColoresView },
  { key: 'tallas', label: 'Tallas', component: GestionTallasView },
  { key: 'estados', label: 'Estados', component: GestionEstadosView },
  { key: 'correos', label: 'Correos Pedidos', component: GestionCorreosPedidosView },
]

const selected = ref<Module | null>(null)

function selectModule(mod: Module) {
  selected.value = mod
}
</script>

<template>
  <div class="container mt-4">
    <h2>Gestión</h2>

    <div class="mb-3">
      <button
        v-for="mod in modules"
        :key="mod.key"
        class="btn btn-primary me-2 mb-2"
        @click="selectModule(mod)"
      >
        {{ mod.label }}
      </button>
    </div>

    <component v-if="selected" :is="selected.component" />
    <TransparentCard v-else class="text-center py-5">
      <h3 class="mb-3">Control y Gestión de Inventario</h3>
      <p>Seleccione un módulo para actualizar</p>
    </TransparentCard>
  </div>
</template>
