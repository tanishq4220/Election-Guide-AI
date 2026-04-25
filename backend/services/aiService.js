const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require('firebase-admin');

// Initialize Firebase Admin (assuming service account is set in env)
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
    if (Object.keys(serviceAccount).length > 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
  } catch (e) {
    console.error("Firebase Admin initialization failed", e);
  }
}

const db = admin.apps.length ? admin.firestore() : null;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getElectionResponse = async (prompt, history = [], userId = null, mode = "detailed") => {
  try {
    // UPDATED TO GEMINI-FLASH-LATEST (Verified available in this environment)
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
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
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
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return text;
  } catch (error) {
    console.error("FULL GEMINI ERROR:", error.message || error);
    throw error;
  }
};

module.exports = { getElectionResponse };
