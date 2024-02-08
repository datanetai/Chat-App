<template>
    <div>
        <h2 class="font-bold p-2 line-below" :class="lineBelowClass">Chat History</h2>
        <ul>
            <li v-for="message in messages" :key="message.id" class="p-2 line-below-message" :class="hoverClass"
                @click="onHistoryClick(message.sessionId)">
                <div class="flex justify-between">
                    <h3 class="font-semibold">{{ message.message }}</h3>
                    <p class="text-gray-500">{{ message.timestamp }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { getFirstMessageForEachSession } from '@/firestoreService';
import { useThemeStore } from '@/store/themeStore';
import { inject } from 'vue';

export default {
    data() {
        return {
            messages: [],
            hoverClass: '',
        };
    },
    setup() {
        const state = inject('state');
        const onHistoryClick = (sessionId) => {
            console.log('sessionId', sessionId);
            state.sessionId = sessionId;
        };
        return {
            onHistoryClick,
        };
    },
    computed: {
        lineBelowClass() {
            const themeStore = useThemeStore();
            return themeStore.isDarkTheme ? 'line-below-dark' : 'line-below-light';
        },
    },
    mounted() {
        this.fetchMessages();
    },
    methods: {
        async fetchMessages() {
            let messages = await getFirstMessageForEachSession();
            messages = messages.map(message => {
                const timestamp = new Date(message.timestamp.seconds * 1000 + message.timestamp.nanoseconds / 1000000);
                const formattedTimestamp = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return {
                    ...message,
                    timestamp: formattedTimestamp // Update variable name to formattedTimestamp
                };
            });
            console.log(messages);
            this.messages = messages;
        },
    },
};
</script>

<style scoped>
.line-below-light {
    border-bottom: 1px solid black;
    padding-bottom: 10px;
}

.line-below-dark {
    border-bottom: 1px solid white;
    padding-bottom: 10px;
}

.line-below-message {
    border-bottom: 0.3px solid var(--text);
}

.line-below-message:hover {
    background-color: var(--secondary);
    cursor: pointer;
}
</style>