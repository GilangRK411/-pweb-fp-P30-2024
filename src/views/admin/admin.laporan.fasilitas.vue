<template>
    <div class="laporan-fasilitas">
      <h1>Daftar Laporan Kerusakan Fasilitas</h1>
      <table>
        <thead>
          <tr>
            <th>Nama Fasilitas</th>
            <th>Deskripsi Kerusakan</th>
            <th>Tanggal Lapor</th>
            <th>Status</th>
            <th>Nama Penghuni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="laporan in laporanFasilitas" :key="laporan._id">
            <td>{{ laporan.namaFasilitas }}</td>
            <td>{{ laporan.deskripsiKerusakan }}</td>
            <td>{{ new Date(laporan.tanggalLapor).toLocaleDateString() }}</td>
            <td>{{ laporan.status }}</td>
            <td>{{ laporan.username }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "AdminLaporanFasilitas",
    data() {
      return {
        laporanFasilitas: [],
      };
    },
    async created() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak tersedia. Silakan login kembali.");
        }
  
        const response = await axios.get("http://localhost:5000/api/fasilitas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.laporanFasilitas = response.data;
      } catch (error) {
        console.error("Error fetching laporan fasilitas:", error.message);
        alert("Gagal mengambil data laporan. Silakan coba lagi.");
      }
    },
  };
  </script>
  
  <style scoped>
  .laporan-fasilitas {
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  </style>
  