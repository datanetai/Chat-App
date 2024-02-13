<template>
    <div class="app-container">
        <div class="login-container">
            <img src="../assets/logo.png" alt="Chat App Logo" class="logo">
            <h1 class="text-center text-2xl font-bold">Login</h1>
            <form @submit.prevent="login">
                <div class="form-group">
                    <label class="form-label" for="email">Email</label>
                    <input type="email" id="email" v-model="email" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <p v-if="errorMessage" class="error-message"><i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}
                </p>
            </form>
            <div class="text-center p-1">
                <p class="register-link">Don't have an account? <br> <router-link to="/register">Register</router-link></p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '../router';
import firebase from '@/firebase';

export default defineComponent({
    data() {
        return {
            email: '',
            password: '',
            errorMessage: ''
        };
    },
    methods: {
        async login() {
            try {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(this.email)) {
                    this.errorMessage = 'Invalid email address';
                    return;
                }
                const userCredential = await firebase.signInWithEmailAndPassword(firebase.auth, this.email, this.password);
                const user = userCredential.user;
                console.log("user", user)
                if (user) {
                    router.push('/');
                }
            } catch (error) {
                this.errorMessage = (error as Error).message;
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
    height: 90vh;
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

input[type="email"],
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
    color: var(--accent);
}

.register-link {
    margin-top: 10px;
}
</style>