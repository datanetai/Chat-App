<template>
    <div>
        <h2 class="font-bold p-2 line-below" :class="lineBelowClass">Chat History</h2>
        <ul>
            <li v-for="message in messages" :key="message.id" class="p-2 line-below-message" :class="hoverClass"
                @click="onHistoryClick(message.sessionId)">
                <div class="flex justify-between">
                    <h3 class="font-semibold">{{ message.message }}</h3>
                    <div class="relative">
                        <p class="timestamp text-gray-500">{{ message.timestamp }}</p>
                        <button class="delete-button" @click.stop="deleteMessage(message.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>


            </li>
        </ul>
    </div>
</template>

<script>
import { getFirstMessageForEachSession } from '@/firestoreService';
import { inject } from 'vue';
import Swal from 'sweetalert2'; // Import sweetalert2
import { useTheme } from '@/composables/useTheme';

export default {
    data() {
        return {
            messages: [],
            hoverClass: '',
        };
    },
    setup() {
        const state = inject('state');
        const { currentTheme, svgFilter } = useTheme();

        const onHistoryClick = (sessionId) => {
            console.log('sessionId', sessionId);
            state.sessionId = sessionId;
        };
        return {
            onHistoryClick,
            currentTheme
        };
    },
    computed: {
        lineBelowClass() {

            return this.currentTheme ? 'line-below-dark' : 'line-below-light';
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
                    timestamp: formattedTimestamp
                };
            });
            console.log(messages);
            this.messages = messages;
        },

        async deleteMessage(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',

            })

            if (result.isConfirmed) {
                // Delete logic goes here
                console.log('Deleting message with id:', id);
            }
        }
    }
};
</script>

<style scoped>
.line-below-light {
    border-bottom: 1px solid black;
    padding-bottom: 10px;
}

.line-below-dark {
    border-bottom: 1px solid grey;
    padding-bottom: 10px;
}

.line-below-message {
    border-bottom: 0.3px solid var(--text);
}

.line-below-message:hover {
    background-color: var(--secondary);
    cursor: pointer;
}

.timestamp {
    transition: opacity 0.3s ease;
}

.delete-button {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
}

.line-below-message:hover .delete-button {
    display: block;
}

.line-below-message:hover .timestamp {
    opacity: 0;
}

.delete-button i {
    color: red;
    font-size: 1.2em;
}
</style>`