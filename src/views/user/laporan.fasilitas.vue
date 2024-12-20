<template>
  <div>
    <h2>Laporan Kerusakan Fasilitas</h2>
    <form @submit.prevent="submitLaporan">
      <div>
        <label for="namaFasilitas">Nama Fasilitas:</label>
        <select v-model="namaFasilitas" id="namaFasilitas" required>
          <option disabled value="">Pilih Fasilitas</option>
          <option value="TV">TV</option>
          <option value="Meja belajar">Meja belajar</option>
          <option value="Kursi belajar">Kursi belajar</option>
          <option value="Tempat tidur ukuran queen">Tempat tidur ukuran queen</option>
        </select>
      </div>
      <div>
        <label for="deskripsiKerusakan">Deskripsi Kerusakan:</label>
        <textarea v-model="deskripsiKerusakan" id="deskripsiKerusakan" required></textarea>
      </div>
      <div>
        <label for="status">Status:</label>
        <select v-model="status" id="status">
          <option value="Belum Diperbaiki">Belum Diperbaiki</option>
          <option value="Sedang Diperbaiki">Sedang Diperbaiki</option>
          <option value="Diperbaiki">Diperbaiki</option>
        </select>
      </div>
      <div>
        <button type="submit">Kirim Laporan</button>
      </div>
    </form>

    <h3>Laporan yang Dikirim</h3>
    <ul>
      <li v-for="laporan in laporans" :key="laporan._id">
        <strong>{{ laporan.namaFasilitas }}</strong>: {{ laporan.deskripsiKerusakan }} (Status: {{ laporan.status }})
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      namaFasilitas: '',
      deskripsiKerusakan: '',
      status: 'Belum Diperbaiki',
      laporans: []
    };
  },
  methods: {
    async submitLaporan() {
      const laporanData = {
        namaFasilitas: this.namaFasilitas,
        deskripsiKerusakan: this.deskripsiKerusakan,
        status: this.status
      };

      try {
        const response = await fetch('http://localhost:5000/api/fasilitas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(laporanData)
        });

        const data = await response.json();
        
        if (response.ok) {
          this.laporans.push(data.laporan);
          this.namaFasilitas = '';
          this.deskripsiKerusakan = '';
          this.status = 'Belum Diperbaiki';
        } else {
          console.error(data.message); 
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error submitting laporan:', error);
        alert('Terjadi kesalahan saat mengirim laporan');
      }
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
/* Tambahkan gaya CSS jika perlu */
form {
  margin-bottom: 20px;
}
button {
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: darkblue;
}
</style>
