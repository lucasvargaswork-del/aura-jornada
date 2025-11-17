'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AuraOrbProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export default function AuraOrb({ level, size = 'md', pulse = false }: AuraOrbProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (pulse) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [pulse]);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  const glowIntensity = Math.max(0.3, level / 100);
  const glowSize = 20 + (level / 100) * 50;

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow externo animado */}
      <div
        className={`absolute ${sizeClasses[size]} rounded-full transition-all duration-700 ease-out animate-pulse ${
          isPulsing ? 'scale-150' : 'scale-100'
        }`}
        style={{
          background: `radial-gradient(circle, rgba(74, 255, 139, ${glowIntensity}) 0%, rgba(58, 139, 255, ${
            glowIntensity * 0.5
          }) 50%, transparent 70%)`,
          filter: `blur(${glowSize}px)`,
        }}
      />

      {/* Orbe principal com gradiente melhorado */}
      <div
        className={`relative ${sizeClasses[size]} rounded-full transition-all duration-700 ease-out ${
          isPulsing ? 'scale-110' : 'scale-100'
        }`}
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(74, 255, 139, ${0.9 + glowIntensity * 0.1}), rgba(58, 139, 255, ${
            0.7 + glowIntensity * 0.3
          }))`,
          boxShadow: `0 0 ${glowSize * 2}px rgba(74, 255, 139, ${glowIntensity}), 
                      0 0 ${glowSize * 3}px rgba(58, 139, 255, ${glowIntensity * 0.5}),
                      inset 0 0 ${glowSize}px rgba(255, 255, 255, 0.4)`,
        }}
      >
        {/* Brilho interno melhorado */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute top-[15%] left-[20%] w-[45%] h-[45%] rounded-full bg-white/40 blur-2xl animate-pulse"
            style={{
              opacity: 0.5 + glowIntensity * 0.3,
            }}
          />
        </div>

        {/* Ícone central com animação */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'} text-white/95 animate-pulse`}
            style={{
              filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9))',
            }}
          />
        </div>
      </div>

      {/* Partículas flutuantes melhoradas */}
      {level > 30 && (
        <>
          <div
            className="absolute w-3 h-3 bg-[#4AFF8B] rounded-full animate-float-1"
            style={{
              top: '10%',
              left: '20%',
              boxShadow: '0 0 15px #4AFF8B',
            }}
          />
          <div
            className="absolute w-2 h-2 bg-[#3A8BFF] rounded-full animate-float-2"
            style={{
              top: '20%',
              right: '15%',
              boxShadow: '0 0 12px #3A8BFF',
            }}
          />
        </>
      )}
      
      {level > 70 && (
        <>
          <div
            className="absolute w-2 h-2 bg-[#4AFF8B] rounded-full animate-float-1"
            style={{
              bottom: '15%',
              right: '25%',
              boxShadow: '0 0 10px #4AFF8B',
              animationDelay: '1s',
            }}
          />
          <div
            className="absolute w-3 h-3 bg-[#3A8BFF] rounded-full animate-float-2"
            style={{
              bottom: '20%',
              left: '30%',
              boxShadow: '0 0 15px #3A8BFF',
              animationDelay: '0.5s',
            }}
          />
        </>
      )}
    </div>
  );
}
