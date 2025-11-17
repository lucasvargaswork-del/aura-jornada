'use client';

import { CHARACTER_CLASSES, getUnlockedAbilities } from '@/lib/character';
import { CharacterClass } from '@/lib/types';
import { Lock, Sparkles } from 'lucide-react';

interface ClassAbilitiesProps {
  characterClass: CharacterClass;
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ClassAbilities({ characterClass, level, size = 'md' }: ClassAbilitiesProps) {
  const classInfo = CHARACTER_CLASSES[characterClass];
  const unlockedAbilities = getUnlockedAbilities(characterClass, level);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="space-y-3">
      <h3 className={`font-bold text-white flex items-center gap-2 ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base'}`}>
        <Sparkles className={`${size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} text-[#4AFF8B]`} />
        Habilidades de Classe
      </h3>

      <div className="grid gap-3">
        {classInfo.abilities.map((ability) => {
          const isUnlocked = level >= ability.level;

          return (
            <div
              key={ability.level}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                isUnlocked
                  ? `bg-gradient-to-r ${classInfo.gradient} border-white/20 shadow-lg`
                  : 'bg-gray-900/50 border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`${iconSizes[size]} flex-shrink-0`}>
                  {isUnlocked ? ability.icon : <Lock className="w-6 h-6 text-gray-500" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'} ${sizeClasses[size]}`}>
                      {ability.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isUnlocked 
                        ? 'bg-[#4AFF8B]/20 text-[#4AFF8B]' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      Nv. {ability.level}
                    </span>
                  </div>
                  
                  <p className={`${isUnlocked ? 'text-white/90' : 'text-gray-500'} ${sizeClasses[size]}`}>
                    {ability.description}
                  </p>
                  
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500 mt-1">
                      Desbloqueada no nível {ability.level}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
