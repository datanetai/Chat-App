
<template>
    <div>
        <h2 class="text-2xl font-bold m-4 line-below">Chat History</h2>
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
<style scoped>
.line-below {
    border-bottom: 1px solid black;
    padding-bottom: 10px;
    /* Adjust this value to move the line further below */
}
</style>
