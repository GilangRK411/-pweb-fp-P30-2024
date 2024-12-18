<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
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
      <button type="submit" :disabled="isLoading" class="submit-btn">
        <span v-if="isLoading">Loading...</span>
        <span v-else>Login</span>
      </button>
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
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        this.$router.push('/admin/dashboard');
      } else {
        this.$router.push('/user');
      }
    }
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

        if (response.data && response.data.token) {
          const { token, role } = response.data;

          localStorage.setItem('token', token);
          localStorage.setItem('role', role); 

          if (role === 'admin') {
            this.$router.push('/admin/dashboard');
          } else {
            this.$router.push('/user');
          }

          setTimeout(() => {
            window.location.reload();
          }, 400);

        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
        console.error(error); 
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Login container setup */
.login-container {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
}

.login-form:hover {
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
}

/* Form group styling */
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #2575fc;
}

/* Submit button styling */
.submit-btn {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  color: white;
  background-color: #2575fc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #6a11cb;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Error message styling */
.error-message {
  color: red;
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .login-form {
    padding: 20px;
  }
  .submit-btn {
    padding: 12px;
  }
}
</style>
