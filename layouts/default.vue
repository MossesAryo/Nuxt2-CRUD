<template>
  <div>
    <Nav />
    <main class="page-content">
      <nuxt />
    </main>
  </div>
</template>

<script setup lang="ts">
import Nav from './partials/nav.vue';
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

* {
  box-sizing: border-box;
}

body, h1, h2, h3, h4, h5, h6, p, ul, ol {
  margin: 0;
  padding: 0;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.page-content {
  max-width: 1200px;     
  margin: 100px auto;    
  padding: 20px;
}
</style>
