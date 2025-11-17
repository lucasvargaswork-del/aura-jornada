'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, Target, TrendingUp, Zap, Award, Sparkles } from 'lucide-react';
import { getStoredData, saveData, getTodayGoals, calculateAuraLevel, updateStreak, getDailyMessage } from '@/lib/storage';
import { addExperience, checkAchievements, addAttributePoints, CHARACTER_CLASSES } from '@/lib/character';
import { UserData, Goal } from '@/lib/types';
import CharacterAvatar from '@/components/CharacterAvatar';
import ExperienceBar from '@/components/ExperienceBar';
import AttributesRadarChart from '@/components/AttributesRadarChart';
import GoalCompletionAnimation from '@/components/GoalCompletionAnimation';
import { Checkbox } from '@/components/ui/checkbox';

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [todayGoals, setTodayGoals] = useState<Goal[]>([]);
  const [pulseOrb, setPulseOrb] = useState(false);
  const [dailyMessage] = useState(getDailyMessage());
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [showGoalAnimation, setShowGoalAnimation] = useState(false);
  const [lastXpGained, setLastXpGained] = useState(0);
  const [lastAttributeGains, setLastAttributeGains] = useState<string[]>([]);

  useEffect(() => {
    const data = getStoredData();
    if (!data || !data.onboardingCompleted) {
      router.push('/onboarding/welcome');
      return;
    }
    
    // Validação: garantir que character existe com valores padrão
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
    setTodayGoals(getTodayGoals(data.goals));
  }, [router]);

  const handleToggleGoal = (goalId: string) => {
    if (!userData) return;

    const goal = userData.goals.find(g => g.id === goalId);
    if (!goal) return;

    const wasCompleted = goal.completed;
    const updatedGoals = userData.goals.map((g) =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );

    const todayGoalsList = getTodayGoals(updatedGoals);
    const completedToday = todayGoalsList.filter((g) => g.completed).length;
    const auraLevel = calculateAuraLevel(completedToday, todayGoalsList.length);

    // Adicionar XP e atributos quando completar meta (não quando desmarcar)
    let updatedCharacter = userData.character;
    const previousLevel = updatedCharacter.level;
    
    if (!wasCompleted) {
      // Ganhar 50 XP por meta completada
      updatedCharacter = addExperience(updatedCharacter, 50);
      
      // Adicionar pontos de atributo baseado na categoria
      const newAttributes = addAttributePoints(updatedCharacter.attributes, goal.category, 2);
      updatedCharacter.attributes = newAttributes;

      // Mostrar ganhos de atributos
      const gains: string[] = [];
      Object.entries(newAttributes).forEach(([key, value]) => {
        const oldValue = userData.character.attributes[key as keyof typeof userData.character.attributes];
        if (value > oldValue) {
          gains.push(`${key} +${value - oldValue}`);
        }
      });
      
      // Mostrar animação de conclusão
      setLastXpGained(50);
      setLastAttributeGains(gains);
      setShowGoalAnimation(true);
      setTimeout(() => setShowGoalAnimation(false), 2000);
      
      // Verificar se subiu de nível
      if (updatedCharacter.level > previousLevel) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
    }

    let updatedData = {
      ...userData,
      goals: updatedGoals,
      character: updatedCharacter,
      auraLevel,
      totalGoalsCompleted: userData.totalGoalsCompleted + (!wasCompleted ? 1 : -1),
    };

    // Verificar novas conquistas
    const achievements = checkAchievements(
      updatedData.character,
      updatedData.totalGoalsCompleted,
      updatedData.streak
    );

    if (achievements.length > 0) {
      updatedData.character.achievements = [
        ...updatedData.character.achievements,
        ...achievements,
      ];
      setNewAchievements(achievements.map(a => a.title));
      setTimeout(() => setNewAchievements([]), 5000);
    }

    // Update streak if all goals completed
    if (completedToday === todayGoalsList.length && todayGoalsList.length > 0) {
      updatedData = updateStreak(updatedData);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }

    setUserData(updatedData);
    setTodayGoals(todayGoalsList);
    saveData(updatedData);

    // Trigger orb pulse
    setPulseOrb(true);
    setTimeout(() => setPulseOrb(false), 100);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4AFF8B] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Carregando sua jornada...</p>
        </div>
      </div>
    );
  }

  const completedToday = todayGoals.filter((g) => g.completed).length;
  
  // Validação: garantir que sempre temos uma classe válida
  const characterClass = userData.character?.class || 'mage';

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden particles-bg">
      {/* Goal Completion Animation */}
      <GoalCompletionAnimation
        show={showGoalAnimation}
        xpGained={lastXpGained}
        attributeGains={lastAttributeGains}
      />

      {/* Level Up overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4 animate-bounce-in">
            <div className="text-8xl animate-float">⚡</div>
            <p className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient">
              LEVEL UP!
            </p>
            <p className="text-3xl text-white font-bold">Nível {userData.character.level}</p>
            <p className="text-xl text-gray-300">Poder: {userData.character.power}</p>
          </div>
        </div>
      )}

      {/* New Achievement overlay */}
      {newAchievements.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 animate-slide-in-right">
          {newAchievements.map((title, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-4 rounded-xl 
                         shadow-2xl border-2 border-white flex items-center gap-3 animate-glow-pulse"
            >
              <Sparkles className="w-6 h-6 text-white animate-spin" />
              <div>
                <p className="text-white font-bold">Nova Conquista!</p>
                <p className="text-white/90 text-sm">{title}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4 animate-bounce-in">
            <div className="text-6xl animate-float">🎉</div>
            <p className="text-3xl font-bold text-[#4AFF8B] drop-shadow-lg">
              Todas as metas concluídas!
            </p>
            <p className="text-xl text-white">Sua Aura brilha intensamente!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-[#0A0A0F]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#4AFF8B] via-[#3A8BFF] to-[#8B5CF6] bg-clip-text text-transparent animate-gradient">
            Leveling King
          </h1>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.push('/goals')}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-all hover:scale-110 button-shine"
              aria-label="Metas"
            >
              <Target className="w-5 h-5 text-gray-400 hover:text-[#4AFF8B] transition-colors" />
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-all hover:scale-110 button-shine"
              aria-label="Perfil"
            >
              <User className="w-5 h-5 text-gray-400 hover:text-[#3A8BFF] transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Greeting */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Olá, <span className="bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] bg-clip-text text-transparent animate-gradient">{userData.name}</span>
          </h2>
          <p className="text-gray-400 italic text-base sm:text-lg">{dailyMessage}</p>
        </div>

        {/* Character Avatar */}
        <div className="flex justify-center">
          <CharacterAvatar
            characterClass={characterClass}
            level={userData.character?.level || 1}
            size="xl"
            showLevel={true}
            animated={true}
          />
        </div>

        {/* Experience Bar */}
        <div className="max-w-2xl mx-auto">
          <ExperienceBar character={userData.character} showDetails={true} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-5 text-center card-hover hover:border-[#4AFF8B]/50">
            <div className="flex justify-center mb-2">
              <Award className="w-6 h-6 text-[#4AFF8B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#4AFF8B]">{userData.streak}</div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1">Dias seguidos</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-5 text-center card-hover hover:border-[#3A8BFF]/50">
            <div className="flex justify-center mb-2">
              <Target className="w-6 h-6 text-[#3A8BFF]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#3A8BFF]">{completedToday}/{todayGoals.length}</div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1">Hoje</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-5 text-center card-hover hover:border-[#8B5CF6]/50">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#8B5CF6]">{userData.totalGoalsCompleted}</div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1">Total</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-5 text-center card-hover hover:border-yellow-500/50">
            <div className="flex justify-center mb-2">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-500">{userData.character.power}</div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1">Poder</div>
          </div>
        </div>

        {/* Attributes Radar Chart */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-6 card-hover">
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

        {/* Today's Goals - DUAS COLUNAS */}
        <div className="max-w-5xl mx-auto space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#4AFF8B]" />
            Metas de Hoje
          </h3>

          {todayGoals.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-900/50 border border-gray-800 rounded-2xl">
              <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4 text-sm sm:text-base">Nenhuma meta para hoje.</p>
              <button
                onClick={() => router.push('/goals')}
                className="px-6 py-3 bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] rounded-full text-white font-medium hover:scale-105 transition-transform button-shine"
              >
                Adicionar metas
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {todayGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 card-hover
                             ${
                               goal.completed
                                 ? 'bg-gradient-to-r from-[#4AFF8B]/20 to-[#3A8BFF]/20 border-[#4AFF8B] shadow-lg shadow-[#4AFF8B]/30 scale-[0.98]'
                                 : 'bg-gray-900/60 border-gray-700 hover:border-gray-600 hover:scale-[1.02] hover:shadow-lg'
                             }`}
                >
                  <Checkbox
                    checked={goal.completed}
                    className="data-[state=checked]:bg-[#4AFF8B] data-[state=checked]:border-[#4AFF8B] w-5 h-5 flex-shrink-0"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className={`font-medium text-sm truncate ${goal.completed ? 'text-gray-400 line-through' : 'text-white'}`}
                       title={goal.title}>
                      {goal.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize mt-1">{goal.category}</p>
                  </div>
                  {goal.completed && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-[#4AFF8B] font-bold">+50 XP</span>
                      <Zap className="w-5 h-5 text-[#4AFF8B] animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
