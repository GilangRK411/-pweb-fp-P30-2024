<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">Laporan Penghuni</h1>
      
      <!-- Form to submit a new report -->
      <form @submit.prevent="submitLaporan">
        <div class="mb-4">
          <label for="namaPenghuni" class="block text-sm font-semibold text-gray-700">Nama Penghuni:</label>
          <input v-model="newLaporan.namaPenghuni" id="namaPenghuni" required
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        <div class="mb-4">
          <label for="description" class="block text-sm font-semibold text-gray-700">Deskripsi:</label>
          <textarea v-model="newLaporan.details.description" id="description" required
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        
        <div class="mb-4">
          <label for="evidence" class="block text-sm font-semibold text-gray-700">Bukti (opsional):</label>
          <input v-model="newLaporan.details.evidence" id="evidence" placeholder="Pisahkan URL dengan koma"
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        <div class="mb-6">
          <label for="adminNotes" class="block text-sm font-semibold text-gray-700">Catatan Admin (opsional):</label>
          <textarea v-model="newLaporan.adminNotes" id="adminNotes"
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        
        <button type="submit"
          class="w-full p-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
          Kirim Laporan
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newLaporan: {
        namaPenghuni: '',
        details: {
          description: '',
          evidence: []
        },
        adminNotes: ''
      },
      laporan: []  
    };
  },
  methods: {
    async submitLaporan() {
      try {
        const evidenceArray = this.newLaporan.details.evidence.split(',').map(item => item.trim());
        const laporanData = {
          ...this.newLaporan,
          details: {
            ...this.newLaporan.details,
            evidence: evidenceArray
          }
        };
        await axios.post('http://localhost:5000/api/laporan', laporanData);
        alert('Laporan berhasil dikirim!');
        this.newLaporan = {
          namaPenghuni: '',
          details: {
            description: '',
            evidence: []
          },
          adminNotes: ''
        };
      } catch (error) {
        console.error('Error submitting laporan:', error);
        alert('Gagal mengirim laporan.');
      }
    }
  }
};
</script>

<style scoped>
</style>
