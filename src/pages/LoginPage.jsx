// src/pages/LoginPage.jsx
import React, { useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { ref, get } from "firebase/database";
import { db } from "../firebaseConfig";

/*  ⬇️  NUEVO: font-awesome completa (solo CSS, sin componentes)  */
import "@fortawesome/fontawesome-free/css/all.min.css";

/* ------------------------  ESTILOS  ------------------------ */

const rippleAnim = keyframes`
  0%   { width:0; height:0; opacity:.5; }
  100% { width:500px; height:500px; opacity:0; }
`;
const float = keyframes`
  0%   { transform:translateY(0) rotate(.5deg); }
  50%  { transform:translateY(-6px) rotate(-.5deg); }
  100% { transform:translateY(0) rotate(.5deg); }
`;
const glowPulse = keyframes`
  from { opacity:.3; transform:scale(.98); }
  to   { opacity:.5; transform:scale(1.02); }
`;

const Page = styled.div`
  --primary: #0b2e1f;
  --secondary: #145C32;
  --accent: #4CAF50;
  --shadowL: rgba(255,255,255,.1);
  --shadowD: rgba(0,0,0,.3);
  --bg0: #0a0a0a;
  --bg1: #1c1c1c;
  --card: rgba(0,0,0,.85);
  --text: #fff;
  --input: #fff;
  --placeholder: #cfcfcf;

  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg0), var(--bg1));
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;

  @media(max-width: 1024px){
    gap: 30px;
    flex-direction: column;
    justify-content: center;
    padding: 40px 20px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px 30px;
  background: var(--card);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 8px 8px 16px var(--shadowD), -8px -8px 16px var(--shadowL);
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    width: 90%;
    margin: 0 0 20px;
  }
`;

const Header = styled.div`
  text-align:center;
  h1{ font-size:32px; font-weight:700; margin-bottom:8px; }
  p{ color:#e0e0e0; }
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #00ff62ff;
    z-index: 2;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  &.focused .icon {
    color: #90EE90;
  }
`;

const Input = styled.input`
  width: 100%;
  max-width: 100%;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 14px 12px 48px;
  border: none;
  border-radius: 12px;
  background: var(--input);
  box-shadow: inset 4px 4px 8px var(--shadowD), inset -4px -4px 8px var(--shadowL);
  outline: none;
  box-sizing: border-box;
  &::placeholder {
    color: var(--placeholder);
  }
  color: var(--primary);
`;

const Button = styled.button`
  width:100%; padding:15px; margin-top:6px;
  font-weight:600; font-size:16px; color:#fff;
  border:none; border-radius:12px; cursor:pointer;
  background:linear-gradient(135deg,var(--primary),var(--secondary));
  border:1px solid var(--accent);
  box-shadow:4px 4px 8px var(--shadowD), -4px -4px 8px var(--shadowL);
  overflow:hidden; position:relative; transition:.3s;

  &:hover{ opacity:.95; transform:translateY(-2px); }
  &:active{ transform:translateY(0); box-shadow:inset 4px 4px 8px rgba(0,0,0,.2); }
  span.ripple{
    position:absolute; border-radius:50%; pointer-events:none;
    background:rgba(255,255,255,.5); animation:${rippleAnim} .8s linear;
    transform:translate(-50%,-50%);
  }
`;

const Prompt = styled.div`
  margin-top:15px; text-align:center; font-size:14px; color:#718096;
  a{ color:var(--primary); text-decoration:none; font-weight:500;
     &:hover{ text-decoration:underline; color:var(--accent); }
  }
`;

const Footer = styled.div`
  margin-top:30px; text-align:center; font-size:14px; color:#718096;
`;

const Hero = styled.div`
  width:60%; height:100%; position:relative;
  display:flex; align-items:center; justify-content:center; overflow:hidden;
  @media(max-width:768px){ display:none; }
`;

const Parallax = styled.div`
  width:100%; height:100%; perspective:1000px; transform-style:preserve-3d;
  display:flex; align-items:center; justify-content:center;
`;

const SneakerWrap = styled.div`
  position:relative; width:100%; max-width:700px; animation:${float} 3s ease-in-out infinite;
  display:flex; justify-content:center;
`;

const Glow = styled.div`
  position:absolute; inset:0;
  border:2px solid var(--accent); border-radius:30% 70% 70% 30% / 30% 30% 70% 70%;
  filter:blur(15px); opacity:.4; animation:${glowPulse} 3s infinite alternate;
`;

const SneakerImg = styled.img`
  width:100%; border-radius:16px; filter:drop-shadow(0 0 20px rgba(76,175,80,.4));
`;

/* ------------------------  COMPONENTE  ------------------------ */

export default function LoginPage() {
  const navigate = useNavigate();
  const emailRef   = useRef(null);
  const passRef    = useRef(null);
  const btnRef     = useRef(null);
  const shoeRef    = useRef(null);
  const wrapperRef = useRef(null);

  // Login handler -------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = {
      email: emailRef.current.value,
      password: passRef.current.value,
    };
    try {
      const { uid } = await loginUser(form);
      const snapshot = await get(ref(db, `users/${uid}`));
      const userData = snapshot.val();
      localStorage.setItem("user", JSON.stringify({
        uid,
        role: userData?.role || "Usuario"
      }));
      navigate(userData?.role === "Administrador" ? "/admin" : "/user");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  /* ------------------ EFECTOS JS ORIGINAL ------------------ */
  useEffect(() => {
    // Ripple
    const btn = btnRef.current;
    const createRipple = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top  = `${y}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    };
    btn.addEventListener("click", createRipple);

    // Focus styles
    const setFocus = (input, add) =>
      input.parentNode.classList[add ? "add" : "remove"]("focused");
    const email = emailRef.current, pass = passRef.current;
    [email, pass].forEach((inp) => {
      inp.addEventListener("focus", () => setFocus(inp, true));
      inp.addEventListener("blur", () => setFocus(inp, !!inp.value));
    });

    // Parallax
    const move = (e) => {
      if (window.innerWidth <= 768) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      shoeRef.current.style.transform =
        `translateX(${xAxis}px) translateY(${yAxis}px) rotate(${xAxis / 2}deg)`;
    };
    document.addEventListener("mousemove", move);

    return () => {
      btn.removeEventListener("click", createRipple);
      document.removeEventListener("mousemove", move);
    };
  }, []);

  /* ------------------------  UI  ------------------------ */
  return (
    <Page>
      <Layout>
        {/* ---------- Tarjeta de Login ---------- */}
        <Card>
          <Header>
            <h1>Bienvenido</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </Header>

          <form onSubmit={handleLogin} autoComplete="off">
            <FormGroup>
              <Input
                type="email"
                ref={emailRef}
                placeholder="Correo electrónico"
                className="form-control"
              />
              <i className="fas fa-envelope icon" />
            </FormGroup>

            <FormGroup>
              <Input
                type="password"
                ref={passRef}
                placeholder="Contraseña"
                className="form-control"
              />
              <i className="fas fa-lock icon" />
            </FormGroup>

            <Button ref={btnRef} type="submit">Iniciar Sesión</Button>

            <Prompt>
              ¿No tienes cuenta?{" "}
              <a href="/register">Regístrate aquí</a>
            </Prompt>
          </form>

          <Footer>Sistema de acceso seguro © 2025</Footer>
        </Card>

        {/* ---------- Hero con tenis ---------- */}
        <Hero>
          <Parallax ref={wrapperRef}>
            <SneakerWrap ref={shoeRef}>
              <Glow />
              <SneakerImg src="/images/tenis.png" alt="Tenis deportivo" />
            </SneakerWrap>
          </Parallax>
        </Hero>
      </Layout>
    </Page>
  );
}
