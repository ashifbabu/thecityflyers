// Logo.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ width, height, className }) => {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Or a placeholder if you prefer
    }

    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    const src = currentTheme === 'dark' ? '/logo-white.svg' : '/logo-black.svg';

    return (
        <Image
            src={src}
            width={width || 150}
            height={height || 50}
            alt="Logo"
            priority
            className={className}
        />
    );
};

export default Logo;