/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const functions = require('firebase-functions');
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
exports.sendNotificationToTopic = functions.https.onRequest((req, res) => {
    // Extract topic title and message from the request body
    const { title, message, topic } = req.body;
  
    // Check if topic title, message, and topic are provided
    if (!title || !message || !topic) {
      return res.status(400).send('Invalid request: title, message, and topic are required');
    }
  
    // Message payload
    const payload = {
      notification: {
        title: title,
        body: message,
      },
    };
  
    // Send notification to the specified topic
    admin.messaging().sendToTopic(topic, payload)
      .then((response) => {
        console.log('Successfully sent message:', response);
        res.status(200).send('Notification sent successfully');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending notification');
      });
  });
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
