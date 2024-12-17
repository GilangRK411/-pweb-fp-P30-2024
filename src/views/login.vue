<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="usernameOrEmail">Username or Email:</label>
        <input
          type="text"
          id="usernameOrEmail"
          v-model="usernameOrEmail"
          placeholder="Enter username or email"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter password"
          required
        />
      </div>
      <button type="submit" :disabled="isLoading">Login</button>
    </form>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      isLoading: false,
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          usernameOrEmail: this.usernameOrEmail,
          password: this.password,
        });

        // If login is successful, store the token in localStorage
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);  // Store token in localStorage

          // Redirect to /user route after login
          this.$router.push('/user');
        }
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : 'An error occurred';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add your CSS styling here */
.login-container {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
