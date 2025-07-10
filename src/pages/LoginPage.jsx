import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { loginUser } from "../services/authService";
import { ref, get } from "firebase/database";
import { db } from "../firebaseConfig";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (form) => {
    try {
      const user = await loginUser(form);
      const uid = user.uid;

      const snapshot = await get(ref(db, `users/${uid}`));
      const userData = snapshot.val();

      if (userData?.role === "Administrador") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return <AuthForm title="Login" onSubmit={handleLogin} showRole={false} />;
}
