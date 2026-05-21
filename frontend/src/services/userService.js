import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Registers a new user contract/record in the Firestore 'users' collection.
 * @param {Object} userData - The user registration data
 * @returns {Promise<Object>} Object containing success status and created document ID
 */
export const registerUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving user to Firebase:", error);
    throw error;
  }
};
