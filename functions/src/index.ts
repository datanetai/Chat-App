import * as functions from 'firebase-functions';
import axios from 'axios';


// functions/index.js
if (functions.config().mixtral === undefined) {
    const runtimeConfig = require('./.runtimeconfig.json');
    functions.config().mixtral = runtimeConfig.mixtral;
}
exports.generateReply = functions.https.onCall(async (data, context) => {
    return new Promise(async (resolve, reject) => {
        if (!context.auth) {
            reject(new functions.https.HttpsError('unauthenticated', 'You must be authenticated to use this endpoint'));
        }
        const messageHistory = data.messageHistory;

        try {
            const response = await axios.post('https://api.fireworks.ai/inference/v1/chat/completions', {
                model: "accounts/fireworks/models/mixtral-8x7b-instruct",
                stream: false,
                n: 1,
                messages: messageHistory,
                top_p: 1,
                top_k: 40,
                presence_penalty: 0,
                frequency_penalty: 0,
                context_length_exceeded_behavior: "truncate",
                temperature: 0.9,
                max_tokens: 32768
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Authorization': functions.config().mixtral.key
                }
            });

            const replyText = response.data.choices[0].message.content;
            resolve({ reply: replyText });
        } catch (error) {
            reject(error);
        }
    });
});