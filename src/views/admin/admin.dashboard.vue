<template>
    <div>
      <h1>Peraturan Kost</h1>
      <ul>
        <li v-for="(rule, index) in rules" :key="index">{{ rule }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        rules: [
          'Dilarang membawa hewan peliharaan',
          'Dilarang merokok di dalam kamar',
          'Bayar sewa tepat waktu',
        ],
      };
    },
  };
  </script>