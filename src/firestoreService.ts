// firestoreService.ts
import { db } from "./firebase"; 
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const messagesCollection = collection(db, "messages");

/**
 * Function to add a message
 * @param sessionId - The session ID
 * @param message - The message content
 * @param type - The type of message
 */
async function addMessage(sessionId: string, message: string, type: string) {
    try {
        await addDoc(messagesCollection, {
            sessionId,
            message,
            type,
            timestamp: new Date() // Add a timestamp for ordering
        });
    } catch (error) {
        console.error("Error adding message: ", error);
    }
}

/**
 * Function to retrieve messages for a session
 * @param sessionId - The session ID
 * @returns An array of messages
 */
async function getMessagesBySessionId(sessionId: string) {
    const q = query(messagesCollection, where("sessionId", "==", sessionId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
}

/**
 * Function to load all messages
 * @returns An array of all messages
 */
async function getAllMessages() {
    const q = query(messagesCollection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
}

/**
 * Function to get the first message for each session
 * @returns An array of the first messages for each session
 */
async function getFirstMessageForEachSession() {
    const q = query(messagesCollection);
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => doc.data());

    const uniqueSessionIds = Array.from(new Set(messages.map(message => message.sessionId)));

    const firstMessages = uniqueSessionIds.map(sessionId => {
        const sessionMessages = messages.filter(message => message.sessionId === sessionId);
        const sortedMessages = sessionMessages.sort((a, b) => a.timestamp - b.timestamp);
        return sortedMessages[0];
    });

    return firstMessages;
}

export { addMessage, getMessagesBySessionId, getAllMessages, getFirstMessageForEachSession };
