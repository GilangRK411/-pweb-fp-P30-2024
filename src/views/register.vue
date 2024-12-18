<template>
  <div class="register-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-field">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" placeholder="Enter your username" required />
      </div>

      <div class="form-field">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
      </div>

      <div class="form-field">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
      </div>

      <button type="submit" :disabled="isSubmitting">Register</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: '',
      successMessage: '',
      isSubmitting: false
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = '';
      this.successMessage = '';
      this.isSubmitting = true;

      try {
        const response = await axios.post('http://localhost:5000/api/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });

        this.successMessage = response.data.message;
        this.username = '';
        this.email = '';
        this.password = '';
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-field {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  background-color: #fff;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #4CAF50;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: red;
  text-align: center;
  font-size: 14px;
}

.success {
  color: green;
  text-align: center;
  font-size: 14px;
}
</style>
