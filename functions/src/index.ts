import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// import * as userFunctions from './user/user.functions';

// export const onUserCreated = userFunctions.onUserCreated;

exports.onUserCreated = functions.auth.user().onCreate((user) => {
    // You can perform actions upon user registration here
    console.log('A new user has been created:', user.email);
});

// listen to firestore/users/{userId} document changes
exports.onUserDocumentChange = functions.firestore.document('users/{userId}').onWrite((change, context) => {
    // You can perform actions upon user document changes here
    console.log('A user document has been changed:', context.params.userId);
}
);  