import {firebaseApp} from "../../config";
import {getAuth, sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";

const auth = getAuth(firebaseApp);

export const handleResetPassword = async (email) => {
   return await sendPasswordResetEmail(auth, email)
};

export const checkPassword = async (email, password) => {
   return await signInWithEmailAndPassword(auth, email, password)
};