// useTheme.ts
import { computed } from 'vue';
import { useThemeStore } from '@/store/themeStore';

export function useTheme() {
    const themeStore = useThemeStore();
    const currentTheme = computed(() => themeStore.getTheme);
    const svgFilter = computed(() => {
        return currentTheme.value === 'dark' ? 'invert(100%)' : 'none';
    });

    return {
        currentTheme,
        svgFilter,
    };
}