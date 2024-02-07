import { defineStore } from 'pinia';

export const useHistoryStore = defineStore({
    id: 'history',
    state: () => ({
        showChatHistory: false,
    }),
    getters: {
        getShowChatHistory(): boolean {
            return this.showChatHistory;
        },
    },
    actions: {
        setShowChatHistory(value: boolean) {
            this.showChatHistory = value;
        },
    },
});

