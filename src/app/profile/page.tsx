'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Flame, Target, Waves, Trophy, TrendingUp, Calendar, AlertTriangle, Sparkles, Zap, Settings } from 'lucide-react';
import { getStoredData, resetJourney } from '@/lib/storage';
import { CHARACTER_CLASSES } from '@/lib/character';
import { UserData } from '@/lib/types';
import CharacterAvatar from '@/components/CharacterAvatar';
import ExperienceBar from '@/components/ExperienceBar';
import AchievementCard from '@/components/AchievementCard';
import AttributesRadarChart from '@/components/AttributesRadarChart';
import ClassAbilities from '@/components/ClassAbilities';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const data = getStoredData();
    if (!data || !data.onboardingCompleted) {
      router.push('/onboarding/welcome');
      return;
    }
    
    // Garantir que character existe com valores padrão
    if (!data.character || !data.character.class) {
      const defaultClass = 'mage';
      data.character = {
        class: defaultClass,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
        power: 10,
        attributes: CHARACTER_CLASSES[defaultClass].baseAttributes,
        achievements: [],
      };
    }

    // Garantir que attributes existe
    if (!data.character.attributes) {
      const classInfo = CHARACTER_CLASSES[data.character.class] || CHARACTER_CLASSES.mage;
      data.character.attributes = classInfo.baseAttributes;
    }
    
    setUserData(data);
  }, [router]);

  const handleResetJourney = () => {
    resetJourney();
    router.push('/onboarding/welcome');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4AFF8B] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const pathIcons = {
    disciplina: Flame,
    foco: Target,
    serenidade: Waves,
  };

  const pathColors = {
    disciplina: 'from-orange-500 to-red-500',
    foco: 'from-blue-500 to-cyan-500',
    serenidade: 'from-purple-500 to-pink-500',
  };

  const PathIcon = pathIcons[userData.path];
  const pathGradient = pathColors[userData.path];
  
  // Garantir que sempre temos uma classe válida
  const characterClass = userData.character?.class || 'mage';
  const classInfo = CHARACTER_CLASSES[characterClass];

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/10 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-[#0A0A0F]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-white">Perfil</h1>

          <button
            onClick={() => router.push('/settings')}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-all hover:scale-110"
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5 text-gray-400 hover:text-[#4AFF8B] transition-colors" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Profile header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CharacterAvatar
              characterClass={characterClass}
              level={userData.character?.level || 1}
              size="lg"
              showLevel={true}
              animated={true}
            />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{userData.name}</h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${pathGradient} rounded-full`}>
                <PathIcon className="w-5 h-5 text-white" />
                <span className="capitalize text-white font-medium">Caminho da {userData.path}</span>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${classInfo.gradient} rounded-full`}>
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{classInfo.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Bar */}
        <div className="max-w-2xl mx-auto">
          <ExperienceBar 
            character={userData.character} 
            showDetails={true} 
          />
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-3 hover:border-[#4AFF8B]/50 transition-all hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#4AFF8B]/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#4AFF8B]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Nível de Aura</p>
                <p className="text-3xl font-bold text-white">{userData.auraLevel}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] transition-all duration-500"
                style={{ width: `${userData.auraLevel}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-3 hover:border-[#3A8BFF]/50 transition-all hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#3A8BFF]/10 rounded-lg">
                <Calendar className="w-6 h-6 text-[#3A8BFF]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Streak Atual</p>
                <p className="text-3xl font-bold text-white">{userData.streak} dias</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Continue assim para manter sua sequência!</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-3 hover:border-[#8B5CF6]/50 transition-all hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#8B5CF6]/10 rounded-lg">
                <Trophy className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Metas Concluídas</p>
                <p className="text-3xl font-bold text-white">{userData.totalGoalsCompleted}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Total de metas completadas até agora</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-3 hover:border-yellow-500/50 transition-all hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Poder</p>
                <p className="text-3xl font-bold text-white">{userData.character?.power || 10}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Seu poder aumenta a cada nível</p>
          </div>
        </div>

        {/* Attributes Radar Chart */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#4AFF8B]" />
            Atributos do Personagem
          </h3>
          <AttributesRadarChart 
            attributes={userData.character.attributes} 
            size="lg"
            showLegend={true}
          />
        </div>

        {/* Class Abilities */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <ClassAbilities 
            characterClass={characterClass}
            level={userData.character?.level || 1}
            size="md"
          />
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Conquistas Desbloqueadas ({userData.character?.achievements?.length || 0})
          </h3>

          {(!userData.character?.achievements || userData.character.achievements.length === 0) ? (
            <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-2xl">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma conquista desbloqueada ainda.</p>
              <p className="text-gray-500 text-sm mt-2">Complete metas para desbloquear conquistas!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {(userData.character?.achievements || []).map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} size="md" />
              ))}
            </div>
          )}
        </div>

        {/* Reset journey */}
        <div className="bg-red-500/5 border-2 border-red-500/20 rounded-xl p-5 sm:p-6 space-y-4 hover:border-red-500/30 transition-all">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Reiniciar Jornada</h3>
              <p className="text-sm text-gray-400 mb-4">
                Isso irá apagar todos os seus dados e progresso. Esta ação não pode ser desfeita.
              </p>

              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 
                             rounded-lg text-red-400 font-medium transition-all hover:scale-105"
                >
                  Reiniciar Jornada
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-400 font-medium">Tem certeza absoluta?</p>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={handleResetJourney}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-all hover:scale-105"
                    >
                      Sim, reiniciar
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-all hover:scale-105"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
