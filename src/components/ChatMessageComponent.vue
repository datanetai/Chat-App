<template>
    <div :class="messageClass">
        <p>{{ message.text }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChatMessage } from '@/types';


export default defineComponent({
    props: {
        message: {
            type: Object as () => ChatMessage,
            required: true,
        },
    },
    computed: {
        messageClass(): string {
            return this.message.type === 'sent' ? 'sent-message' : 'received-message';
        },
    },
});
</script>

<style scoped>
.sent-message,
.received-message {
    border-radius: 18px;
    padding: 10px 20px;
    margin: 10px 0;
    position: relative;
    max-width: 60%;
}

.sent-message {
    background-color: var(--primary);
    color: var(--text2);
    align-self: flex-end;
}

.received-message {
    background-color: var(--secondary);
    color: var(--text);
    align-self: flex-start;
    /* Changed from flex-start */
}

/* .sent-message::after {
    content: "";
    position: absolute;
    right: -10px;
    top: 50%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-left-color: #0b93f6;
    border-right: 0;
    border-bottom: 0;
    margin-top: -5px;
    margin-right: -10px;
}



.received-message::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 50%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: #e5e5ea;
    border-left: 0;
    border-bottom: 0;
    margin-top: -5px;
    margin-left: -10px;
} */
</style>
