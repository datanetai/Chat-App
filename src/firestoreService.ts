// firestoreService.ts
import firebase from "./firebase";
import { increment, serverTimestamp, doc, setDoc, collection, addDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const messagesCollection = collection(firebase.db, "messages");

/**
 * Function to add a message
 * @param sessionId - The session ID
 * @param message - The message content
 * @param type - The type of message
 */
async function addMessage(sessionId: string, message: string, type: string) {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const counterRef = doc(firebase.db, 'counters', 'messages');

    try {
        // Get the current count
        const counterSnap = await getDoc(counterRef);
        const count = counterSnap.exists() ? counterSnap.data().count : 0;

        // Increment the counter
        await setDoc(counterRef, { count: increment(1) }, { merge: true });

        // Use the count as the primary key
        await addDoc(messagesCollection, {
            id: count,
            sessionId,
            message,
            type,
            userId, // Add the user ID to the document
            timestamp: serverTimestamp() // Add a timestamp for ordering
        });
    } catch (error) {
        console.error("Error adding message: ", error);
    }
}

/**
 * Function to retrieve messages for a session and specific user
 * @param sessionId - The session ID
 * @returns An array of messages
 */
async function getMessagesBySessionId(sessionId: string) {
    const auth = getAuth();
    const userId = auth.currentUser?.uid; // Get the user ID from the auth context

    const q = query(messagesCollection, where("sessionId", "==", sessionId), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => doc.data());

    // Sort the messages array based on the timestamp
    const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

    return sortedMessages;
}

/**
 * Function to get the first message for each session for the current user
 * @returns An array of the first messages for each session
 */
async function getFirstMessageForEachSession() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid; // Get the user ID from the auth context

    const q = query(messagesCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => doc.data());

    const uniqueSessionIds = Array.from(new Set(messages.map(message => message.sessionId)));

    let firstMessages = uniqueSessionIds.map(sessionId => {
        const sessionMessages = messages.filter(message => message.sessionId === sessionId);
        const sortedMessages = sessionMessages.sort((a, b) => a.timestamp - b.timestamp);
        return sortedMessages[0];
    });

    // Sort the firstMessages array based on the id
    firstMessages = firstMessages.sort((a, b) => a.id - b.id);

    console.log("firstMessages", firstMessages);
    return firstMessages;
}

export { addMessage, getMessagesBySessionId, getFirstMessageForEachSession };
