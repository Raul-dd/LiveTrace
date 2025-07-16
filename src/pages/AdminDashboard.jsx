import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [center, setCenter] = useState({ lat: 19.4326, lng: -99.1332 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zoom, setZoom] = useState(15); // antes del return

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });
  

  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = Object.values(data || {});
      setUsers(usersList);

      const firstWithLocation = usersList.find((u) => u.location);
      if (firstWithLocation?.location) {
        setCenter({
          lat: firstWithLocation.location.latitude,
          lng: firstWithLocation.location.longitude,
        });
      }
    });

    return () => unsub();
  }, []);

  const handleUserSelect = (user) => {
    if (user.location) {
      const isSameUser = selectedUser?.uid === user.uid;

      setCenter({
        lat: user.location.latitude,
        lng: user.location.longitude,
      });

      setZoom(isSameUser ? 15 : 18); // alterna zoom
      setSelectedUser(isSameUser ? null : user); // deselecciona si es el mismo
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Encabezado */}
      <header style={{
        backgroundColor: "transparent",
        padding: "0.3rem 0",
        textAlign: "center",
        position: "absolute",
        top: "10px",  
        left: 0,
        width: "100%",
        zIndex: 1000
      }}>
        <span style={{
          backgroundColor: "rgba(0, 21, 125, 0.6)", // fondo semitransparente
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "999px", // bordes completamente redondeados
          fontSize: "1.4rem",
          fontWeight: "bold",
          boxShadow: "0 0 6px rgba(0,0,0,0.5)", // sombra para destacar
          display: "inline-block",
          textShadow: "1px 1px 2px black" // mejor legibilidad
        }}>
          Administrador - Usuarios conectados
        </span>
      </header>



      {/* Botón hamburguesa */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "absolute",
          top: "80px",
          right: "25px",
          zIndex: 999,
          backgroundColor: "#1f2937",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "10px 15px",
          cursor: "pointer",
          fontSize: "1rem",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.3)"
        }}
      >
        ☰
      </button>

      {/* Contenedor general */}
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Mapa */}
        <div style={{ flex: 1 }}>
          {isLoaded && (
            <GoogleMap
            
              mapContainerStyle={containerStyle}
              center={center}
              zoom={zoom}
            >
              {users.map((user) => (
                user.location && (
                  <Marker
                    key={user.uid}
                    position={{
                      lat: user.location.latitude,
                      lng: user.location.longitude,
                    }}
                    label={user.name}
                  />
                )
              ))}
            </GoogleMap>
          )}
        </div>

        {/* Barra lateral (desplegable) */}
        <div style={{
          position: "absolute",
          top: "80px",                     // altura desde arriba
          right: sidebarOpen ? "25px" : "-330px", // fuera de pantalla si cerrado
          width: "300px",
          maxHeight: "80vh",
          overflowY: "auto",
          backgroundColor: "#f3f4f6",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          padding: "1rem",
          transition: "right 0.3s ease",
          zIndex: 998
        }}>
          {sidebarOpen && (
            <>
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#111827"
              }}>
                Usuarios Registrados
              </h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {users.map((user) => (
                  <li key={user.uid} style={{ marginBottom: "0.75rem" }}>
                    <button
                      onClick={() => handleUserSelect(user)}
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        textAlign: "left",
                        backgroundColor:
                          selectedUser?.uid === user.uid ? "#e5e7eb" : "#ffffff",
                        border: "1px solidrgb(0, 0, 0)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <strong style={{ fontSize: "1rem", color: "#6b7280" }}>{user.name}</strong>
                      <br />
                      <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>{user.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
