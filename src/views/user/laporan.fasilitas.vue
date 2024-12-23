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
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminLaporanFasilitas",
  data() {
    return {
      namaFasilitas: "",
      deskripsiKerusakan: "",
      status: "Belum Diperbaiki",
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
  methods: {
    async submitLaporan() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak tersedia. Silakan login kembali.");
        }

        const newLaporan = {
          namaFasilitas: this.namaFasilitas,
          deskripsiKerusakan: this.deskripsiKerusakan,
          status: this.status,
        };

        const response = await axios.post("http://localhost:5000/api/fasilitas", newLaporan, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.laporanFasilitas.push(response.data);

        this.namaFasilitas = "";
        this.deskripsiKerusakan = "";
        this.status = "Belum Diperbaiki";

        alert("Laporan berhasil dikirim.");
      } catch (error) {
        console.error("Error submitting laporan:", error.message);
        alert("Gagal mengirim laporan. Silakan coba lagi.");
      }
    },
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
