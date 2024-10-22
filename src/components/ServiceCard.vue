<template>
    <div class="service-card">
      <h3>{{ service.name }}</h3>
      <p>{{ service.description }}</p>
      <router-link :to="'/booking/' + service.id">Забронировать</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ServiceCard',
    props: ['service']
  };
  </script>
  
  <style scoped>
  .service-card {
    border: 1px solid #ccc;
    padding: 20px;
    margin-bottom: 10px;
  }
  </style>
  