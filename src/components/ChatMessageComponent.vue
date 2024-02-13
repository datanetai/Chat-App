<template>
    <div :class="messageClass">
        <div v-html="markdownMessage"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChatMessage } from '@/types';
import MarkdownIt from 'markdown-it';
import 'highlight.js/styles/default.css'; // or another theme
import hljs from 'highlight.js';

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
        markdownMessage(): string {
            const md = new MarkdownIt({
                highlight: function (str: string, lang: string) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return `<div class="code-block">
                                        <pre><code>${hljs.highlight(str, { language: lang }).value}</code></pre>
                                    </div>`;
                        } catch (error) {
                            console.error('Failed to highlight code block:', error);
                        }
                    }
                    return ''; // use external default escaping
                }
            });
            return md.render(this.message.text);
        },
    },
    methods: {
        copyCode(code: string) {
            navigator.clipboard.writeText(code);
        }
    }
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
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    /* Changed from flex-start */
}

.code-block {
    position: relative;
}

.copy-button {
    position: absolute;
    top: 0;
    right: 0;
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
