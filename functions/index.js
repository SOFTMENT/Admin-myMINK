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
const functions = require("firebase-functions");
var braintree = require("braintree");
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, // or braintree.Environment.Production
  merchantId: "7pybpymmq68k6hwq",
  publicKey: "x8qj5gjqvsxb2r52",
  privateKey: "5b7eadea216f99dd50bfe5c6a231c31b",
});
exports.getAllSubscriptionPlans = functions.https.onCall(
  async (data, context) => {
    try {
      const result = await gateway.plan.all();
      return { plans: result };
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw new functions.https.HttpsError("internal", "Error fetching plans");
    }
  }
);
exports.updateSubscriptionPlan = functions.https.onCall(
  async (data, context) => {
    try {
      const { price, id } = data;
      await gateway.plan.update(id, {
        price: price,
      });
      return { success: true };
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw new functions.https.HttpsError("internal", "Error fetching plans");
    }
  }
);
