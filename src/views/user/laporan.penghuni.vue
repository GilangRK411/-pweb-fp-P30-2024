<template>
    <div class="laporan-penghuni">
      <h1>Laporan Penghuni</h1>
      
      <!-- Form to submit a new report -->
      <form @submit.prevent="submitLaporan">
        <div>
          <label for="namaPenghuni">Nama Penghuni:</label>
          <input v-model="newLaporan.namaPenghuni" id="namaPenghuni" required />
        </div>
        
        <div>
          <label for="description">Deskripsi:</label>
          <textarea v-model="newLaporan.details.description" id="description" required></textarea>
        </div>
        
        <div>
          <label for="evidence">Bukti (opsional):</label>
          <input v-model="newLaporan.details.evidence" id="evidence" placeholder="Pisahkan URL dengan koma" />
        </div>
        
        <div>
          <label for="adminNotes">Catatan Admin (opsional):</label>
          <textarea v-model="newLaporan.adminNotes" id="adminNotes"></textarea>
        </div>
        
        <button type="submit">Kirim Laporan</button>
      </form>
      
      <!-- Display all reports -->
      <div class="reports">
        <h2>Daftar Laporan</h2>
        <div v-if="laporan.length === 0">Tidak ada laporan.</div>
        <ul>
          <li v-for="report in laporan" :key="report._id">
            <h3>{{ report.namaPenghuni }}</h3>
            <p>{{ report.details.description }}</p>
            <p><strong>Tanggal Lapor:</strong> {{ new Date(report.tanggalLapor).toLocaleString() }}</p>
            <p v-if="report.details.evidence.length > 0"><strong>Bukti:</strong> {{ report.details.evidence.join(', ') }}</p>
            <p v-if="report.adminNotes"><strong>Catatan Admin:</strong> {{ report.adminNotes }}</p>
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
          // Optionally remove the fetchLaporan call since it's removed
        } catch (error) {
          console.error('Error submitting laporan:', error);
          alert('Gagal mengirim laporan.');
        }
      }
    }
  };
  </script>
  
  <style>
  .laporan-penghuni {
    max-width: 600px;
    margin: 0 auto;
  }
  
  form {
    margin-bottom: 20px;
  }
  
  form div {
    margin-bottom: 10px;
  }
  
  button {
    padding: 10px 15px;
  }
  
  .reports {
    margin-top: 20px;
  }
  
  .reports ul {
    list-style-type: none;
    padding: 0;
  }
  
  .reports li {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  </style>
  