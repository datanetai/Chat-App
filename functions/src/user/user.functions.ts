import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onUserCreated = functions.auth.user().onCreate((user) => {
    // You can perform actions upon user registration here
    console.log('A new user has been created:', user.email);
});