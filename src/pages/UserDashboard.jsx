import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { ref, update } from "firebase/database";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function UserDashboard() {
  const [position, setPosition] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        setPosition(coords);

        const uid = auth.currentUser?.uid;
        if (uid) {
          update(ref(db, `users/${uid}/location`), coords);
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
      <h2>Usuario - Ubicación en tiempo real</h2>
      {position ? (
        <>
          <p>Lat: {position.latitude}, Lon: {position.longitude}</p>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: position.latitude,
                lng: position.longitude,
              }}
              zoom={15}
            >
              <Marker
                position={{
                  lat: position.latitude,
                  lng: position.longitude,
                }}
              />
            </GoogleMap>
          )}
        </>
      ) : (
        <p>Obteniendo ubicación...</p>
      )}
    </div>
  );
}
