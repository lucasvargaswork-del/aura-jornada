import { Achievement } from '@/lib/types';
import { getRarityColor, getRarityGlow } from '@/lib/character';

interface AchievementCardProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export default function AchievementCard({ achievement, size = 'md' }: AchievementCardProps) {
  const rarityColor = getRarityColor(achievement.rarity);
  const rarityGlow = getRarityGlow(achievement.rarity);

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const iconSizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  const rarityLabels = {
    comum: 'Comum',
    raro: 'Raro',
    epico: 'Épico',
    lendario: 'Lendário',
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-gray-900 to-gray-800 
                 rounded-xl border-2 hover:scale-105 transition-all duration-300
                 ${rarityGlow} relative overflow-hidden group`}
      style={{
        borderImage: `linear-gradient(135deg, ${rarityColor}) 1`,
      }}
    >
      {/* Brilho de fundo */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${rarityColor} opacity-10 
                   group-hover:opacity-20 transition-opacity`}
      />

      {/* Conteúdo */}
      <div className="relative z-10 space-y-2">
        {/* Ícone */}
        <div className="flex items-center justify-between">
          <span className={`${iconSizes[size]} drop-shadow-lg`}>{achievement.icon}</span>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${rarityColor} 
                       text-white uppercase tracking-wider`}
          >
            {rarityLabels[achievement.rarity]}
          </span>
        </div>

        {/* Título */}
        <h4 className="font-bold text-white text-lg">{achievement.title}</h4>

        {/* Descrição */}
        <p className="text-sm text-gray-400">{achievement.description}</p>

        {/* Data de desbloqueio */}
        <p className="text-xs text-gray-500">
          Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Efeito de brilho no hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${rarityColor}20 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
