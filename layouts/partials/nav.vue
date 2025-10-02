<template>
  <header>
    <nuxt-link to="/" class="logo">Barang.id</nuxt-link>
    <nav>
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/about">About</nuxt-link></li>
        <li><nuxt-link to="/kategori">kategori</nuxt-link></li>
        <li><nuxt-link to="/barang">Barang</nuxt-link></li>
        <li><nuxt-link to="/contact">Contact</nuxt-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Nav'
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2724fb;
  padding: 1rem 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

nav ul {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

nav a:hover {
  color: #d4f7dd;
}
</style>
