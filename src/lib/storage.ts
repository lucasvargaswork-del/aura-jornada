import { UserData, Goal, PathType, CategoryType, FrequencyType, CharacterStats, CharacterAttributes } from './types';
import { calculateExperienceForLevel, CHARACTER_CLASSES } from './character';

const STORAGE_KEY = 'leveling-king-data';

export const getStoredData = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  
  const parsedData = JSON.parse(data);
  
  // Migração: adicionar character se não existir (dados antigos)
  if (!parsedData.character) {
    const defaultClass = 'mage';
    parsedData.character = {
      class: defaultClass,
      level: 1,
      experience: 0,
      experienceToNextLevel: calculateExperienceForLevel(2),
      power: 10,
      attributes: CHARACTER_CLASSES[defaultClass].baseAttributes,
      achievements: [],
    };
    saveData(parsedData);
  }
  
  // Migração: adicionar attributes se não existir
  if (!parsedData.character.attributes) {
    const characterClass = parsedData.character.class || 'mage';
    parsedData.character.attributes = CHARACTER_CLASSES[characterClass].baseAttributes;
    saveData(parsedData);
  }
  
  return parsedData;
};

export const saveData = (data: UserData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const initializeUser = (name: string, path: PathType, goals: Goal[], characterClass: string): UserData => {
  const classKey = characterClass as keyof typeof CHARACTER_CLASSES;
  const classInfo = CHARACTER_CLASSES[classKey];
  
  const character: CharacterStats = {
    class: classKey,
    level: 1,
    experience: 0,
    experienceToNextLevel: calculateExperienceForLevel(2),
    power: 10,
    attributes: { ...classInfo.baseAttributes },
    achievements: [],
  };

  const userData: UserData = {
    name,
    path,
    character,
    goals,
    auraLevel: 0,
    streak: 0,
    lastCompletedDate: '',
    totalGoalsCompleted: 0,
    onboardingCompleted: true,
  };
  
  saveData(userData);
  return userData;
};

export const resetJourney = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const getTodayGoals = (goals: Goal[]): Goal[] => {
  const today = new Date().getDay();
  
  return goals.filter(goal => {
    if (goal.frequency === 'diaria') return true;
    if (goal.frequency === 'semanal') return true;
    if (goal.frequency === 'dias-especificos' && goal.specificDays) {
      return goal.specificDays.includes(today);
    }
    return false;
  });
};

export const calculateAuraLevel = (completedGoals: number, totalGoals: number): number => {
  if (totalGoals === 0) return 0;
  return Math.round((completedGoals / totalGoals) * 100);
};

export const updateStreak = (userData: UserData): UserData => {
  const today = new Date().toDateString();
  const lastDate = userData.lastCompletedDate ? new Date(userData.lastCompletedDate).toDateString() : '';
  
  if (lastDate === today) {
    return userData;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  if (lastDate === yesterdayStr) {
    return { ...userData, streak: userData.streak + 1, lastCompletedDate: today };
  } else if (lastDate === '') {
    return { ...userData, streak: 1, lastCompletedDate: today };
  } else {
    return { ...userData, streak: 1, lastCompletedDate: today };
  }
};

export const getMilestone = (streak: number): { title: string; description: string } | null => {
  if (streak >= 100) return { title: 'Chama Eterna', description: '100 dias de evolução' };
  if (streak >= 60) return { title: 'Imparável', description: '60 dias de disciplina' };
  if (streak >= 30) return { title: 'Guardião Interior', description: '30 dias de evolução' };
  if (streak >= 7) return { title: 'Aura Desperta', description: '7 dias de disciplina' };
  if (streak >= 1) return { title: 'Centelha Inicial', description: 'Primeiro passo dado' };
  return null;
};

export const getPathColors = (path: PathType): { primary: string; secondary: string; glow: string } => {
  switch (path) {
    case 'disciplina':
      return { primary: '#4AFF8B', secondary: '#3A8BFF', glow: 'rgba(74, 255, 139, 0.3)' };
    case 'foco':
      return { primary: '#3A8BFF', secondary: '#8B5CF6', glow: 'rgba(58, 139, 255, 0.3)' };
    case 'serenidade':
      return { primary: '#8B5CF6', secondary: '#4AFF8B', glow: 'rgba(139, 92, 246, 0.3)' };
  }
};

export const getDailyMessage = (): string => {
  const messages = [
    'Sua Aura cresce com cada ação concluída.',
    'Disciplina é evolução.',
    'Você é o protagonista. Continue.',
    'Hoje é um bom dia para evoluir.',
    'O poder está em suas mãos.',
    'Cada meta é um passo rumo à lenda.',
  ];
  
  const index = new Date().getDate() % messages.length;
  return messages[index];
};

export const createGoal = (
  title: string,
  category: CategoryType,
  frequency: FrequencyType,
  specificDays?: number[]
): Goal => {
  return {
    id: Date.now().toString(),
    title,
    category,
    frequency,
    specificDays,
    completed: false,
    createdAt: new Date().toISOString(),
  };
};
