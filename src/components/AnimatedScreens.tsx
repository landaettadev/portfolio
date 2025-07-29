import React, { useEffect, useState } from 'react';

interface ScreenCoords {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ScreenCoordsPct {
  left: string;
  top: string;
  width: string;
  height: string;
}

const BASE_W = 620;
const BASE_H = 400;

const toPercent = (value: number, base: number): string => `${(value / base) * 100}%`;

// Desktop screen coordinates
const screensDesktop: ScreenCoords[] = [
  { left: 130, top: 70, width: 62,  height: 62  },
  { left: 220, top: 20, width: 50, height: 40 },
  { left: 432, top: 70, width: 59,  height: 65  },
];

// Convert to percentages
const screensDesktopPct: ScreenCoordsPct[] = screensDesktop.map(s => ({
  left:   toPercent(s.left, BASE_W),
  top:    toPercent(s.top, BASE_H),
  width:  toPercent(s.width, BASE_W),
  height: toPercent(s.height, BASE_H),
}));

// Mobile screen coordinates
const screensMobile: ScreenCoords[] = [
  { left: 50, top: 40, width: 80, height: 80 },
  { left: 150, top: 20, width: 70, height: 60 },
  { left: 250, top: 40, width: 80, height: 90 },
];

// Convert to percentages
const screensMobilePct: ScreenCoordsPct[] = screensMobile.map(s => ({
  left: toPercent(s.left, BASE_W),
  top: toPercent(s.top, BASE_H),
  width: toPercent(s.width, BASE_W),
  height: toPercent(s.height, BASE_H),
}));

// Code samples
const codeSamples: string[][] = [
  [ 'const user = {', '  name: "Brandon",', '  role: "Dev"', '};', 'console.log(user);' ],
  [ 'function sum(a, b) {', '  return a + b;', '}', 'sum(2, 3);' ],
  [ 'useEffect(() => {', '  fetchData();', '}, []);', '// ...' ],
];

interface ScreenOverlayProps {
  coords: ScreenCoordsPct;
  code: string[];
  lineIndex: number;
}

interface AnimatedScreensProps {
  isMobile: boolean;
}

const ScreenOverlay: React.FC<ScreenOverlayProps> = ({ coords, code, lineIndex }) => (
  <div
    style={{
      position: 'absolute',
      left: coords.left,
      top: coords.top,
      width: coords.width,
      height: coords.height,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0.5rem',
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#aefeff',
      lineHeight: 1.4,
      pointerEvents: 'none',
      userSelect: 'none',
    }}
  >
    {code.map((line: string, j: number) => (
      <div
        key={j}
        style={{
          opacity: j === lineIndex ? 1 : 0.5,
          transform: j === lineIndex ? 'translateX(0)' : 'translateX(10px)',
          transition: 'opacity 0.2s, transform 0.2s', // Faster transition
          fontWeight: j === lineIndex ? 'bold' : 'normal',
          textShadow: '0 0 8px #00f2ff, 0 0 2px #fff',
        }}
      >
        {line}
      </div>
    ))}
  </div>
);

const AnimatedScreens: React.FC<AnimatedScreensProps> = ({ isMobile }) => {
  const [lineIndexes, setLineIndexes] = useState([0, 0, 0]);

  // Cycle code lines with different timing for mobile and desktop
  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndexes(prev =>
        prev.map((idx, i) => (idx + 1) % codeSamples[i].length)
      );
    }, isMobile ? 1200 : 1200); // Igual timing para ambos, pero solo uno se usará
    return () => clearInterval(interval);
  }, [isMobile]);

  if (isMobile) {
    // Mostrar solo un bloque animado simple y centrado
    const mobileIndex = lineIndexes[0];
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <div className="bg-slate-900/80 rounded-xl p-4 shadow-lg w-full max-w-xs mx-auto">
          {codeSamples[0].map((line, j) => (
            <div
              key={j}
              style={{
                opacity: j === mobileIndex ? 1 : 0.5,
                transform: j === mobileIndex ? 'translateX(0)' : 'translateX(10px)',
                transition: 'opacity 0.3s, transform 0.3s',
                fontWeight: j === mobileIndex ? 'bold' : 'normal',
                color: '#aefeff',
                fontFamily: 'monospace',
                fontSize: '15px',
                textShadow: '0 0 8px #00f2ff, 0 0 2px #fff',
                textAlign: 'left',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: overlays flotantes
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {(isMobile ? screensMobilePct : screensDesktopPct).map((coords, i) => (
        <ScreenOverlay
          key={i}
          coords={coords}
          code={codeSamples[i]}
          lineIndex={lineIndexes[i]}
        />
      ))}
    </div>
  );
};

export default AnimatedScreens;