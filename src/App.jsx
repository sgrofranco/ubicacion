import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ipData, setIpData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1 className="title">Geo Tracker v6</h1>
        
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <p>Scanning network and locating...</p>
          </div>
        )}

        {error && (
          <div className="state-container error">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p>{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && ipData && locationData && (
          <div className="info-container">
            <div className="info-item highlight">
              <span className="label">Your IP Address</span>
              <span className="value ip-value">{ipData}</span>
            </div>
            
            <div className="location-grid">
              <div className="grid-item">
                <span className="label">City</span>
                <span className="value">{locationData.city || 'Unknown'}</span>
              </div>
              <div className="grid-item">
                <span className="label">Region</span>
                <span className="value">{locationData.region || 'Unknown'}</span>
              </div>
              <div className="grid-item">
                <span className="label">Country</span>
                <span className="value">{locationData.country || 'Unknown'}</span>
              </div>
              <div className="grid-item">
                <span className="label">Coordinates</span>
                <span className="value">{locationData.loc || 'Unknown'}</span>
              </div>
              <div className="grid-item">
                <span className="label">Org / ISP</span>
                <span className="value">{locationData.org || 'Unknown'}</span>
              </div>
              <div className="grid-item">
                <span className="label">Timezone</span>
                <span className="value">{locationData.timezone || 'Unknown'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
