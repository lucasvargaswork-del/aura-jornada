'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Zap, Star } from 'lucide-react';

interface GoalCompletionAnimationProps {
  show: boolean;
  xpGained: number;
  attributeGains?: string[];
}

export default function GoalCompletionAnimation({
  show,
  xpGained,
  attributeGains = [],
}: GoalCompletionAnimationProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (show) {
      // Gerar partículas aleatórias
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }));
      setParticles(newParticles);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Partículas explosivas */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle-explosion"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${particle.x}px, ${particle.y}px)`,
          }}
        >
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
        </div>
      ))}

      {/* XP Ganho */}
      <div className="text-center space-y-4 animate-bounce-in">
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-12 h-12 text-yellow-400 animate-pulse" fill="currentColor" />
          <div>
            <p className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              +{xpGained} XP
            </p>
            {attributeGains.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {attributeGains.map((gain, index) => (
                  <span
                    key={index}
                    className="text-sm font-bold text-white bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] px-3 py-1 rounded-full"
                  >
                    {gain}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Sparkles className="w-12 h-12 text-[#4AFF8B] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
