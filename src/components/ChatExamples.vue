<template>
    <div class="flex justify-between flex-col md:flex-row">
        <div class="flex flex-col m-1" v-for="question in questions" :key="question.id">
            <div class="p-5 bg-primary text-text2 cursor-pointer" @click="handleQuestion(question.id)">
                <h3 class="mt-0">{{ question.title }}</h3>
                <p class="mb-0">{{ question.description }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            questions: [
                {
                    id: 1,
                    title: "Question 1",
                    description: "Ask a question about software development.",
                },
                {
                    id: 2,
                    title: "Question 2",
                    description: "Ask a question about programming languages.",
                },
                {
                    id: 3,
                    title: "Question 3",
                    description: "Ask a question about web development.",
                },
                {
                    id: 4,
                    title: "Question 4",
                    description: "Ask a question about artificial intelligence.",
                },
            ],
        };
    },
    methods: {
        handleQuestion(questionId: number) {
            this.$emit('questionClicked', this.questions.find(q => q.id === questionId)?.description);
        },
    },
});
</script>