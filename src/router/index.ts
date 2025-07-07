import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import InventarioListarView from '@/views/inventario/InventarioListarView.vue';
import InventarioAgregarView from '@/views/inventario/InventarioAgregarView.vue';
import GestionPedidosView from '@/views/inventario/GestionPedidosView.vue';
import CategoryView from '@/views/category/CategoryView.vue'
import GestionCategoriasView from '@/views/gestion/GestionCategoriasView.vue'
import GestionSubcategoriasView from '@/views/gestion/GestionSubcategoriasView.vue'
import GestionGenerosView from '@/views/gestion/GestionGenerosView.vue'
import GestionColoresView from '@/views/gestion/GestionColoresView.vue'
import GestionTallasView from '@/views/gestion/GestionTallasView.vue'
import GestionEstadosView from '@/views/gestion/GestionEstadosView.vue'
import GestionCorreosPedidosView from '@/views/gestion/GestionCorreosPedidosView.vue'

const routes: Array<RouteRecordRaw> = [    
  { path: '/', name: 'home', component: HomeView, },
  { path: '/about', name: 'about', component: AboutView, },

  { path: '/inventario/listar', name: 'inventario-listar', component: InventarioListarView, },
  { path: '/inventario/agregar', name: 'inventario-agregar', component: InventarioAgregarView, },
  { path: '/inventario/pedidos', name: 'inventario-pedidos', component: GestionPedidosView, },
  { path: '/categories', name: 'categories', component: CategoryView, },
  { path: '/gestion/categorias', name: 'gestion-categorias', component: GestionCategoriasView, },
  { path: '/gestion/subcategorias', name: 'gestion-subcategorias', component: GestionSubcategoriasView, },
  { path: '/gestion/generos', name: 'gestion-generos', component: GestionGenerosView },
  { path: '/gestion/colores', name: 'gestion-colores', component: GestionColoresView },
  { path: '/gestion/tallas', name: 'gestion-tallas', component: GestionTallasView },
  { path: '/gestion/estados', name: 'gestion-estados', component: GestionEstadosView },
  { path: '/gestion/correospedidos', name: 'gestion-correospedidos', component: GestionCorreosPedidosView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
