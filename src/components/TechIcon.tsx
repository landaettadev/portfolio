import React, { useState } from 'react';

/** Devicon logo with a monogram fallback when no icon exists or it fails to load. */
const TechIcon: React.FC<{ name: string; icon?: string; size?: number }> = ({ name, icon, size = 20 }) => {
  const [failed, setFailed] = useState(false);
  if (!icon || failed) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center rounded-md bg-gradient-to-br from-glow/25 to-volt/25 font-mono text-[10px] font-medium text-white"
        style={{ width: size, height: size }}
      >
        {name.replace(/[^A-Za-z]/g, '').slice(0, 2)}
      </span>
    );
  }
  return (
    <img
      src={icon}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0"
      style={{ width: size, height: size }}
    />
  );
};

export default TechIcon;
