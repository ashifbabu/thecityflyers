import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 150, height = 50, className }) => {
    const { resolvedTheme } = useTheme();

    return (
        <div style={{ width, height }} className={`relative ${className}`}>
            <Image
                src="/logo-black.svg"
                alt="Logo"
                priority
                fill // Use fill instead of layout="fill"
                style={{ objectFit: 'contain' }} // Use style prop for objectFit
                className={`transition duration-300 ${resolvedTheme === 'dark' ? 'opacity-0' : 'opacity-100'}`}
            />
            <Image
                src="/logo-white.svg"
                alt="Logo"
                priority
                fill // Use fill instead of layout="fill"
                style={{ objectFit: 'contain' }} // Use style prop for objectFit
                className={`transition duration-300 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

export default Logo;