<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-4xl w-full p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">Daftar Laporan Kerusakan Fasilitas Penghuni</h1>

      <div v-if="isLoading" class="text-center text-blue-600 font-semibold mb-6">Memuat data...</div>

      <div v-else>
        <table class="w-full border-collapse mb-6">
          <thead>
            <tr>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">No</th>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Tanggal Submit</th>
              <th class="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Bukti</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(laporan, index) in laporanList" :key="laporan._id">
              <td class="border border-gray-300 p-3 text-black">{{ index + 1 }}</td>
              <td class="border border-gray-300 p-3 text-black">{{ laporan.details.description }}</td>
              <td class="border border-gray-300 p-3 text-black">{{ new Date(laporan.details.date).toLocaleDateString() }}</td>
              <td class="border border-gray-300 p-3 text-black">
                <ul>
                  <li v-for="(bukti, idx) in laporan.details.evidence" :key="idx">
                    <a :href="bukti" target="_blank" class="text-blue-600 hover:underline">Lihat Bukti {{ idx + 1 }}</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="laporanList.length === 0" class="text-center text-gray-500 font-semibold">
          Tidak ada laporan yang tersedia.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminLaporanPenghuni",
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
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://localhost:5000/api/penghuni", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.laporanList = response.data;
      } catch (error) {
        console.error("Error fetching laporan:", error);
        alert("Gagal memuat data laporan.");
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
