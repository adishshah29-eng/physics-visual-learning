import { Scroll } from '@react-three/drei';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

// ─── Shared animation variants ───────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({
  children, index, style = {},
}: {
  children: React.ReactNode;
  index: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-15%' }}
      style={{
        position: 'absolute',
        top: `${index * 100}vh`,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        padding: '0 24px',
        ...style,
      }}
    >
      {/* Section counter */}
      <motion.div
        variants={fadeIn}
        custom={0}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#C97B2F',
          textTransform: 'uppercase',
        }}
      >
        {String(index + 1).padStart(2, '0')} / {['HERO', 'PROBLEM', 'CHAPTERS', 'MODES', 'PYQ VAULT', 'ANALYTICS', 'BEGIN'][index] ?? 'END'}
      </motion.div>
      {children}
    </motion.section>
  );
}

// ─── Mono label ──────────────────────────────────────────────────────────────
function MonoTag({ children, custom = 0 }: { children: React.ReactNode; custom?: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={custom}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.25em',
        color: '#C97B2F',
        textTransform: 'uppercase',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#C97B2F' }} />
      {children}
    </motion.div>
  );
}

// ─── CTA Button ──────────────────────────────────────────────────────────────
function CTAButton({
  to, filled = false, children,
}: {
  to: string; filled?: boolean; children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      style={{ pointerEvents: 'all' }}
    >
      <motion.div
        whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(201,123,47,0.55)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 32px',
          borderRadius: '8px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '13px',
          letterSpacing: '0.12em',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'box-shadow 0.25s ease',
          ...(filled
            ? {
                background: '#C97B2F',
                color: '#0D0B09',
                border: '1px solid #C97B2F',
                boxShadow: '0 0 16px rgba(201,123,47,0.35)',
              }
            : {
                background: 'rgba(201,123,47,0.06)',
                color: '#E8A44A',
                border: '1px solid rgba(201,123,47,0.35)',
              }
          ),
        }}
      >
        {children}
      </motion.div>
    </Link>
  );
}

// ─── Section 0: HERO ─────────────────────────────────────────────────────────
function HeroSection() {
  const daysLeft = 87; // Could compute dynamically

  return (
    <Section index={0}>
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <motion.div variants={fadeIn} custom={0} style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: '#C97B2F',
          textTransform: 'uppercase',
          marginBottom: '32px',
        }}>
          Physics · Mastery · JEE / NEET
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 'clamp(52px, 9vw, 110px)',
          fontWeight: 400,
          color: '#F2EBE0',
          lineHeight: 1.0,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}>
          The exam is in
        </motion.h1>
        <motion.h1 variants={fadeUp} custom={2} style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 'clamp(72px, 13vw, 150px)',
          fontWeight: 400,
          fontStyle: 'italic',
          background: 'linear-gradient(135deg, #E8A44A 0%, #C97B2F 60%, #8B4A0F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.0,
          margin: '0 0 40px',
          textShadow: 'none',
          letterSpacing: '-0.02em',
        }}>
          {daysLeft} days.
        </motion.h1>

        <motion.p variants={fadeUp} custom={3} style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '15px',
          letterSpacing: '0.08em',
          color: '#8A7A6A',
          marginBottom: '56px',
        }}>
          Are you ready?
        </motion.p>

        <motion.div variants={fadeUp} custom={4} style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <CTAButton to="/auth" filled>
            Enter the Lab →
          </CTAButton>
          <CTAButton to="/auth">
            See How It Works
          </CTAButton>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        variants={fadeIn}
        custom={6}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, transparent, rgba(201,123,47,0.6))',
          }}
        />
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'rgba(138,122,106,0.5)',
          textTransform: 'uppercase',
        }}>Scroll</span>
      </motion.div>
    </Section>
  );
}

// ─── Section 1: THE PROBLEM ───────────────────────────────────────────────────
function ProblemSection() {
  return (
    <Section index={1} style={{ alignItems: 'flex-start', paddingLeft: 'clamp(32px, 8vw, 120px)' }}>
      <div style={{ maxWidth: '600px' }}>
        <MonoTag custom={0}>The Reality</MonoTag>
        <motion.h2 variants={fadeUp} custom={1} style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 400,
          color: '#F2EBE0',
          lineHeight: 1.15,
          margin: '0 0 24px',
        }}>
          11 chapters.<br />Thousands of PYQs.
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '18px',
          fontWeight: 400,
          color: '#8A7A6A',
          lineHeight: 1.7,
          margin: '0 0 48px',
          maxWidth: '440px',
        }}>
          Most aspirants practice randomly — without knowing which chapters need
          work, or which questions actually appear in the exam.
          <br /><br />
          <span style={{ color: '#C97B2F' }}>That is why most fail.</span>
        </motion.p>

        <motion.div variants={fadeUp} custom={3} style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
        }}>
          {[
            { num: '73%', label: 'students have no study structure' },
            { num: '#1', label: 'reason for JEE failures' },
          ].map((stat) => (
            <div key={stat.num}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '42px',
                color: '#C97B2F',
                lineHeight: 1,
                marginBottom: '6px',
              }}>{stat.num}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: '#8A7A6A',
                textTransform: 'uppercase',
                maxWidth: '140px',
              }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Section 2: CHAPTERS ─────────────────────────────────────────────────────
const chapters = [
  'Units & Measurements', 'Kinematics', 'Laws of Motion',
  'Work & Energy', 'Circular Motion', 'Gravitation',
  'SHM', 'Thermodynamics', 'Waves', 'Electrostatics', 'Ray Optics',
];

function ChaptersSection() {
  return (
    <Section index={2}>
      <div style={{ width: '100%', maxWidth: '900px', textAlign: 'center' }}>
        <MonoTag custom={0}>Complete Syllabus Coverage</MonoTag>
        <motion.h2 variants={fadeUp} custom={1} style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 5vw, 68px)',
          color: '#F2EBE0',
          fontWeight: 400,
          margin: '0 0 16px',
          lineHeight: 1.1,
        }}>
          11 chapters. <span style={{ fontStyle: 'italic', color: '#C97B2F' }}>Structured.</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{
          fontFamily: "'Syne', sans-serif",
          color: '#8A7A6A',
          fontSize: '16px',
          marginBottom: '56px',
        }}>
          Every topic from Class 11 & 12 physics organized and ready to practice.
        </motion.p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
        }}>
          {chapters.map((ch, i) => (
            <motion.div
              key={ch}
              variants={fadeUp}
              custom={i * 0.5 + 3}
              style={{
                padding: '12px 20px',
                border: '1px solid rgba(201,123,47,0.2)',
                borderRadius: '8px',
                background: 'rgba(201,123,47,0.06)',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: '#E8A44A',
                cursor: 'default',
              }}
            >
              {ch}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Section 3: LEARNING MODES ────────────────────────────────────────────────
const modes = [
  {
    title: 'Practice',
    desc: 'Chapter-wise MCQs with instant feedback and spaced repetition.',
    tag: 'Adaptive',
    icon: '⚡',
  },
  {
    title: 'Explore PYQs',
    desc: 'Every previous year question from JEE Main, Advanced & MHT CET.',
    tag: 'Year-wise',
    icon: '📋',
  },
  {
    title: 'Track Progress',
    desc: 'ML-powered analytics showing your exact mastery per chapter.',
    tag: 'AI Driven',
    icon: '◎',
  },
];

function ModesSection() {
  return (
    <Section index={3}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <MonoTag custom={0}>Three Ways to Learn</MonoTag>
          <motion.h2 variants={fadeUp} custom={1} style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(32px, 5vw, 60px)',
            color: '#F2EBE0',
            fontWeight: 400,
            margin: '0',
            lineHeight: 1.1,
          }}>
            One platform. <span style={{ fontStyle: 'italic', color: '#C97B2F' }}>Everything you need.</span>
          </motion.h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {modes.map((m, i) => (
            <motion.div
              key={m.title}
              variants={fadeUp}
              custom={i + 2}
              whileHover={{ y: -4, boxShadow: '0 0 32px rgba(201,123,47,0.2)' }}
              style={{
                background: 'rgba(26, 22, 18, 0.85)',
                border: '1px solid rgba(201,123,47,0.18)',
                borderRadius: '16px',
                padding: '32px 28px',
                backdropFilter: 'blur(12px)',
                cursor: 'default',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{m.icon}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.22em',
                color: '#C97B2F',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}>{m.tag}</div>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '26px',
                color: '#F2EBE0',
                margin: '0 0 12px',
                fontWeight: 400,
              }}>{m.title}</h3>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '14px',
                color: '#8A7A6A',
                lineHeight: 1.65,
                margin: 0,
              }}>{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Section 4: PYQ VAULT ─────────────────────────────────────────────────────
function PYQSection() {
  return (
    <Section index={4}>
      <div style={{ textAlign: 'center', maxWidth: '700px' }}>
        <MonoTag custom={0}>Every Exam. Every Shift. Every Year.</MonoTag>
        <motion.div variants={fadeUp} custom={1} style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(80px, 16vw, 180px)',
          color: '#C97B2F',
          fontWeight: 400,
          lineHeight: 1,
          margin: '0 0 8px',
          letterSpacing: '-0.04em',
          textShadow: '0 0 80px rgba(201,123,47,0.3)',
        }}>
          5,000+
        </motion.div>
        <motion.h2 variants={fadeUp} custom={2} style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(20px, 3vw, 32px)',
          fontWeight: 300,
          color: '#F2EBE0',
          margin: '0 0 40px',
          letterSpacing: '0.04em',
        }}>
          Previous Year Questions
        </motion.h2>

        <motion.div variants={fadeUp} custom={3} style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
          marginBottom: '48px',
        }}>
          {[
            { num: '8+', label: 'Years of JEE' },
            { num: '3', label: 'Exams' },
            { num: '100%', label: 'Explained' },
          ].map((s) => (
            <div key={s.num} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '40px',
                color: '#E8A44A',
                lineHeight: 1,
                marginBottom: '6px',
              }}>{s.num}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#8A7A6A',
                textTransform: 'uppercase',
              }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} custom={4} style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {['JEE Main 2024', 'JEE Advanced 2023', 'MHT CET 2024', 'JEE Main 2023'].map((tag) => (
            <div key={tag} style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: '#8A7A6A',
              padding: '6px 14px',
              border: '1px solid rgba(138,122,106,0.2)',
              borderRadius: '100px',
            }}>
              {tag}
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Section 5: ANALYTICS ─────────────────────────────────────────────────────
function AnalyticsSection() {
  const radars = [
    { label: 'Mechanics', pct: 78 },
    { label: 'Optics', pct: 55 },
    { label: 'Thermo.', pct: 42 },
    { label: 'Waves', pct: 88 },
    { label: 'Electrostatics', pct: 34 },
    { label: 'SHM', pct: 65 },
  ];

  return (
    <Section index={5} style={{ alignItems: 'flex-end', paddingRight: 'clamp(32px, 8vw, 120px)' }}>
      <div style={{ maxWidth: '560px', textAlign: 'right' }}>
        <MonoTag custom={0}>Adaptive Progress Tracking</MonoTag>
        <motion.h2 variants={fadeUp} custom={1} style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 5vw, 60px)',
          color: '#F2EBE0',
          fontWeight: 400,
          margin: '0 0 16px',
          lineHeight: 1.1,
        }}>
          Know exactly<br />
          <span style={{ fontStyle: 'italic', color: '#C97B2F' }}>where you stand.</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '15px',
          color: '#8A7A6A',
          lineHeight: 1.7,
          marginBottom: '36px',
        }}>
          ML-powered mastery tracking shows which chapters need work,
          predicts your score, and tells you exactly what to study next.
        </motion.p>

        {/* Chapter mastery bars */}
        <motion.div variants={fadeUp} custom={3} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {radars.map((r, i) => (
            <motion.div key={r.label} variants={fadeUp} custom={i + 4} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#8A7A6A',
                letterSpacing: '0.1em',
                width: '100px',
                textAlign: 'right',
                flexShrink: 0,
              }}>{r.label}</div>
              <div style={{
                flex: 1,
                height: '3px',
                background: 'rgba(201,123,47,0.12)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.pct}%` }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, #8B4A0F, ${r.pct > 70 ? '#E8A44A' : r.pct > 50 ? '#C97B2F' : '#7A4020'})`,
                    borderRadius: '2px',
                  }}
                />
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: r.pct > 70 ? '#E8A44A' : r.pct > 50 ? '#C97B2F' : '#7A4020',
                width: '30px',
                flexShrink: 0,
              }}>{r.pct}%</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Section 6: FINAL CTA ─────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <Section index={6}>
      <div style={{ textAlign: 'center', maxWidth: '700px' }}>
        <motion.div variants={fadeUp} custom={0} style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(14px, 2vw, 18px)',
          fontWeight: 300,
          color: '#8A7A6A',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          The lab is open
        </motion.div>
        <motion.h2 variants={fadeUp} custom={1} style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(56px, 10vw, 120px)',
          fontWeight: 400,
          color: '#F2EBE0',
          lineHeight: 0.95,
          margin: '0 0 60px',
          letterSpacing: '-0.02em',
        }}>
          Start
          <br />
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #E8A44A 0%, #C97B2F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Learning.</span>
        </motion.h2>

        <motion.div variants={fadeUp} custom={2} style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '48px',
        }}>
          <CTAButton to="/auth" filled>
            Begin Free →
          </CTAButton>
          <CTAButton to="/auth">
            Explore Chapters
          </CTAButton>
        </motion.div>

        {/* Floating feature pills */}
        <motion.div variants={fadeUp} custom={3} style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
        }}>
          {[
            '✦ LaTeX rendered questions',
            '✦ JEE Main + Advanced',
            '✦ Chapter-wise filters',
            '✦ Difficulty levels',
            '✦ Spaced repetition',
          ].map((pill) => (
            <div key={pill} style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'rgba(138,122,106,0.7)',
              padding: '6px 14px',
              border: '1px solid rgba(201,123,47,0.12)',
              borderRadius: '100px',
              background: 'rgba(26,22,18,0.5)',
              backdropFilter: 'blur(8px)',
            }}>
              {pill}
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div variants={fadeIn} custom={5} style={{
          position: 'absolute',
          bottom: '32px',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: 'rgba(138,122,106,0.4)',
          }}>© 2025 PHYSICS.LAB</span>
          <span style={{ color: 'rgba(201,123,47,0.2)', fontSize: '10px' }}>·</span>
          <Link
            to="/auth"
            style={{
              pointerEvents: 'all',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: 'rgba(201,123,47,0.5)',
              textDecoration: 'none',
            }}
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Scroll Progress Bar (left edge) ─────────────────────────────────────────
function ProgressBar() {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '2px',
      height: '100vh',
      background: 'rgba(201,123,47,0.1)',
      zIndex: 100,
      pointerEvents: 'none',
    }}>
      <motion.div
        style={{
          width: '100%',
          background: 'linear-gradient(to bottom, #C97B2F, #E8A44A)',
          originY: 0,
        }}
        animate={{ height: '100%' }}
      />
    </div>
  );
}

// ─── Right-edge dot navigation ───────────────────────────────────────────────
function DotNav() {
  const sections = ['Hero', 'Problem', 'Chapters', 'Modes', 'PYQs', 'Analytics', 'Begin'];
  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 100,
      pointerEvents: 'none',
    }}>
      {sections.map((s, i) => (
        <div
          key={s}
          title={s}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            border: '1px solid rgba(201,123,47,0.4)',
            background: i === 0 ? '#C97B2F' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────
export default function Overlay() {
  return (
    <Scroll html>
      <div style={{ width: '100vw', pointerEvents: 'none' }}>
        <HeroSection />
        <ProblemSection />
        <ChaptersSection />
        <ModesSection />
        <PYQSection />
        <AnalyticsSection />
        <FinalCTASection />

        {/* Always-visible chrome */}
        <ProgressBar />
        <DotNav />
      </div>
    </Scroll>
  );
}
