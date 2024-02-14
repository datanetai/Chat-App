<template>
  <div class="app-container">
    <transition name="fade">
      <ChatHistory v-if="showChatHistory" class="chat-history" />
    </transition>
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
import { onMounted, watch, computed, ref, reactive, provide } from 'vue';

import { useHistoryStore } from '@/store/historyVisibility';
export default {
  name: 'App',
  components: {
    NavBar,
    ChatHistory,
  },
  setup() {
    const themeStore = useThemeStore();
    const historyStore = useHistoryStore();

    const currentTheme = computed(() => themeStore.getTheme);
    const showChatHistory = ref(false);
    const state = reactive({
      sessionId: null
    });
    const historyInfo = reactive({
      sessionId: null
    });
    provide('historyInfo', historyInfo);
    provide('state', state);
    onMounted(() => {
      document.documentElement.dataset.theme = currentTheme.value;
    });

    // Watch the currentTheme and update the data-theme attribute on the html element when it changes
    watch(currentTheme, (newTheme) => {
      document.documentElement.dataset.theme = newTheme;
    });

    const toggleChatHistory = () => {
      showChatHistory.value = !showChatHistory.value;
      historyStore.setShowChatHistory(showChatHistory.value);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
