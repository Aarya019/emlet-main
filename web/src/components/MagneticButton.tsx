'use client';

import { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export default function MagneticButton({ 
  children, 
  className = '', 
  variant = 'primary',
  onClick 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Limit the magnetic effect to 20px in each direction
    const limitedX = Math.max(-20, Math.min(20, x * 0.3));
    const limitedY = Math.max(-20, Math.min(20, y * 0.3));
    
    setPosition({ x: limitedX, y: limitedY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseClasses = variant === 'primary'
    ? 'rounded-full bg-white px-5 sm:px-6 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:scale-105 active:scale-100'
    : 'rounded-full border border-white/20 px-5 py-2 text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff] hover:shadow-lg hover:shadow-[#00ffff]/30';

  return (
    <button
      ref={buttonRef}
      className={`${baseClasses} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.3s ease-out' : 'transform 0.1s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
