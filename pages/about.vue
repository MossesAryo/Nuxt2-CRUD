<template>
  <div class="container">
    <div>
      
      <h1 class="title">
        About Sobat Teknologi
      </h1>
      <h2 class="description">
        Sobat Teknologi is a technology blog that provides the latest news and tutorials on web development, programming, and software engineering.
      </h2>
    </div>
  </div>
</template>

<script>
export default {
    transitions: 'bounce',
  name: 'AboutPage'
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.description {
  font-weight: 50;
  font-size: 15px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}


</style>
