<template>
  <div class="app-container">
    <ChatHistory v-if="showChatHistory" class="chat-history" />
    <div class="main-content">
      <NavBar @toggleChatHistory="toggleChatHistory" />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { useThemeStore } from '@/store/themeStore';
import NavBar from '@/components/NavBar.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import { onMounted, watch, computed, ref } from 'vue';

export default {
  name: 'App',
  components: {
    NavBar,
    ChatHistory,
  },
  setup() {
    const themeStore = useThemeStore();
    const currentTheme = computed(() => themeStore.getTheme);
    const showChatHistory = ref(false);

    onMounted(() => {
      // select html element
      document.documentElement.dataset.theme = currentTheme.value;
    });

    // Watch the currentTheme and update the data-theme attribute on the html element when it changes
    watch(currentTheme, (newTheme) => {
      document.documentElement.dataset.theme = newTheme;
    });

    const toggleChatHistory = () => {
      showChatHistory.value = !showChatHistory.value;
    };

    return {
      currentTheme,
      showChatHistory,
      toggleChatHistory,
    };
  },
};
</script>

<style>
.app-container {
  display: flex;
}

.chat-history {
  flex: 1;
}

.main-content {
  flex: 3;
}
</style>
