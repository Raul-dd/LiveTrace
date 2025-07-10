import React, { useState } from "react";

export default function AuthForm({ title, onSubmit, showRole }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Usuario Normal"
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>{title}</h2>

      {title === "Register" && (
        <div>
          <label>Nombre:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
      )}

      <div>
        <label>Correo:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>

      <div>
        <label>Contraseña:</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>

      {showRole && (
        <div>
          <label>Rol:</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="Usuario Normal">Usuario Normal</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>
      )}

      <button type="submit">{title}</button>
    </form>
  );
}
