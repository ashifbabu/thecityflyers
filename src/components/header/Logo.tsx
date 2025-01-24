'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 150, height = 50, className }) => {
  const { resolvedTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  // Ensure hydration to avoid SSR/CSR mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Avoid rendering theme-based logic during SSR
  if (!hydrated) {
    return (
      <div style={{ width, height }} className={`relative ${className}`}>
        <Image
          src="/logo-black.svg"
          alt="Logo"
          priority
          fill
          style={{ objectFit: 'contain' }}
          className="opacity-100" // Default to light theme logo during SSR
        />
      </div>
    );
  }

  return (
    <div style={{ width, height }} className={`relative ${className}`}>
      <Image
        src="/logo-black.svg"
        alt="Logo"
        priority
        fill
        style={{ objectFit: 'contain' }}
        className={`transition duration-300 ${
          resolvedTheme === 'dark' ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <Image
        src="/logo-white.svg"
        alt="Logo"
        priority
        fill
        style={{ objectFit: 'contain' }}
        className={`transition duration-300 ${
          resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default Logo;
