// themeStore.ts
import { defineStore } from 'pinia';
export const useThemeStore = defineStore({
    id: 'theme',
    state: () => ({
        theme: 'dark',
    }),
    getters: {
        isDarkTheme() {
            return this.theme === 'dark';
        },
        getTheme() {
            return this.theme;
        }
    },
    actions: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
        },
    },
});
//# sourceMappingURL=themeStore.js.map