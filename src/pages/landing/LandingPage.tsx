import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Scene from './Scene';
import React from 'react';

// ─── Loading Screen ─────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgb(5,6,12)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, gap: '20px',
    }}>
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', letterSpacing: '0.22em', color: 'rgb(56,189,248)', textTransform: 'uppercase' }}>
        Initializing Lab...
      </span>
      <div style={{ width: '160px', height: '1px', background: 'rgba(56,189,248,0.15)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgb(56,189,248), transparent)', animation: 'scan 1.4s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes scan{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </div>
  );
}

// ─── Fixed Navbar ────────────────────────────────────────────────────────────
function LandingNav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '64px', zIndex: 100,
      background: 'rgba(5,6,12,0.8)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(16px,5vw,48px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px', color: 'rgb(56,189,248)' }}>⚛</span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, fontSize: '13px', letterSpacing: '0.15em', color: 'rgb(226,232,240)' }}>
          PHYSICS<span style={{ color: 'rgb(56,189,248)' }}>.</span>LAB
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/auth" style={{ fontFamily: "'Syne',sans-serif", fontSize: '13px', color: 'rgb(148,163,184)', textDecoration: 'none' }}>Sign In</Link>
        <Link to="/auth" style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', fontWeight: 500,
          background: 'rgb(56,189,248)', color: 'rgb(15,23,42)', textDecoration: 'none', padding: '9px 20px', borderRadius: '8px',
          boxShadow: '0 0 16px rgba(56,189,248,0.3)',
        }}>Get Started</Link>
      </div>
    </nav>
  );
}

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.11, ease: [0.16, 1, 0.3, 1] } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({ opacity: 1, transition: { duration: 0.8, delay: i * 0.1 } }),
};

const SectionTag = ({ label }: { label: string }) => (
  <motion.div variants={fadeIn} custom={0} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '0.22em', color: 'rgb(56,189,248)', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'rgb(56,189,248)' }} />{label}
  </motion.div>
);

function CTA({ to, filled, children }: { to: string; filled?: boolean; children: React.ReactNode }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <motion.div whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(56,189,248,0.5)' }} whileTap={{ scale: 0.97 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 30px', borderRadius: '8px',
          fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', letterSpacing: '0.1em', fontWeight: 500, cursor: 'pointer',
          ...(filled ? { background: 'rgb(56,189,248)', color: 'rgb(15,23,42)', border: '1px solid rgb(56,189,248)', boxShadow: '0 0 14px rgba(56,189,248,0.3)' }
            : { background: 'rgba(56,189,248,0.06)', color: 'rgb(125,211,252)', border: '1px solid rgba(56,189,248,0.3)' }),
        }}>
        {children}
      </motion.div>
    </Link>
  );
}

export const scrollProgressRef = { current: 0 };

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ children, sectionIndex, style = {} }: { children: React.ReactNode; sectionIndex: number; style?: React.CSSProperties }) {
  const labels = ['HERO','PROBLEM','CHAPTERS','MODES','PYQ VAULT','ANALYTICS','BEGIN'];
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.25 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(80px,10vh,120px) clamp(20px,5vw,80px) 60px', position: 'relative', ...style }}>
      <motion.div variants={fadeIn} custom={0} style={{ position: 'absolute', top: '80px', left: 'clamp(20px,5vw,60px)', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(56,189,248,0.45)', textTransform: 'uppercase' }}>
        {String(sectionIndex + 1).padStart(2,'0')} / {labels[sectionIndex]}
      </motion.div>
      {children}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const chapters = ['Units & Measurements','Kinematics','Laws of Motion','Work & Energy','Circular Motion','Gravitation','SHM','Thermodynamics','Waves','Electrostatics','Ray Optics'];
const modes = [
  { icon:'⚡', tag:'Adaptive', title:'Practice', desc:'Chapter-wise MCQs with instant feedback and spaced repetition.' },
  { icon:'📋', tag:'Year-wise', title:'Explore PYQs', desc:'Every previous year question from JEE Main, Advanced & MHT CET.' },
  { icon:'◎', tag:'AI Driven', title:'Track Progress', desc:'ML-powered analytics showing your exact mastery per chapter.' },
];
const radars = [
  { label:'Mechanics', pct:78 },{ label:'Optics', pct:55 },{ label:'Thermo.', pct:42 },
  { label:'Waves', pct:88 },{ label:'Electrostatics', pct:34 },{ label:'SHM', pct:65 },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <Section sectionIndex={0}>
      <div style={{ textAlign: 'center', maxWidth: '820px' }}>
        <motion.div variants={fadeIn} custom={0} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', letterSpacing: '0.28em', color: 'rgb(56,189,248)', textTransform: 'uppercase', marginBottom: '36px' }}>
          Physics · Mastery · JEE / NEET
        </motion.div>
        <motion.h1 variants={fadeUp} custom={1} style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(48px,8vw,100px)', fontWeight: 400, color: 'rgb(226,232,240)', lineHeight: 1.0, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          The exam is in
        </motion.h1>
        <motion.h1 variants={fadeUp} custom={2} style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(68px,12vw,140px)', fontWeight: 400, fontStyle: 'italic', background: 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 55%, #0EA5E9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.0, margin: '0 0 40px', letterSpacing: '-0.02em' }}>
          87 days.
        </motion.h1>
        <motion.p variants={fadeUp} custom={3} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '15px', letterSpacing: '0.08em', color: 'rgb(148,163,184)', marginBottom: '56px' }}>
          Are you ready?
        </motion.p>
        <motion.div variants={fadeUp} custom={4} style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CTA to="/auth" filled>Enter the Lab →</CTA>
          <CTA to="/auth">See How It Works</CTA>
        </motion.div>
      </div>
      <motion.div variants={fadeIn} custom={5} style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, transparent, rgba(56,189,248,0.6))' }} />
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase' }}>Scroll</span>
      </motion.div>
    </Section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  return (
    <Section sectionIndex={1} style={{ alignItems: 'flex-start', paddingLeft: 'clamp(28px,9vw,140px)' }}>
      <div style={{ maxWidth: '580px' }}>
        <SectionTag label="The Reality" />
        <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(34px,5vw,64px)', fontWeight: 400, color: 'rgb(226,232,240)', lineHeight: 1.15, margin: '0 0 24px' }}>
          11 chapters.<br />Thousands of PYQs.
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{ fontFamily: "'Syne',sans-serif", fontSize: '17px', color: 'rgb(148,163,184)', lineHeight: 1.7, margin: '0 0 48px', maxWidth: '440px' }}>
          Most aspirants practice randomly — without knowing which chapters need work, or which questions actually appear.
          <br /><br /><span style={{ color: 'rgb(56,189,248)' }}>That is why most fail.</span>
        </motion.p>
        <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
          {[{ num: '73%', label: 'students have no study structure' }, { num: '#1', label: 'reason for JEE failures' }].map(s => (
            <div key={s.num}>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '44px', color: 'rgb(56,189,248)', lineHeight: 1, marginBottom: '6px' }}>{s.num}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '0.14em', color: 'rgb(148,163,184)', textTransform: 'uppercase', maxWidth: '130px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Chapters ─────────────────────────────────────────────────────────────────
function Chapters() {
  return (
    <Section sectionIndex={2}>
      <div style={{ width: '100%', maxWidth: '860px', textAlign: 'center' }}>
        <SectionTag label="Complete Syllabus Coverage" />
        <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(34px,5vw,66px)', color: 'rgb(226,232,240)', fontWeight: 400, margin: '0 0 14px', lineHeight: 1.1 }}>
          11 chapters. <span style={{ fontStyle: 'italic', color: 'rgb(56,189,248)' }}>Structured.</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{ fontFamily: "'Syne',sans-serif", color: 'rgb(148,163,184)', fontSize: '15px', marginBottom: '48px' }}>
          Every topic from Class 11 & 12 organized and ready to practice.
        </motion.p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {chapters.map((ch, i) => (
            <motion.div key={ch} variants={fadeUp} custom={i * 0.4 + 3}
              style={{ padding: '10px 18px', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '8px', background: 'rgba(56,189,248,0.05)', fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', letterSpacing: '0.07em', color: 'rgb(125,211,252)' }}>
              {ch}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Modes ────────────────────────────────────────────────────────────────────
function Modes() {
  return (
    <Section sectionIndex={3}>
      <div style={{ width: '100%', maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <SectionTag label="Three Ways to Learn" />
          <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(30px,5vw,58px)', color: 'rgb(226,232,240)', fontWeight: 400, margin: 0, lineHeight: 1.1 }}>
            One platform. <span style={{ fontStyle: 'italic', color: 'rgb(56,189,248)' }}>Everything you need.</span>
          </motion.h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '18px' }}>
          {modes.map((m, i) => (
            <motion.div key={m.title} variants={fadeUp} custom={i + 2}
              whileHover={{ y: -5, boxShadow: '0 0 30px rgba(56,189,248,0.15)' }}
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '30px 26px', backdropFilter: 'blur(14px)' }}>
              <div style={{ fontSize: '26px', marginBottom: '14px' }}>{m.icon}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', letterSpacing: '0.22em', color: 'rgb(56,189,248)', textTransform: 'uppercase', marginBottom: '8px' }}>{m.tag}</div>
              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '24px', color: 'rgb(226,232,240)', margin: '0 0 10px', fontWeight: 400 }}>{m.title}</h3>
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: '14px', color: 'rgb(148,163,184)', lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── PYQ Vault ────────────────────────────────────────────────────────────────
function PYQVault() {
  return (
    <Section sectionIndex={4}>
      <div style={{ textAlign: 'center', maxWidth: '680px' }}>
        <SectionTag label="Every Exam · Every Shift · Every Year" />
        <motion.div variants={fadeUp} custom={1} style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(72px,14vw,168px)', color: 'rgb(56,189,248)', fontWeight: 400, lineHeight: 1, margin: '0 0 6px', letterSpacing: '-0.04em', textShadow: '0 0 80px rgba(56,189,248,0.2)' }}>
          5,000+
        </motion.div>
        <motion.h2 variants={fadeUp} custom={2} style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(18px,3vw,30px)', fontWeight: 300, color: 'rgb(226,232,240)', margin: '0 0 40px', letterSpacing: '0.04em' }}>
          Previous Year Questions
        </motion.h2>
        <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', justifyContent: 'center', gap: '36px', flexWrap: 'wrap', marginBottom: '44px' }}>
          {[{ num: '8+', label: 'Years of JEE' },{ num: '3', label: 'Exams' },{ num: '100%', label: 'Explained' }].map(s => (
            <div key={s.num} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '38px', color: 'rgb(125,211,252)', lineHeight: 1, marginBottom: '6px' }}>{s.num}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', color: 'rgb(148,163,184)', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
        <motion.div variants={fadeUp} custom={4} style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['JEE Main 2024','JEE Advanced 2023','MHT CET 2024','JEE Main 2023'].map(tag => (
            <div key={tag} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgb(148,163,184)', padding: '5px 13px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px' }}>{tag}</div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function Analytics() {
  return (
    <Section sectionIndex={5} style={{ alignItems: 'flex-end', paddingRight: 'clamp(28px,9vw,140px)' }}>
      <div style={{ maxWidth: '520px', textAlign: 'right' }}>
        <SectionTag label="Adaptive Progress Tracking" />
        <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(30px,5vw,58px)', color: 'rgb(226,232,240)', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1 }}>
          Know exactly<br /><span style={{ fontStyle: 'italic', color: 'rgb(56,189,248)' }}>where you stand.</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', color: 'rgb(148,163,184)', lineHeight: 1.7, marginBottom: '32px' }}>
          ML-powered mastery tracking shows which chapters need work, predicts your score, and tells you what to study next.
        </motion.p>
        <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {radars.map((r, i) => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: 'rgb(148,163,184)', letterSpacing: '0.08em', width: '96px', textAlign: 'right', flexShrink: 0 }}>{r.label}</div>
              <div style={{ flex: 1, height: '3px', background: 'rgba(56,189,248,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${r.pct}%` }}
                  transition={{ duration: 1.1, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: '100%', background: `linear-gradient(90deg, #0EA5E9, ${r.pct > 70 ? '#7DD3FC' : r.pct > 50 ? '#38BDF8' : '#0369A1'})`, borderRadius: '2px' }} />
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: r.pct > 70 ? 'rgb(125,211,252)' : r.pct > 50 ? 'rgb(56,189,248)' : 'rgb(14,165,233)', width: '28px', flexShrink: 0 }}>{r.pct}%</div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <Section sectionIndex={6}>
      <div style={{ textAlign: 'center', maxWidth: '660px' }}>
        <motion.div variants={fadeUp} custom={0} style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(13px,2vw,17px)', fontWeight: 300, color: 'rgb(148,163,184)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '22px' }}>
          The lab is open
        </motion.div>
        <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(52px,9vw,116px)', fontWeight: 400, color: 'rgb(226,232,240)', lineHeight: 0.95, margin: '0 0 56px', letterSpacing: '-0.02em' }}>
          Start<br /><span style={{ fontStyle: 'italic', background: 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Learning.</span>
        </motion.h2>
        <motion.div variants={fadeUp} custom={2} style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '44px' }}>
          <CTA to="/auth" filled>Begin Free →</CTA>
          <CTA to="/auth">Explore Chapters</CTA>
        </motion.div>
        <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', justifyContent: 'center' }}>
          {['✦ LaTeX rendered questions','✦ JEE Main + Advanced','✦ Chapter-wise filters','✦ Difficulty levels','✦ Spaced repetition'].map(pill => (
            <div key={pill} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '0.08em', color: 'rgba(148,163,184,0.65)', padding: '6px 13px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '100px', background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)' }}>{pill}</div>
          ))}
        </motion.div>
        <motion.div variants={fadeIn} custom={5} style={{ marginTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(148,163,184,0.35)' }}>© 2025 PHYSICS.LAB</span>
          <Link to="/auth" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(56,189,248,0.45)', textDecoration: 'none' }}>Sign In</Link>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollBar({ progress }: { progress: number }) {
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '2px', height: '100vh', background: 'rgba(56,189,248,0.1)', zIndex: 50, pointerEvents: 'none' }}>
      <div style={{ width: '100%', height: `${progress * 100}%`, background: 'linear-gradient(to bottom, rgb(56,189,248), rgb(125,211,252))', transition: 'height 0.1s linear' }} />
    </div>
  );
}

function ScrollBarWrapper({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const fn = () => { const max = el.scrollHeight - el.clientHeight; setProgress(max > 0 ? el.scrollTop / max : 0); };
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, [containerRef]);
  return <ScrollBar progress={progress} />;
}

function DotNavWrapper({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [progress, setProgress] = React.useState(0);
  const labels = ['Hero','Problem','Chapters','Modes','PYQs','Analytics','Begin'];
  React.useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const fn = () => { const max = el.scrollHeight - el.clientHeight; setProgress(max > 0 ? el.scrollTop / max : 0); };
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, [containerRef]);
  const active = Math.min(6, Math.floor(progress * 7));
  return (
    <div style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 50, pointerEvents: 'none' }}>
      {labels.map((_, i) => (
        <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', border: '1px solid rgba(56,189,248,0.4)', background: i === active ? 'rgb(56,189,248)' : 'transparent', transition: 'background 0.3s' }} />
      ))}
    </div>
  );
}

// ─── Main LandingPage ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      scrollProgressRef.current = max > 0 ? el.scrollTop / max : 0;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'rgb(5,6,12)', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Canvas backdrop */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Suspense fallback={<LoadingScreen />}>
          <Canvas gl={{ antialias: true, alpha: false }} camera={{ position: [0, 0, 14], fov: 55 }} dpr={[1, 1.5]} style={{ width: '100%', height: '100%' }}>
            <Scene scrollProgressRef={scrollProgressRef} />
          </Canvas>
        </Suspense>
      </div>

      {/* Navbar */}
      <LandingNav />

      {/* HTML scroll layer */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 10, overflowY: 'scroll', overflowX: 'hidden' }}>
        <ScrollBarWrapper containerRef={containerRef} />
        <DotNavWrapper containerRef={containerRef} />
        <Hero />
        <Problem />
        <Chapters />
        <Modes />
        <PYQVault />
        <Analytics />
        <FinalCTA />
      </div>
    </div>
  );
}
