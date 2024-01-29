// src/types.ts
export interface ChatMessage {
    id: number;
    text: string;
    type: 'sent' | 'received';
}