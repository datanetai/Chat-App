// themeStore.ts
import { defineStore } from 'pinia';

export const useThemeStore = defineStore({
    id: 'theme',
    state: () => ({
        theme: localStorage.getItem('theme') || 'dark',
    }),
    getters: {
        isDarkTheme(): boolean {
            return this.theme === 'dark';
        },
        getTheme(): string {
            return this.theme;
        }
    },
    actions: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', this.theme);

        },
    },
});