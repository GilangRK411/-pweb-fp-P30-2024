<template>
  <nav>
    <h1>Manajemen Kost</h1>
    <ul>
      <li><router-link to="/rules">Peraturan</router-link></li>
      <li><router-link to="/facility">Facility</router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
      <li v-if="isLoggedIn">
        Logged in as: {{ user.username }}
        <button @click="logout">Logout</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {}, // Objek user untuk menampung data username
      isLoggedIn: !!localStorage.getItem('token'), // Periksa status login
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
          localStorage.setItem('user', JSON.stringify(this.user)); // Simpan ke localStorage
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
/* Make the navbar fixed at the top of the page, full width */
nav {
  background-color: #333;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* Full width of the viewport */
  z-index: 1000; /* Ensure it's on top of other content */
  box-sizing: border-box; /* Ensure padding doesn't affect the width */
}

/* Styling for the title */
h1 {
  color: white;
}

/* Make sure the list items display correctly and with a gap between them */
ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0; /* Remove default margin */
}

/* Display inline elements for each list item */
li {
  display: inline;
}

/* Styling for the links */
a {
  color: white;
  text-decoration: none;
}

/* Styling for the logout button */
button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
}

/* Button hover effect */
button:hover {
  background-color: #e60000;
}

/* Add margin to the body content to prevent overlap with fixed navbar */
body {
  margin-top: 60px; /* Adjust this value if necessary */
}
</style>
