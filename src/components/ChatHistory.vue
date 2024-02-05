
<template>
    <div>
        <h2 class="text-2xl font-bold mb-4">Chat History</h2>
        <ul>
            <li v-for="message in messages" :key="message.id" class="mb-4">
                <h3 class="text-lg font-semibold">{{ message.title }}</h3>
                <p class="text-gray-500">{{ message.timestamp }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import { getFirstMessageForEachSession } from '@/firestoreService';
export default {
    data() {
        return {
            messages: [],
        };
    },
    mounted() {
        this.fetchMessages();
    },
    methods: {
        async fetchMessages() {
            let messages = await getFirstMessageForEachSession();
            this.messages = messages;
        },
    },
};
</script>

<style>
/* Add your custom styles here */
</style>
