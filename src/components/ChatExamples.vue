<template>
    <div class="flex justify-between flex-col md:flex-row">
        <div class="flex flex-col m-1 box-container" v-for="question in questions" :key="question.id">
            <div class="p-5 bg-primary text-text2 cursor-pointer box" @click="handleQuestion(question.id)">
                <h3 class="mt-0">{{ question.title }}</h3>
                <p class="mb-0">{{ question.description }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { useHistoryStore } from '@/store/historyVisibility';

export default defineComponent({
    data() {
        return {
            questions: [
                {
                    id: 1,
                    title: "Software Development",
                    description: "What is Agile development?",
                },
                {
                    id: 2,
                    title: "Programming Languages",
                    description: "What is the difference between a statically typed language and a dynamically typed language?",
                },
                {
                    id: 3,
                    title: "Web Development",
                    description: "How do you improve a website's load time?",
                },
                {
                    id: 4,
                    title: "Artificial Intelligence",
                    description: "What is deep learning?",
                },
            ],
        };
    },
    methods: {
        handleQuestion(questionId: number) {
            this.$emit('questionClicked', this.questions.find(q => q.id === questionId)?.description);
        },
    },
    setup() {
        const historyStore = useHistoryStore();
        onMounted(() => {
            watch(() => historyStore.getShowChatHistory, (newHistory) => {
                // decrease text size if chat history is visible
                if (newHistory) {
                    document.querySelectorAll('.box').forEach((el) => {
                        el.classList.add('text-sm');
                    });
                } else {
                    document.querySelectorAll('.box').forEach((el) => {
                        el.classList.remove('text-sm');
                    });
                }

            });
        });
    },
});
</script>

<style scoped>
.box-container {
    display: flex;
    flex-direction: column;
}

.box {
    height: 100%;
    background-color: var(--secondary);
    color: var(--text);
}

.box:hover {
    background-color: var(--ascent);
}
</style>