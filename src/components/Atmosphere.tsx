import React from 'react';

const Atmosphere: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-background">
      {/* Subtle radial glow in the center-top */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] opacity-60 mix-blend-screen"
      />
      
      {/* Secondary faint glow bottom-right */}
      <div 
        className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] opacity-40 mix-blend-screen"
      />

      {/* Very faint grid pattern overlay to give the 'physics lab' vibe */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default Atmosphere;
