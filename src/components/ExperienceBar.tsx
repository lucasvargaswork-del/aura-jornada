import { CharacterStats } from '@/lib/types';

interface ExperienceBarProps {
  character: CharacterStats;
  showDetails?: boolean;
}

export default function ExperienceBar({ character, showDetails = true }: ExperienceBarProps) {
  const progressPercentage = (character.experience / character.experienceToNextLevel) * 100;

  return (
    <div className="space-y-2">
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            XP: {character.experience} / {character.experienceToNextLevel}
          </span>
          <span className="text-[#4AFF8B] font-bold">
            Próximo nível: {character.level + 1}
          </span>
        </div>
      )}

      <div className="relative h-6 bg-gray-900 rounded-full overflow-hidden border-2 border-gray-800">
        {/* Barra de progresso */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4AFF8B] via-[#3A8BFF] to-[#8B5CF6] 
                     transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Brilho animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Texto centralizado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg z-10">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Brilho superior */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
