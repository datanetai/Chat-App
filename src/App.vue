<template>
  <NavBar />
  <router-view />
</template>

<script lang="ts">
import { useThemeStore } from '@/store/themeStore';
import NavBar from '@/components/NavBar.vue';
import { onMounted, watch, computed } from 'vue';

export default {
  name: 'App',
  components: {
    NavBar,
  },
  setup() {
    const themeStore = useThemeStore();
    const currentTheme = computed(() => themeStore.getTheme);

    onMounted(() => {
      // select html element
      document.documentElement.dataset.theme = currentTheme.value;
    });

    // Watch the currentTheme and update the data-theme attribute on the html element when it changes
    watch(currentTheme, (newTheme) => {
      document.documentElement.dataset.theme = newTheme;
    });

    return {
      currentTheme,
    };
  },
};

</script>

<style></style>
