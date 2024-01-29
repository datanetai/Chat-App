<template>
    <div class="app-container">
        <div class="login-container">
            <img src="../assets/logo.png" alt="Chat App Logo" class="logo">
            <h1 class="text-center text-2xl font-bold">Register</h1>
            <form @submit.prevent="register">
                <div class="form-group">
                    <label class="form-label" for="username">Username</label>
                    <input type="text" id="username" v-model="username" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="email">Email</label>
                    <input type="text" id="email" v-model="email" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" v-model="confirmPassword" required>
                </div>
                <button type="submit">Register</button>
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>
            <div class="text-center p-1">
                <p>Already have an account? <br> <router-link to="/login">Login</router-link></p>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: ''
        };
    },
    methods: {
        async register() {
            try {
                if (this.password !== this.confirmPassword) {
                    this.errorMessage = 'Passwords do not match';
                    return;
                }

                const response = await axios.post(process.env.VUE_APP_SERVER_IP + '/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 201) {

                    this.$router.push('/login');
                } else {
                    this.errorMessage = response.data.message;
                }
            } catch (error) {
                console.error(error);
                this.errorMessage = 'An error occurred during registration.';
            }
        }
    }
});
</script>

<style scoped>
.app-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-container {
    width: 400px;
    padding: 20px;
    border: 1px solid var(--secondary);
    border-radius: 4px;
    box-shadow: 0 2px 5px var(--secondary);
    background-color: var(--secondary);
}

.logo {
    display: block;
    width: 100px;
    margin: 0 auto 20px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: bold;
    color: var(--text);
}

input[type="text"],
input[type="password"],
button {
    width: 100%;
    padding: 7px;
    border: 1px solid var(--secondary);
    border-radius: 4px;
    color: var(--text);
    background-color: var(--background);
    box-sizing: border-box;
}

button {
    background-color: var(--primary) !important;
    color: var(--text2) !important;
    padding: 5px !important;
    border-radius: 10px !important;
    cursor: pointer;
}

.error-message {
    padding: 5px;
    color: red;
}

.register-link {
    margin-top: 10px;
}
</style>