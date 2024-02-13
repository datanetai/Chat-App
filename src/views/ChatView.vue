`<template>
    <div class="home">
        <ChatExamples class="examples" v-if="messages.length === 0 && !isloading"
            @questionClicked="exampleClickedHandler" />
        <div class="message-container" ref="messagesContainer" :style="{ height: messageContainerHeight() }">
            <div class="messages">
                <ChatMessageComponent v-for="message in messages" :key="message.id" :message="message"
                    @update-message="editMessage" />
            </div>
        </div>
        <div class="input_box fixed bottom-0 left-0 right-0 flex items-center">
            <button class="clear-button" @click="clearMessages">
                <img class="icon_clear" :style="{ filter: svgFilter }" width="20" src="@/assets/clear.svg"
                    alt="Clear messages" />
            </button>
            <textarea placeholder="Type your message here..." class="input flex-grow p-2 border rounded"
                :style="{ backgroundColor: inputbackgroundColor, color: inputTextColor }" v-model="newMessage"
                @keyup.enter="onSendMessage($event)" v-auto-height />
            <button class="send-button ml-1" @click="onSendMessage()" v-bind:disabled="isGeneratingReply">
            </button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, inject } from 'vue';
import ChatExamples from '@/components/ChatExamples.vue';
import ChatMessageComponent from '@/components/ChatMessageComponent.vue';
import { useTheme } from '@/composables/useTheme';
import { useChatMessages } from '@/composables/useChatMessages';


export default defineComponent({
    name: 'ChatView',
    components: {
        ChatExamples,
        ChatMessageComponent,
    },
    setup() {
        const { currentTheme, svgFilter } = useTheme();
        const { messages, sessionId, loadMessages, clearMessages, editMessage, sendMessage } = useChatMessages();
        const newMessage = ref(''); // New message input
        const isGeneratingReply = ref(false); // Whether a reply is being generated
        const isloading = ref(false);
        const state = inject('state');

        watch(
            () => (state as any).sessionId,
            async (newSessionId, oldSessionId) => {
                if (newSessionId !== oldSessionId && newSessionId) {
                    console.log('Session ID changed:', newSessionId);
                    messages.value.length = 0;
                    isloading.value = true;
                    sessionId.value = newSessionId;
                    await loadMessages();
                    isloading.value = false;
                }
            },
            { immediate: true }
        );

        const exampleClickedHandler = (title: string) => {
            console.log('Example clicked:', title);
            sendMessage(title);
        };

        const messageContainerHeight = () => {
            return messages.value.length > 0 ? '80vh' : '10vh';
        }

        return {
            currentTheme,
            svgFilter,
            messages,
            clearMessages,
            editMessage,
            exampleClickedHandler,
            sendMessage,
            newMessage, // Add newMessage to the returned object
            isGeneratingReply, // Add isGeneratingReply to the returned object
            messageContainerHeight,
            isloading
        };
    },
    computed: {
        inputbackgroundColor(): string {
            return this.currentTheme === 'dark' ? '#1f1f1f' : '#f5f5f5';
        },
        inputTextColor(): string {
            return this.currentTheme === 'dark' ? '#f5f5f5' : '#1f1f1f';
        },
    },
    methods: {
        async onSendMessage(event: KeyboardEvent) {
            if (event.shiftKey) {
                this.newMessage += '\n';
            } else {
                const message = this.newMessage;
                this.newMessage = '';
                await this.sendMessage(message);
            }
        }
    }
});

</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    justify-content: space-between;
    height: 90%;
    background-color: var(--background-color);
}


.send-button {
    width: 4.0rem;
    margin-right: 10px;
    cursor: pointer;
}

.send-button::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 18px solid var(--accent);
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    display: inline-block;
}

.message-container {
    overflow-y: scroll;
    padding: 4px;
}

.message-container::-webkit-scrollbar {
    width: 5px;
}

.message-container::-webkit-scrollbar-thumb {
    background: #888;
}

.message-container::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.input_box {
    height: 10%;
    position: fixed;
    bottom: 10px;
    z-index: 1000;
    display: flex;
    align-items: center;
    border-radius: 20px;
    margin-top: auto;
}


.input {
    border: 1px solid var(--primary);
    outline: none;
    font-size: 1rem;
    font-weight: bold;
    color: var(--text);
    padding: 10px;
    border-radius: 20px;
    width: 70%;
    background-color: var(--background-color);
}

.examples {
    margin: 30px;
    height: 30vh;
}

@media screen and (max-width: 990px) {
    .examples {
        height: 50vh;
    }
}



.clear-button {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    /* Prevent the button from growing */
    width: 40px;
    height: 40px;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: 1rem;
    /* equivalent to 16px */
    font-weight: bold;
    margin-right: 10px;
}


.messages {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
</style>`