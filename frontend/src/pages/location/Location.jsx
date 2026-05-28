import { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import styles from './Location.module.css';
import {
  mockFamilyLocations,
  mockSOSHistory,
} from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Convert lat/lng to approximate % positions on our mock map image
function latLngToPercent(lat, lng) {
  // Uganda bounds approx: lat 4.2 to -1.5, lng 29.5 to 35.0
  const x = ((lng - 29.5) / (35.0 - 29.5)) * 100;
  const y = ((4.2  - lat) / (4.2  - -1.5))  * 100;
  return { x: Math.min(Math.max(x, 5), 95), y: Math.min(Math.max(y, 5), 95) };
}

// ─── Map Panel ────────────────────────────────────────────────────────────────
function MapPanel({ locations, selectedId, onSelectPin }) {
  return (
    <div className={styles.mapWrap}>
      {/* OpenStreetMap embed centered on Uganda */}
      <iframe
        className={styles.mapIframe}
        src="https://www.openstreetmap.org/export/embed.html?bbox=29.5%2C-1.5%2C35.0%2C4.2&layer=mapnik"
        title="Family Map"
        loading="lazy"
      />

      {/* Pins overlay */}
      <div className={styles.mapOverlay}>
        {locations.map(loc => {
          const pos = latLngToPercent(loc.lat, loc.lng);
          return (
            <div
              key={loc.id}
              className={styles.mapPin}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onSelectPin(loc.id)}
            >
              <div className={styles.mapPinTooltip}>
                {loc.name.split(' ')[0]} — {loc.address}
              </div>
              <div
                className={styles.mapPinAvatar}
                style={{
                  background: `linear-gradient(135deg, ${loc.color}, ${loc.color}bb)`,
                  transform: selectedId === loc.id ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: selectedId === loc.id
                    ? `0 0 0 3px ${loc.color}66, 0 4px 12px rgba(0,0,0,0.25)`
                    : '0 3px 10px rgba(0,0,0,0.2)',
                }}
              >
                {loc.initials}
              </div>
              <div className={styles.mapPinTail} />
              <div className={styles.mapPinDot} />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className={styles.mapLegend}>
        <div className={styles.mapLegendItem}>
          <div className={styles.mapLegendDot} style={{ background: '#27AE60' }} />
          Online now
        </div>
        <div className={styles.mapLegendItem}>
          <div className={styles.mapLegendDot} style={{ background: '#9A9590' }} />
          Last seen
        </div>
      </div>

      <button className={styles.myLocationBtn}>
        📍 My Location
      </button>
    </div>
  );
}

// ─── SOS Trigger Modal ────────────────────────────────────────────────────────
function SOSTriggerModal({ onTrigger, onClose }) {
  const [message, setMessage] = useState('');

  return (
    <div className={styles.sosModalOverlay} onClick={onClose}>
      <div className={styles.sosModal} onClick={e => e.stopPropagation()}>
        <div className={styles.sosModalTop}>
          <span className={styles.sosModalIcon}>🆘</span>
          <p className={styles.sosModalTitle}>Send SOS Alert</p>
          <p className={styles.sosModalSub}>
            All family members will be notified immediately with your current location.
          </p>
        </div>

        <div className={styles.sosModalBody}>
          <div className={styles.sosModalLabel}>Optional Message</div>
          <textarea
            className={styles.sosMessageInput}
            placeholder="Describe your situation (optional)..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <div className={styles.sosLocationDetect}>
            <span className={styles.sosLocationIcon}>📍</span>
            Your current location will be automatically included
          </div>
        </div>

        <div className={styles.sosModalFooter}>
          <button className={styles.sosCancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.sosTriggerBtn}
            onClick={() => onTrigger(message)}
          >
            🆘 Send SOS Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── I'm Safe Modal ───────────────────────────────────────────────────────────
function IAmSafeModal({ sos, onConfirm, onClose }) {
  return (
    <div className={styles.sosModalOverlay} onClick={onClose}>
      <div className={styles.iAmSafeModal} onClick={e => e.stopPropagation()}>
        <div className={styles.iAmSafeTop}>
          <span className={styles.iAmSafeIcon}>✅</span>
          <p className={styles.iAmSafeTitle}>I'm Safe</p>
          <p className={styles.iAmSafeSub}>
            Let the family know you are safe in response to {sos.triggeredBy}'s SOS alert.
          </p>
        </div>

        <div className={styles.iAmSafeBody}>
          <div className={styles.iAmSafeInfo}>
            Confirming sends a notification to all family members that you are safe and accounted for.
          </div>
        </div>

        <div className={styles.iAmSafeFooter}>
          <button className={styles.sosCancelBtn} onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className={styles.iAmSafeBtn} onClick={onConfirm}>
            ✅ I'm Safe
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Active SOS Banner ────────────────────────────────────────────────────────
function ActiveSOSBanner({ sos, onCancel }) {
  return (
    <div className={styles.activeSosBanner}>
      <div className={styles.activeSosLeft}>
        <span className={styles.activeSosIcon}>🆘</span>
        <div className={styles.activeSosText}>
          <div className={styles.activeSosTitle}>SOS Alert Active</div>
          <div className={styles.activeSosSub}>
            Sent to all family members · {sos.location}
          </div>
        </div>
      </div>
      <div className={styles.activeSosRight}>
        <div className={styles.safeResponseCount}>
          ✅ {sos.safeResponses.length} safe
        </div>
        <button className={styles.cancelSosBtn} onClick={onCancel}>
          Resolve
        </button>
      </div>
    </div>
  );
}

// ─── Location Page ────────────────────────────────────────────────────────────
export default function Location() {
  const [selectedPin,     setSelectedPin]     = useState(null);
  const [locationShared,  setLocationShared]  = useState(false);
  const [showSOSTrigger,  setShowSOSTrigger]  = useState(false);
  const [showIAmSafe,     setShowIAmSafe]     = useState(false);
  const [activeSOSItem,   setActiveSOSItem]   = useState(null);
  const [sosHistory,      setSOSHistory]      = useState(mockSOSHistory);
  const [myCoords,        setMyCoords]        = useState(null);

  // Try to get real coords for display
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setMyCoords({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) }),
        ()  => setMyCoords({ lat: '0.3136', lng: '32.5811' }) // fallback Kampala
      );
    }
  }, []);

  const handleShareLocation = () => {
    setLocationShared(v => !v);
  };

  const handleSOSTrigger = (message) => {
    const newSOS = {
      id: `s${Date.now()}`,
      triggeredBy: 'You',
      triggeredByInitials: 'RN',
      triggeredByColor: '#2D5A3D',
      message: message || null,
      location: myCoords ? `${myCoords.lat}, ${myCoords.lng}` : 'Kampala, Uganda',
      triggeredAt: 'Just now',
      status: 'active',
      safeResponses: [],
    };
    setActiveSOSItem(newSOS);
    setShowSOSTrigger(false);
  };

  const handleIAmSafeConfirm = () => {
    if (activeSOSItem) {
      setActiveSOSItem(prev => ({
        ...prev,
        safeResponses: [...prev.safeResponses, { name: 'You', initials: 'RN', color: '#2D5A3D' }]
      }));
    }
    setShowIAmSafe(false);
  };

  const handleResolveActiveSOSItem = () => {
    if (activeSOSItem) {
      setSOSHistory(prev => [{ ...activeSOSItem, status: 'resolved', triggeredAt: 'Just now' }, ...prev]);
    }
    setActiveSOSItem(null);
  };

  // Simulate incoming I'm Safe responses on active SOS
  useEffect(() => {
    if (!activeSOSItem) return;
    const names = [
      { name: 'Grace',  initials: 'GN', color: '#5A3D6E' },
      { name: 'David',  initials: 'DN', color: '#3D5A8A' },
      { name: 'Sarah',  initials: 'SN', color: '#8A5A3D' },
    ];
    const timers = names.map((n, i) =>
      setTimeout(() => {
        setActiveSOSItem(prev => {
          if (!prev) return prev;
          const already = prev.safeResponses.find(r => r.name === n.name);
          if (already) return prev;
          return { ...prev, safeResponses: [...prev.safeResponses, n] };
        });
      }, (i + 1) * 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [activeSOSItem?.id]);

  return (
    <AppShell>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>📍 Location & Safety</h1>
            <p>Share your location and trigger emergency alerts with one tap</p>
          </div>
          <button
            className={styles.sosHeaderBtn}
            onClick={() => setShowSOSTrigger(true)}
          >
            <span className={styles.sosBtnIcon}>🆘</span>
            SOS Alert
          </button>
        </div>

        {/* Active SOS banner */}
        {activeSOSItem && (
          <ActiveSOSBanner
            sos={activeSOSItem}
            onCancel={handleResolveActiveSOSItem}
          />
        )}

        {/* Main grid */}
        <div className={styles.grid}>

          {/* Left — Map + location list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Map */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>🗺️ Family Map</span>
                <button className={styles.cardAction}>Refresh</button>
              </div>
              <MapPanel
                locations={mockFamilyLocations}
                selectedId={selectedPin}
                onSelectPin={setSelectedPin}
              />
            </div>

            {/* Family location list */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>👥 Family Locations</span>
                <span style={{ fontSize: 12, color: '#9A9590' }}>
                  {mockFamilyLocations.filter(l => l.isOnline).length} online now
                </span>
              </div>
              <div className={styles.locationList}>
                {mockFamilyLocations.map(loc => (
                  <div
                    key={loc.id}
                    className={styles.locationItem}
                    onClick={() => setSelectedPin(loc.id === selectedPin ? null : loc.id)}
                    style={{
                      background: selectedPin === loc.id ? 'rgba(45,90,61,0.04)' : undefined,
                      borderLeft: selectedPin === loc.id ? `3px solid ${loc.color}` : '3px solid transparent',
                    }}
                  >
                    <div className={styles.locationAvatar}>
                      <div
                        className={styles.locationAvatarImg}
                        style={{ background: `linear-gradient(135deg, ${loc.color}, ${loc.color}bb)` }}
                      >
                        {loc.initials}
                      </div>
                      {loc.isOnline && <div className={styles.onlineDot} />}
                    </div>

                    <div className={styles.locationInfo}>
                      <div className={styles.locationName}>{loc.name}</div>
                      <div className={styles.locationRole}>{loc.role}</div>
                      <div className={styles.locationAddress}>
                        📍 {loc.address}
                      </div>
                    </div>

                    <div className={styles.locationMeta}>
                      <span className={styles.locationTime}>{loc.sharedAt}</span>
                      <button className={styles.viewOnMapBtn}>View on map</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right column */}
          <div className={styles.rightCol}>

            {/* My Location card */}
            <div className={styles.myLocationCard}>
              <div className={styles.myLocationTitle}>My Location</div>
              <div className={styles.myLocationValue}>
                {myCoords ? 'Kampala, Uganda' : 'Detecting...'}
              </div>
              <div className={styles.myLocationCoords}>
                {myCoords ? `${myCoords.lat}° N, ${myCoords.lng}° E` : '—'}
              </div>

              <button
                className={`${styles.shareLocationBtn} ${locationShared ? styles.active : ''}`}
                onClick={handleShareLocation}
              >
                {locationShared ? '✅ Location Shared' : '📡 Share My Location'}
              </button>

              {locationShared && (
                <div className={styles.locationSharedBadge}>
                  <div className={styles.locationPulseDot} />
                  Family can see your location
                </div>
              )}
            </div>

            {/* Incoming SOS — show I'm Safe prompt if there's an active one from someone else */}
            {sosHistory.filter(s => s.status === 'active').length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle} style={{ color: '#C0392B' }}>
                    🆘 Active SOS
                  </span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <button
                    onClick={() => setShowIAmSafe(true)}
                    style={{
                      width: '100%', padding: '12px',
                      background: 'linear-gradient(135deg, #1A5C30, #27AE60)',
                      border: 'none', borderRadius: 10, color: '#fff',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                      fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    ✅ I'm Safe
                  </button>
                </div>
              </div>
            )}

            {/* SOS History */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>🕐 SOS History</span>
              </div>
              <div className={styles.sosHistoryList}>
                {sosHistory.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9A9590', fontSize: 13 }}>
                    No SOS alerts yet — stay safe 🙏
                  </div>
                ) : (
                  sosHistory.map(sos => (
                    <div key={sos.id} className={styles.sosHistoryItem}>
                      <div className={styles.sosHistoryTop}>
                        <div
                          className={styles.sosHistoryAvatar}
                          style={{ background: `linear-gradient(135deg, ${sos.triggeredByColor}, ${sos.triggeredByColor}bb)` }}
                        >
                          {sos.triggeredByInitials}
                        </div>
                        <div className={styles.sosHistoryInfo}>
                          <div className={styles.sosHistoryName}>{sos.triggeredBy}</div>
                          <div className={styles.sosHistoryTime}>{sos.triggeredAt}</div>
                        </div>
                        <span className={`${styles.sosStatusBadge} ${styles[sos.status]}`}>
                          {sos.status}
                        </span>
                      </div>

                      {sos.message && (
                        <div className={styles.sosHistoryMessage}>"{sos.message}"</div>
                      )}

                      <div className={styles.sosHistoryLocation}>
                        📍 {sos.location}
                      </div>

                      {sos.safeResponses.length > 0 && (
                        <div className={styles.safeResponsesRow}>
                          <span className={styles.safeResponsesLabel}>✅ Safe:</span>
                          <div className={styles.safeAvatarStack}>
                            {sos.safeResponses.map((r, i) => (
                              <div
                                key={i}
                                className={styles.safeAvatar}
                                style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}bb)` }}
                                title={r.name}
                              >
                                {r.initials}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SOS Trigger Modal */}
      {showSOSTrigger && (
        <SOSTriggerModal
          onTrigger={handleSOSTrigger}
          onClose={() => setShowSOSTrigger(false)}
        />
      )}

      {/* I'm Safe Modal */}
      {showIAmSafe && (
        <IAmSafeModal
          sos={sosHistory[0]}
          onConfirm={handleIAmSafeConfirm}
          onClose={() => setShowIAmSafe(false)}
        />
      )}
    </AppShell>
  );
}