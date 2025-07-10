import React from "react";
import AuthForm from "../components/AuthForm";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (form) => {
    try {
      await registerUser(form);

      if (form.role === "Administrador") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return <AuthForm title="Register" onSubmit={handleRegister} showRole={true} />;
}
