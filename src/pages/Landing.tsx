import React, { useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Lazy load the heavy 3D landing page so the bundle stays small
const LandingPage = lazy(() => import('./landing/LandingPage'));

function LandingLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0D0B09',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '20px',
    }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.25em',
        color: '#C97B2F',
        textTransform: 'uppercase',
      }}>Initializing Lab...</span>
      <div style={{
        width: '160px', height: '1px',
        background: 'rgba(201,123,47,0.15)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, #C97B2F, transparent)',
          animation: 'loading-scan 1.4s ease-in-out infinite',
        }} />
      </div>
      <style>{`
        @keyframes loading-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

const Landing: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Suspense fallback={<LandingLoader />}>
      <LandingPage />
    </Suspense>
  );
};

export default Landing;
