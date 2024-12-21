<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">Laporan Kerusakan Fasilitas</h2>

      <form @submit.prevent="submitLaporan">
        <!-- Nama Fasilitas -->
        <div class="mb-4">
          <label for="namaFasilitas" class="block text-sm font-semibold text-gray-700">Nama Fasilitas:</label>
          <select v-model="namaFasilitas" id="namaFasilitas" required
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-black">
            <option disabled value="">Pilih Fasilitas</option>
            <option class="text-black" value="TV">TV</option>
            <option class="text-black" value="Meja belajar">Meja belajar</option>
            <option class="text-black" value="Kursi belajar">Kursi belajar</option>
            <option class="text-black" value="Tempat tidur ukuran queen">Tempat tidur ukuran queen</option>
          </select>
        </div>

        <!-- Deskripsi Kerusakan -->
        <div class="mb-4">
          <label for="deskripsiKerusakan" class="block text-sm font-semibold text-gray-700">Deskripsi Kerusakan:</label>
          <textarea v-model="deskripsiKerusakan" id="deskripsiKerusakan" required
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-black"></textarea>
        </div>

        <!-- Status -->
        <div class="mb-6">
          <label for="status" class="block text-sm font-semibold text-black">Status:</label>
          <select v-model="status" id="status"
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-black">
            <option class="text-black" value="Belum Diperbaiki">Belum Diperbaiki</option>
            <option class="text-black" value="Sedang Diperbaiki">Sedang Diperbaiki</option>
            <option class="text-black" value="Diperbaiki">Diperbaiki</option>
          </select>
        </div>

        <!-- Submit Button -->
        <div>
          <button type="submit"
            class="w-full p-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
            Kirim Laporan
          </button>
        </div>
      </form>

      <!-- Display Submitted Reports -->
      <h3 class="text-xl font-semibold text-center mt-8">Laporan yang Dikirim</h3>
      <ul class="mt-4">
        <li v-for="laporan in laporans" :key="laporan._id" class="mb-2">
          <strong>{{ laporan.namaFasilitas }}</strong>: {{ laporan.deskripsiKerusakan }} (Status: {{ laporan.status }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      namaFasilitas: '',
      deskripsiKerusakan: '',
      status: 'Belum Diperbaiki',
      laporans: [],
    };
  },
  methods: {
    async submitLaporan() {
      try {
        const laporanData = {
          namaFasilitas: this.namaFasilitas,
          deskripsiKerusakan: this.deskripsiKerusakan,
          status: this.status,
        };

        await axios.post(
          'http://localhost:5000/api/laporan',
          laporanData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        alert('Laporan berhasil dikirim!');
        this.namaFasilitas = '';
        this.deskripsiKerusakan = '';
        this.status = 'Belum Diperbaiki';
      } catch (error) {
        console.error('Error submitting laporan:', error);
        alert('Gagal mengirim laporan.');
      }
    },
  },
  mounted() {
  },
};
</script>

<style scoped>
form {
  margin-bottom: 20px;
}

select:focus, textarea:focus {
  background-color: rgba(0, 0, 255, 0.1); 
}
</style>
