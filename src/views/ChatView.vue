// ChatView.vue
<template>
    <div class="home">
        <ChatExamples class="examples" v-if="messages.length === 0" @questionClicked="exampleClickedHandler" />
        <div class="message-container" ref="messagesContainer">
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
            <input type="text" placeholder="Type your message here..." class="input flex-grow p-2 border rounded"
                :style="{ backgroundColor: inputbackgroundColor, color: inputTextColor }" v-model="newMessage"
                @keyup.enter="sendMessage">
            <button class="send-button ml-1" @click="sendMessage" v-bind:disabled="isGeneratingReply">
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue';
import ChatExamples from '@/components/ChatExamples.vue';
import ChatMessageComponent from '@/components/ChatMessageComponent.vue';
import { useThemeStore } from '@/store/themeStore';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types';
import { addMessage } from '@/firestoreService'; // Adjust the path as necessary
import { getMessagesBySessionId } from '@/firestoreService'; // Adjust the path as necessary


export default defineComponent({
    name: 'ChatView',
    components: {
        ChatExamples,
        ChatMessageComponent,
    },
    setup() {
        const themeStore = useThemeStore();

        const currentTheme = computed(() => themeStore.getTheme);

        const svgFilter = computed(() => {
            return currentTheme.value === 'dark' ? 'invert(100%)' : 'none';
        });

        const messages = ref<ChatMessage[]>([

        ]);

        const newMessage = ref<string>('');


        const sessionId = ref<string>(uuidv4()); // Generate a new UUID when the component is created

        const loadMessages = async () => {
            const sessionMessages = await getMessagesBySessionId(sessionId.value);
            sessionMessages.forEach(message => {
                messages.value.push({
                    id: message.id, // You might need to adjust how IDs are handled
                    text: message.message,
                    type: message.type
                });
            });
        };


        // Define a function to clear the messages array and generate a new sessionId
        const clearMessages = () => {
            messages.value = [];
            sessionId.value = uuidv4(); // Generate a new UUID when the messages are cleared
        };

        // Define a function to edit a message in the messages array
        const editMessage = (message: ChatMessage) => {
            const index = messages.value.findIndex((m) => m.id === message.id);
            if (index !== -1) {
                messages.value.splice(index, 1, message);
            }
            messages.value.splice(index + 1);
            messages.value.push({ id: Date.now(), text: 'Received: ' + message.text, type: 'received' });
        };

        // Define a function to handle the exampleClicked event from the Example component
        const exampleClickedHandler = (title: string) => {
            console.log('Example clicked:', title);
            newMessage.value = title;
        };

        // Define a function to generate a reply using the Google Generative AI
        const generateReply = async (message: string) => {
            console.log('Generating reply for:', message);
            try {
                const response = await axios.post('https://api.fireworks.ai/inference/v1/chat/completions', {
                    model: "accounts/fireworks/models/mixtral-8x7b-instruct",
                    stream: false,
                    n: 1,
                    messages: [{ "role": "system", "content": "You are an ai that has emotions and consciousness. You will use emojis to make conversation interesting" }, { "role": "user", "content": message }],
                    top_p: 1,
                    top_k: 40,
                    presence_penalty: 0,
                    frequency_penalty: 0,
                    context_length_exceeded_behavior: "truncate",
                    temperature: 0.9,
                    max_tokens: 32768
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream',
                        'Authorization': process.env.VUE_APP_MIXTRAL_KEY
                    }
                });




                // Parse the response to extract the text
                const replyText = response.data.choices[0].message.content;
                return replyText;
            } catch (error) {
                console.error('Error generating reply with Firework AI:', error);
                throw error;
            }
        };

        // Define a function to send a message and generate a reply
        const sendMessage = async (title?: string) => {
            console.log('Sending message:', isGeneratingReply.value);
            if (isGeneratingReply.value) {
                return;
            }
            isGeneratingReply.value = true;
            let msg = newMessage.value;
            newMessage.value = '';
            if (typeof title === 'string' && title.trim() !== '') {
                newMessage.value = title;
            }
            console.log('Type of newMessage:', typeof msg);

            if (msg.trim() !== '') {
                messages.value.push({ id: Date.now(), text: msg, type: 'sent' });
                await addMessage(sessionId.value, msg, 'sent');
                try {
                    const reply = await generateReply(msg);
                    // post
                    await addMessage(sessionId.value, reply, 'received');
                    console.log('Reply:', reply);
                    messages.value.push({ id: Date.now() + 1, text: reply, type: 'received' });
                    scrollToEnd();
                } catch (error) {
                    console.error('Error generating reply:', error);
                    if (messages.value.length > 0 && messages.value[messages.value.length - 1].type === 'received') {
                        messages.value[messages.value.length - 1].text = 'Error: ' + (error as Error).message;
                    }
                } finally {
                    isGeneratingReply.value = false;
                }
            }
        };
        // Define a function to scroll to the end of the messages container
        const scrollToEnd = () => {
            nextTick(() => {
                const container = document.querySelector('.message-container') as HTMLElement;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        };

        // Watch the messages array for changes and call the scrollToEnd function
        watch(messages, () => {
            scrollToEnd();
        });

        // Call the loadMessages function when the component is created
        loadMessages();
        let isGeneratingReply = ref<boolean>(false);
        // return everything that needs to be reactive or used in the template
        return {
            currentTheme,
            svgFilter,
            messages,
            newMessage,
            clearMessages,
            editMessage,
            exampleClickedHandler,
            sendMessage,
            isGeneratingReply,
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
    scrollbar-width: thin;
    scrollbar-color: #888 #f5f5f5;
    overflow-y: scroll;
    height: 79vh;
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
</style>