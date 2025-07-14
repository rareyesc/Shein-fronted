<script setup lang="ts">

</script>

<template>
  <!-- Navbar con Bootstrap 5 -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light navbar-custom">
    <div class="container-fluid">
      <!-- Logo o título de la marca -->
      <router-link class="navbar-brand" to="/">Alaskiki Style</router-link>

      <!-- Botón de hamburguesa para colapsar navbar en móviles -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarSupportedContent" 
        aria-controls="navbarSupportedContent" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Secciones de la navbar -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Menú principal (izquierda) -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Home -->
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>

          <!-- About -->
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>

          <!-- Dropdown Inventario -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle" 
              href="#" 
              id="navbarDropdown"
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              Inventario
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link class="dropdown-item" to="/inventario/listar">
                  Listar Productos
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/inventario/agregar">
                  Agregar Producto
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/inventario/pedidos">
                  Gestionar Pedidos
                </router-link>
              </li>
            </ul>
          </li>
          <!-- Nueva sección: Gestión -->
          <li class="nav-item">
            <router-link class="nav-link" to="/gestion">Gestión</router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarReportes"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Reportes
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarReportes">
              <li>
                <router-link class="dropdown-item" to="/reportes/inventario">Inventario</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/reportes/ventas">Ventas</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
