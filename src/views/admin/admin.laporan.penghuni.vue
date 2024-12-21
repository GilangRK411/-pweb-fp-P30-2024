<template>
    <div class="laporan-penghuni">
      <h1>Daftar Laporan Kerusakan Fasilitas</h1>
      <div v-if="isLoading" class="loading">Memuat data...</div>
      <div v-else>
        <table class="laporan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Deskripsi</th>
              <th>Tanggal Submit</th>
              <th>Bukti</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(laporan, index) in laporanList" :key="laporan._id">
              <td>{{ index + 1 }}</td>
              <td>{{ laporan.details.description }}</td>
              <td>{{ new Date(laporan.details.date).toLocaleDateString() }}</td>
              <td>
                <ul>
                  <li v-for="(bukti, idx) in laporan.details.evidence" :key="idx">
                    <a :href="bukti" target="_blank">Lihat Bukti {{ idx + 1 }}</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="laporanList.length === 0" class="no-data">
          Tidak ada laporan yang tersedia.
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AdminLaporanPenghuni',
    data() {
      return {
        laporanList: [],
        isLoading: false,
      };
    },
    methods: {
      async fetchLaporan() {
        this.isLoading = true;
        try {
          const token = localStorage.getItem('token'); // Ambil token dari localStorage
          const response = await axios.get('http://localhost:5000/api/penghuni', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.laporanList = response.data;
        } catch (error) {
          console.error('Error fetching laporan:', error);
          alert('Gagal memuat data laporan.');
        } finally {
          this.isLoading = false;
        }
      },
    },
    mounted() {
      this.fetchLaporan();
    },
  };
  </script>
  
  <style scoped>
  .laporan-penghuni {
    padding: 20px;
  }
  
  .laporan-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .laporan-table th,
  .laporan-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
  }
  
  .laporan-table th {
    background-color: #f4f4f4;
  }
  
  .no-data {
    margin-top: 20px;
    font-style: italic;
    color: #666;
  }
  
  .loading {
    font-size: 16px;
    font-weight: bold;
    color: #007bff;
  }
  </style>
  