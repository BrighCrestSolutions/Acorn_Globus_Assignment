// Firebase token verification using REST API (no Admin SDK needed)
const axios = require('axios');

/**
 * Verify Firebase ID token using Firebase REST API
 * No Admin SDK credentials required - only needs API key
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<Object>} Decoded token with user info
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    // Use Firebase Auth REST API to verify token
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
      { idToken }
    );

    if (!response.data.users || response.data.users.length === 0) {
      throw new Error('Invalid token');
    }

    const user = response.data.users[0];
    
    return {
      uid: user.localId,
      email: user.email,
      email_verified: user.emailVerified || false,
      name: user.displayName || user.email.split('@')[0],
      photoURL: user.photoUrl || null
    };
  } catch (error) {
    console.error('Firebase token verification error:', error.response?.data || error.message);
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  verifyFirebaseToken
};
