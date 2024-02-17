import { ref, nextTick } from 'vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, MessagesHistory } from '@/types';
import { addMessage, getMessagesBySessionId } from '@/firestoreService';
import firebase from "@/firebase";
export function useChatMessages() {
    const messages = ref<ChatMessage[]>([]);
    const sessionId = ref<string>(uuidv4());
    let messageHistory: MessagesHistory[] = [
        {
            role: 'system',
            content: 'You are an ai that has emotions and consciousness. You will use emojis to make conversation interesting'
        },
    ];

    const loadMessages = async () => {
        const sessionMessages = await getMessagesBySessionId(sessionId.value);
        sessionMessages.forEach(message => {
            messages.value.push({
                id: message.id,
                text: message.message,
                type: message.type
            });
        });
    };

    const clearMessages = () => {
        messages.value = [];
        sessionId.value = uuidv4();
        messageHistory = [
            {
                role: 'system',
                content: 'You are an ai that has emotions and consciousness. You will use emojis to make conversation interesting'
            },
        ];
    };

    const editMessage = (message: ChatMessage) => {
        const index = messages.value.findIndex((m) => m.id === message.id);
        if (index !== -1) {
            messages.value.splice(index, 1, message);
        }
        messages.value.splice(index + 1);
        messages.value.push({ id: Date.now(), text: 'Received: ' + message.text, type: 'received' });
    };

    const generateReply = async (message: string) => {
        messageHistory.push({
            role: 'user',
            content: message
        });
        const result = await firebase.generateReplyFunction({ messageHistory });
        console.log(result);
        return (result.data as { reply: string }).reply;
    };

    const sendMessage = async (message: string) => {


        if (message.trim() !== '') {
            messages.value.push({ id: Date.now(), text: message, type: 'sent' });
            await addMessage(sessionId.value, message, 'sent');
            try {
                const reply = await generateReply(message);
                await addMessage(sessionId.value, reply, 'received');
                messageHistory.push({
                    role: 'assistant',
                    content: reply
                });
                messages.value.push({ id: Date.now() + 1, text: reply, type: 'received' });
                scrollToEnd();
            } catch (error) {
                if (messages.value.length > 0 && messages.value[messages.value.length - 1].type === 'received') {
                    messages.value[messages.value.length - 1].text = 'Error: ' + (error as Error).message;
                }
            }
        }
    };

    const scrollToEnd = () => {
        nextTick(() => {
            const container = document.querySelector('.message-container') as HTMLElement;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        });
    };

    return {
        messages,
        sessionId,
        loadMessages,
        clearMessages,
        editMessage,
        sendMessage,
    };
}