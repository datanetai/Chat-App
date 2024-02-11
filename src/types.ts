// src/types.ts
export interface ChatMessage {
    id: number;
    text: string;
    type: 'sent' | 'received';
}

export interface MessagesHistory {
    role: 'system' | 'user' | 'assistant';
    content: string;
}