<template>
  <div>
    <h1>Riwayat Tagihan</h1>
    
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

        const response = await axios.get('http://localhost:5000/api/session', {
          headers: {
            token: token,
          },
        });

        this.userId = response.data.userId;
        if (this.userId) {
          this.fetchBillHistory();
        }
      } catch (error) {
        console.error('Error fetching userId from token:', error);
      }
    },

    async fetchBillHistory() {
      if (!this.userId) {
        console.error('User ID is missing. Make sure you are logged in.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/rooms/bill-history', {
          params: { userId: this.userId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
