<template>
    <div>
      <h1>Fasilitas Kost</h1>
      <div class="carousel">
        <div v-for="(item, index) in facilities" :key="index">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        facilities: [
          { name: 'WiFi', description: 'Internet gratis dengan kecepatan tinggi' },
          { name: 'Laundry', description: 'Layanan laundry tersedia' },
          { name: 'Parkir', description: 'Area parkir luas dan aman' },
        ],
      };
    },
  };
  </script>
  