<template>
    <nav>
        <div class="logo_div">
            <img src="../assets/logo.png" alt="Chat App Logo" class="logo">
            <p>Chat App</p>
        </div>
        <div class="theme-toggle">
            <button @click="toggleTheme">Toggle Theme</button>
            <button v-if="$route.name === 'home'" @click="$emit('toggleChatHistory')">Toggle Chat History</button>
        </div>
    </nav>
</template>

<script lang="ts">
import { useThemeStore } from '@/store/themeStore';
export default {
    methods: {
        toggleTheme() {
            const themeStore = useThemeStore();
            themeStore.toggleTheme();
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
</style>