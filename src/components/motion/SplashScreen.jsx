import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BrandMark } from '../brand/BrandMark';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * SplashScreen — Branded startup transition.
 *
 * Shows the 5AMPERE mark, a status message, and a progress bar.
 * Duration ~1.5s. Exits gracefully with a fade+slide animation.
 * Never shown on route changes — only on initial app load.
 */
export function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleExitComplete = () => {
    onComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-bg)' }}
          initial={{ opacity: 1 }}
          exit={prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.98 }
          }
          transition={{ duration: prefersReduced ? 0.1 : 0.4, ease: 'easeInOut' }}
        >
          {/* Splash background — more visible energy flow */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1440 900"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <radialGradient id="splash-glow" cx="50%" cy="50%" r="40%">
                  <stop offset="0%" stopColor="var(--energy-glow-color)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect width="1440" height="900" fill="url(#splash-glow)" opacity="0.5" />
              <g
                stroke="var(--energy-line-color)"
                fill="none"
                strokeWidth="1"
                opacity="0.5"
              >
                <path
                  d="M -100 450 C 300 300, 600 500, 900 350 S 1300 250, 1540 400"
                  strokeDasharray="16 24"
                  strokeWidth="1.5"
                  style={{
                    animation: prefersReduced ? 'none' : 'energy-drift 10s linear infinite',
                  }}
                />
                <path
                  d="M -50 500 C 350 600, 700 400, 1000 550 S 1400 650, 1540 500"
                  strokeDasharray="12 20"
                  strokeWidth="1.5"
                  style={{
                    animation: prefersReduced ? 'none' : 'energy-drift-reverse 12s linear infinite',
                  }}
                />
              </g>

              {/* Streaming splash energy particles */}
              {!prefersReduced && (
                <g>
                  <g>
                    <circle r="4.5" fill="var(--color-accent)" opacity="1">
                      <animateMotion dur="5s" repeatCount="indefinite" path="M -100 450 C 300 300, 600 500, 900 350 S 1300 250, 1540 400" />
                    </circle>
                    <circle r="2" fill="#FFFFFF" opacity="0.95">
                      <animateMotion dur="5s" repeatCount="indefinite" path="M -100 450 C 300 300, 600 500, 900 350 S 1300 250, 1540 400" />
                    </circle>
                  </g>
                  <g>
                    <circle r="3.5" fill="var(--color-accent)" opacity="0.85">
                      <animateMotion dur="5s" repeatCount="indefinite" path="M -100 450 C 300 300, 600 500, 900 350 S 1300 250, 1540 400" begin="2.5s" />
                    </circle>
                  </g>
                  <g>
                    <circle r="4" fill="var(--color-accent)" opacity="1">
                      <animateMotion dur="6s" repeatCount="indefinite" path="M -50 500 C 350 600, 700 400, 1000 550 S 1400 650, 1540 500" begin="1s" />
                    </circle>
                    <circle r="1.8" fill="#FFFFFF" opacity="0.95">
                      <animateMotion dur="6s" repeatCount="indefinite" path="M -50 500 C 350 600, 700 400, 1000 550 S 1400 650, 1540 500" begin="1s" />
                    </circle>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Animated brand mark */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <BrandMark size={56} />
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight"
              style={{ color: 'var(--color-text)' }}
              initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            >
              <span style={{ color: 'var(--color-accent)' }}>5</span>AMPERE
            </motion.h1>

            {/* Status text */}
            <motion.p
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Preparing your energy workspace
            </motion.p>

            {/* Progress bar */}
            <div
              className="w-48 h-0.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--color-border)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  animation: prefersReduced
                    ? 'none'
                    : 'splash-progress 1.3s ease-in-out forwards',
                  width: prefersReduced ? '100%' : undefined,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

