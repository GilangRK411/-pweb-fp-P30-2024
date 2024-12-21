<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-[40rem] w-full p-8 bg-white rounded-lg shadow-lg space-y-6">
      <h1 class="text-3xl font-bold text-center text-blue-600">Riwayat Tagihan</h1>

      <div v-if="billHistory.length > 0">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left text-black font-medium">Tanggal</th>
              <th class="px-4 py-2 text-left text-black font-medium">Jumlah Tagihan</th>
              <th class="px-4 py-2 text-left text-black font-medium">Metode Pembayaran</th>
              <th class="px-4 py-2 text-left text-black font-medium">Bank</th>
              <th class="px-4 py-2 text-left text-black font-medium">Jatuh Tempo</th> 
            </tr>
          </thead>
          <tbody>
            <tr v-for="bill in billHistory" :key="bill._id" class="border-t">
              <td class="px-4 py-2 text-black">{{ formatDate(bill.created_at) }}</td>
              <td class="px-4 py-2 text-black">{{ bill.total_bill }}</td>
              <td class="px-4 py-2 text-black">{{ bill.payment_method }}</td>
              <td class="px-4 py-2 text-black">{{ bill.bank_name || '-' }}</td>
              <td class="px-4 py-2 text-black">{{ calculateDueDate(bill.created_at, bill.rent_periods) }}</td> 
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-center text-gray-500">Data kosong. Tidak ada riwayat tagihan.</p>

      <button 
        @click="navigateToSewa" 
        class="w-full p-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 mt-6"
      >
        Sewa Kos
      </button>
    </div>
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

        if (this.billHistory.length === 0) {
          console.log('No bills found');
        }
      } catch (error) {
        console.error('Error fetching bill history:', error);
      }
    },

    formatDate(date) {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');  
      const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
      const year = d.getFullYear();

      return `${day}/${month}/${year}`;
    },

    calculateDueDate(createdAt, rentPeriods) {
      const createdDate = new Date(createdAt);
      createdDate.setMonth(createdDate.getMonth() + rentPeriods); 

      return this.formatDate(createdDate);
    },

    navigateToSewa() {
      this.$router.push('/user/sewa');
    },
  },
};
</script>

<style scoped>
  table th, table td {
    border-bottom-width: 1px;
    border-color: #e5e7eb; 
  }
</style>