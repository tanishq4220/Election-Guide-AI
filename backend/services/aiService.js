/**
 * Google Gemini AI service for generating election-related responses.
 * Integrates with Firebase Admin for chat history persistence
 * and Gemini for natural language understanding.
 * @module services/aiService
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require('firebase-admin');
const logger = require('./logger');
const { MAX_OUTPUT_TOKENS } = require('../constants');

// Initialize Firebase Admin (assuming service account is set in env)
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
    if (Object.keys(serviceAccount).length > 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (error) {
    logger.error("Firebase Admin initialization failed", error);
  }
}

/** @type {import('firebase-admin').firestore.Firestore|null} */
const db = admin.apps.length ? admin.firestore() : null;

/** Gemini AI client instance. */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates an AI response for an election-related prompt using Google Gemini.
 * Stores chat interactions in Firestore when a user is authenticated.
 *
 * @param {string} prompt - The user's sanitized election query.
 * @param {Array<{ role: string, text: string }>} [history=[]] - Previous chat context.
 * @param {string|null} [userId=null] - The authenticated user's ID for persistence.
 * @param {string} [mode="detailed"] - Response mode: 'simple' for concise, 'detailed' for comprehensive.
 * @returns {Promise<string>} The AI-generated response text.
 * @throws {Error} If Gemini API call fails.
 */
const getElectionResponse = async (prompt, history = [], userId = null, mode = "detailed") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemInstruction = `
      You are "Election Guide AI".
      Explain in simple, step-by-step format.
      Support English and Hindi.
      Current Mode: ${mode}.
      If mode is "simple", explain like I am 5 using easy analogies.
      If mode is "detailed", provide comprehensive steps, timelines, and legal contexts.
      Use bullet points for lists. Always be encouraging and non-partisan.
    `;

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    });

    const result = await chat.sendMessage([systemInstruction, prompt]);
    const response = await result.response;
    const text = response.text();

    // Store in Firestore if user is authenticated
    if (db && userId) {
      await db.collection('users').doc(userId).collection('chats').add({
        prompt,
        response: text,
        mode,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return text;
  } catch (error) {
    logger.error("Gemini API error", error);
    throw error;
  }
};

module.exports = { getElectionResponse };
