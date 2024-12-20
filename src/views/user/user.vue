<template>
  <div>
    <h1>Riwayat Tagihan</h1>
    <div>
      <label for="startDate">Tanggal Mulai:</label>
      <input type="date" v-model="startDate" id="startDate" />
    </div>
    <div>
      <label for="endDate">Tanggal Selesai:</label>
      <input type="date" v-model="endDate" id="endDate" />
    </div>
    <button @click="fetchBillHistory">Tampilkan Riwayat</button>

    <table v-if="billHistory.length">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Jumlah Tagihan</th>
          <th>Metode Pembayaran</th>
          <th>Bank</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bill in billHistory" :key="bill._id">
          <td>{{ formatDate(bill.created_at) }}</td>
          <td>{{ bill.total_bill }}</td>
          <td>{{ bill.payment_method }}</td>
          <td>{{ bill.bank_name || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>Tidak ada riwayat tagihan</p>

    <button @click="navigateToDashboard">Ke Dashboard Penghuni Lain</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      billHistory: [],
      userId: null,  
    };
  },
  created() {
    this.fetchUserIdFromToken();
  },
  methods: {
    async fetchUserIdFromToken() {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          console.error('No token found');
          return;
        }

        // Send the token to your session API for decoding
        const response = await axios.get('http://localhost:5000/api/session', {
          headers: {
            token: token, // Pass the token as 'token' in headers
          },
        });

        console.log('Session response:', response.data);

        this.userId = response.data.userId;
        console.log('User ID:', this.userId);  // Log the userId

      } catch (error) {
        console.error('Error fetching userId from token:', error);
      }
    },


    // Fetch bill history using the userId and date range
    async fetchBillHistory() {
      if (!this.userId) {
        console.error('User ID is missing. Make sure you are logged in.');
        return;
      }

      try {
        // Prepare the params object
        const params = {
          userId: this.userId,  // Always include the userId
        };

        // Add the startDate and endDate only if they are not empty
        if (this.startDate) {
          params.startDate = this.startDate;
        }
        if (this.endDate) {
          params.endDate = this.endDate;
        }

        // Make the request with the proper parameters and Authorization header
        const response = await axios.get('http://localhost:5000/rooms/bill-history', {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the Bearer token
          },
        });

        this.billHistory = response.data;
      } catch (error) {
        console.error('Error fetching bill history:', error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    navigateToDashboard() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
