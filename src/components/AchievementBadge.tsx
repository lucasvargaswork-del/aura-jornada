'use client';

import { Trophy, Flame, Star, Crown, Zap } from 'lucide-react';

interface AchievementBadgeProps {
  streak: number;
}

const ACHIEVEMENTS = [
  { threshold: 1, title: 'Centelha Inicial', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { threshold: 3, title: 'Chama Crescente', icon: Flame, color: 'from-orange-400 to-red-500' },
  { threshold: 7, title: 'Aura Desperta', icon: Star, color: 'from-blue-400 to-purple-500' },
  { threshold: 14, title: 'Guardião Dedicado', icon: Trophy, color: 'from-purple-400 to-pink-500' },
  { threshold: 30, title: 'Guardião Interior', icon: Crown, color: 'from-yellow-300 to-amber-500' },
];

export default function AchievementBadge({ streak }: AchievementBadgeProps) {
  const currentAchievement = [...ACHIEVEMENTS]
    .reverse()
    .find(achievement => streak >= achievement.threshold);

  if (!currentAchievement) return null;

  const Icon = currentAchievement.icon;
  const nextAchievement = ACHIEVEMENTS.find(a => a.threshold > streak);

  return (
    <div className="space-y-4">
      {/* Current Achievement */}
      <div className={`relative bg-gradient-to-r ${currentAchievement.color} p-6 rounded-2xl shadow-2xl overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/80 font-medium">Conquista Atual</p>
            <h3 className="text-2xl font-bold text-white">{currentAchievement.title}</h3>
            <p className="text-sm text-white/90 mt-1">{streak} dias de streak</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Next Achievement */}
      {nextAchievement && (
        <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <nextAchievement.icon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Próxima Conquista</p>
              <p className="text-sm font-medium text-gray-300">{nextAchievement.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Faltam</p>
              <p className="text-lg font-bold text-[#4AFF8B]">{nextAchievement.threshold - streak}</p>
              <p className="text-xs text-gray-500">dias</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] transition-all duration-500"
              style={{ width: `${(streak / nextAchievement.threshold) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
