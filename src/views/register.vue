<template>
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" placeholder="Enter username" required />
        </div>
  
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" placeholder="Enter email" required />
        </div>
  
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" placeholder="Enter password" required />
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
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  h2 {
    text-align: center;
  }
  
  form div {
    margin-bottom: 15px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  
  .error {
    color: red;
    text-align: center;
  }
  
  .success {
    color: green;
    text-align: center;
  }
  </style>
  