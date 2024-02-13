<template>
    <nav>
        <div class="logo_div">
            <img src="../assets/logo.png" alt="Chat App Logo" class="logo">
            <p>Chat App</p>
        </div>
        <div class="theme-toggle">
            <button @click="toggleTheme">
                <i :class="theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'"></i> </button>
            <button v-if="$route.name === 'home'" @click="$emit('toggleChatHistory')">
                <i class="fas fa-history"></i>
            </button>
            <button @click="logout">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    </nav>
</template>

<script lang="ts">
import { useThemeStore } from '@/store/themeStore';
import firebase from '@/firebase';
import router from '../router';

export default {
    computed: {
        theme() {
            const themeStore = useThemeStore();
            return themeStore.theme;
        },
    },
    methods: {
        toggleTheme() {
            const themeStore = useThemeStore();
            themeStore.toggleTheme();
        },
        async logout() {
            try {
                await firebase.auth.signOut();
                router.push('/login');
            } catch (error) {
                console.error('Error signing out: ', error);
            }
        },
    },
};
</script>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem;
    flex-direction: row;
    box-shadow: 0 1px 2px var(--text);
    height: 10%;
    z-index: 10000;
}

.logo_div {
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
}

.theme-toggle {
    display: flex;
    align-items: center;
}

button {
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
}

.logo {
    display: block;
    width: 50px;
    margin-right: 0.4rem;
}

.fa-sun:before {
    content: "\f185";
}

.fa-moon:before {
    content: "\f186";
}

.fa-history:before {
    content: "\f1da";
}
</style>