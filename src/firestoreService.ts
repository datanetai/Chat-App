// firestoreService.ts
import { db } from "./firebase"; // Import the Firestore instance
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const messagesCollection = collection(db, "messages");

// Function to add a message
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

// Function to retrieve messages for a session
async function getMessagesBySessionId(sessionId: string) {
    const q = query(messagesCollection, where("sessionId", "==", sessionId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
}

export { addMessage, getMessagesBySessionId };
