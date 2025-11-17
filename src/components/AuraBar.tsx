'use client';

import { Progress } from '@/components/ui/progress';

interface AuraBarProps {
  level: number;
  showLabel?: boolean;
}

export default function AuraBar({ level, showLabel = true }: AuraBarProps) {
  return (
    <div className="w-full space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">Nível de Aura Interior</span>
          <span className="text-sm font-bold text-[#4AFF8B]">{level}%</span>
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={level} 
          className="h-3 bg-gray-800/50 border border-gray-700/50"
        />
        
        {/* Glow effect */}
        <div
          className="absolute inset-0 h-3 rounded-full pointer-events-none transition-all duration-500"
          style={{
            background: `linear-gradient(to right, 
              rgba(74, 255, 139, 0.3) 0%, 
              rgba(58, 139, 255, 0.3) ${level}%, 
              transparent ${level}%)`,
            filter: 'blur(8px)',
          }}
        />
      </div>
    </div>
  );
}
