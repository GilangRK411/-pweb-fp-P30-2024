<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-4xl w-full p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">Daftar Laporan Kerusakan Fasilitas</h1>

      <div v-if="isLoading" class="text-center text-blue-600 font-semibold mb-6">Memuat data...</div>

      <div v-else>
        <table class="w-full border-collapse mb-6">
          <thead>
            <tr>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">No</th>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Nama Fasilitas</th>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Deskripsi Kerusakan</th>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Tanggal Lapor</th>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Nama Penghuni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(laporan, index) in laporanFasilitas" :key="laporan._id">
              <td class="border border-gray-300 p-3">{{ index + 1 }}</td>
              <td class="border border-gray-300 p-3">{{ laporan.namaFasilitas }}</td>
              <td class="border border-gray-300 p-3">{{ laporan.deskripsiKerusakan }}</td>
              <td class="border border-gray-300 p-3">{{ new Date(laporan.tanggalLapor).toLocaleDateString() }}</td>
              <td class="border border-gray-300 p-3">{{ laporan.status }}</td>
              <td class="border border-gray-300 p-3">{{ laporan.username }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="laporanFasilitas.length === 0" class="text-center text-gray-500 font-semibold">
          Tidak ada laporan yang tersedia.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminLaporanFasilitas",
  data() {
    return {
      laporanFasilitas: [],
      isLoading: false,
    };
  },
  async created() {
    this.isLoading = true;
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
    } finally {
      this.isLoading = false;
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
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

ul {
  list-style: none;
  padding: 0;
}

a {
  color: #007bff;
}

a:hover {
  text-decoration: underline;
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
