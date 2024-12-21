<template>
  <nav class="bg-blue-600 text-white p-4 fixed top-0 left-0 w-full z-50 shadow-lg">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-3xl font-bold text-white">Manajemen Kost</h1>
      <ul class="flex space-x-8">
        <li>
          <router-link to="/rules" class="text-white hover:text-blue-200 transition duration-300">Peraturan</router-link>
        </li>
        <li>
          <router-link to="/facility" class="text-white hover:text-blue-200 transition duration-300">Facility</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/login" class="text-white hover:text-blue-200 transition duration-300">Login</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/register" class="text-white hover:text-blue-200 transition duration-300">Register</router-link>
        </li>
        <li v-if="isLoggedIn" class="flex items-center space-x-4">
          <span class="text-white">Logged in as: <strong>{{ user.username }}</strong></span>
          <button @click="logout" class="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-300">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {}, 
      isLoggedIn: !!localStorage.getItem('token'), 
    };
  },
  methods: {
    async fetchUserSession() {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const response = await axios.get('http://localhost:5000/api/session', {
            headers: { token },
          });
          this.user = { username: response.data.username };
          this.isLoggedIn = true;
          localStorage.setItem('user', JSON.stringify(this.user)); // Save to localStorage
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        this.isLoggedIn = false;
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; Max-Age=0';
      document.cookie = 'unique_id=; Max-Age=0';
      this.user = {};
      this.isLoggedIn = false;
      this.$router.push('/');
    },
  },
  mounted() {
    this.fetchUserSession();
  },
};
</script>

<style scoped>
/* Prevent body content overlap with fixed navbar */
body {
  margin-top: 80px; /* Adjust if needed for the height of the navbar */
}
</style>
