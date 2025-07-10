import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { ref, set } from "firebase/database";

// REGISTRO DE USUARIO + guardar en base de datos
export const registerUser = async ({ name, email, password, role }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await set(ref(db, "users/" + uid), {
    name,
    email,
    role,
    uid
  });

  return uid;
};

// LOGIN
export const loginUser = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
