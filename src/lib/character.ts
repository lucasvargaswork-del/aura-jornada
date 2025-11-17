import { CharacterClass, CharacterStats, Achievement, CharacterAttributes, CategoryType } from './types';

// Informações das classes
export const CHARACTER_CLASSES = {
  mage: {
    name: 'Mago',
    description: 'Mestre da sabedoria e conhecimento arcano',
    color: '#8B5CF6',
    gradient: 'from-purple-500 via-violet-500 to-purple-600',
    baseAttributes: { 
      strength: 3, 
      intelligence: 10, 
      agility: 4, 
      endurance: 5, 
      wisdom: 9, 
      charisma: 6 
    },
    abilities: [
      { level: 1, name: 'Mente Brilhante', description: '+10% XP em metas de Estudos', icon: '🧠' },
      { level: 5, name: 'Foco Arcano', description: '+5% XP em todas as metas', icon: '✨' },
      { level: 10, name: 'Sabedoria Ancestral', description: '+15% XP em metas de Estudos e Bem-estar', icon: '📚' },
      { level: 20, name: 'Mestre Arcano', description: '+20% XP em todas as metas', icon: '🔮' },
    ],
  },
  archer: {
    name: 'Arqueiro',
    description: 'Preciso e focado, nunca erra o alvo',
    color: '#10B981',
    gradient: 'from-emerald-500 via-green-500 to-teal-600',
    baseAttributes: { 
      strength: 6, 
      intelligence: 6, 
      agility: 10, 
      endurance: 7, 
      wisdom: 5, 
      charisma: 5 
    },
    abilities: [
      { level: 1, name: 'Olho de Águia', description: '+10% XP em metas de Produtividade', icon: '🎯' },
      { level: 5, name: 'Precisão Mortal', description: '+5% XP em todas as metas', icon: '🏹' },
      { level: 10, name: 'Foco Absoluto', description: '+15% XP em metas de Produtividade e Exercícios', icon: '👁️' },
      { level: 20, name: 'Mestre Arqueiro', description: '+20% XP em todas as metas', icon: '🎖️' },
    ],
  },
  berserker: {
    name: 'Berserk',
    description: 'Força bruta e determinação inabalável',
    color: '#EF4444',
    gradient: 'from-red-500 via-orange-500 to-red-600',
    baseAttributes: { 
      strength: 10, 
      intelligence: 3, 
      agility: 6, 
      endurance: 9, 
      wisdom: 4, 
      charisma: 5 
    },
    abilities: [
      { level: 1, name: 'Fúria Indomável', description: '+10% XP em metas de Exercícios', icon: '💪' },
      { level: 5, name: 'Resistência Brutal', description: '+5% XP em todas as metas', icon: '🛡️' },
      { level: 10, name: 'Força Titânica', description: '+15% XP em metas de Exercícios e Saúde', icon: '⚡' },
      { level: 20, name: 'Berserk Supremo', description: '+20% XP em todas as metas', icon: '👹' },
    ],
  },
  rogue: {
    name: 'Ladino',
    description: 'Ágil e estratégico, sempre um passo à frente',
    color: '#F59E0B',
    gradient: 'from-amber-500 via-yellow-500 to-orange-500',
    baseAttributes: { 
      strength: 5, 
      intelligence: 7, 
      agility: 10, 
      endurance: 6, 
      wisdom: 6, 
      charisma: 8 
    },
    abilities: [
      { level: 1, name: 'Sombras Furtivas', description: '+10% XP em metas de Bem-estar', icon: '🌙' },
      { level: 5, name: 'Agilidade Suprema', description: '+5% XP em todas as metas', icon: '💨' },
      { level: 10, name: 'Mestre das Sombras', description: '+15% XP em metas de Bem-estar e Produtividade', icon: '🗡️' },
      { level: 20, name: 'Ladino Lendário', description: '+20% XP em todas as metas', icon: '👤' },
    ],
  },
  paladin: {
    name: 'Paladino',
    description: 'Guardião da disciplina e da honra',
    color: '#3B82F6',
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    baseAttributes: { 
      strength: 8, 
      intelligence: 6, 
      agility: 5, 
      endurance: 9, 
      wisdom: 7, 
      charisma: 9 
    },
    abilities: [
      { level: 1, name: 'Luz Divina', description: '+10% XP em metas de Saúde', icon: '✨' },
      { level: 5, name: 'Escudo Sagrado', description: '+5% XP em todas as metas', icon: '🛡️' },
      { level: 10, name: 'Guardião Sagrado', description: '+15% XP em metas de Saúde e Exercícios', icon: '⚔️' },
      { level: 20, name: 'Paladino Divino', description: '+20% XP em todas as metas', icon: '👼' },
    ],
  },
};

// Mapeamento de categorias para atributos
export const CATEGORY_TO_ATTRIBUTES: Record<CategoryType, (keyof CharacterAttributes)[]> = {
  'exercicios': ['strength', 'agility', 'endurance'],
  'estudos': ['intelligence', 'wisdom'],
  'produtividade': ['intelligence', 'agility', 'charisma'],
  'saude': ['endurance', 'wisdom'],
  'bem-estar': ['wisdom', 'charisma', 'endurance'],
};

// Sistema de XP e Níveis
export const calculateExperienceForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const addExperience = (character: CharacterStats, xpGained: number): CharacterStats => {
  let newExp = character.experience + xpGained;
  let newLevel = character.level;
  let expToNext = character.experienceToNextLevel;

  while (newExp >= expToNext) {
    newExp -= expToNext;
    newLevel += 1;
    expToNext = calculateExperienceForLevel(newLevel + 1);
  }

  return {
    ...character,
    level: newLevel,
    experience: newExp,
    experienceToNextLevel: expToNext,
    power: character.power + (newLevel - character.level) * 5,
  };
};

// Adicionar pontos de atributo baseado na categoria da meta
export const addAttributePoints = (
  attributes: CharacterAttributes,
  category: CategoryType,
  points: number = 1
): CharacterAttributes => {
  const affectedAttributes = CATEGORY_TO_ATTRIBUTES[category] || [];
  const newAttributes = { ...attributes };

  affectedAttributes.forEach(attr => {
    newAttributes[attr] = Math.min(100, newAttributes[attr] + points);
  });

  return newAttributes;
};

// Calcular poder total baseado nos atributos
export const calculateTotalPower = (attributes: CharacterAttributes): number => {
  return Math.floor(
    (attributes.strength +
      attributes.intelligence +
      attributes.agility +
      attributes.endurance +
      attributes.wisdom +
      attributes.charisma) / 6
  );
};

// Obter habilidades desbloqueadas da classe
export const getUnlockedAbilities = (characterClass: CharacterClass, level: number) => {
  const classInfo = CHARACTER_CLASSES[characterClass];
  return classInfo.abilities.filter(ability => level >= ability.level);
};

// Conquistas temáticas de anime
export const ACHIEVEMENTS_DATABASE = [
  // Nível 1-10
  {
    id: 'first-step',
    title: 'Primeiro Passo',
    description: 'Complete sua primeira meta',
    icon: '⭐',
    rarity: 'comum' as const,
    requirement: { type: 'goals', count: 1 },
  },
  {
    id: 'newbie-warrior',
    title: 'Guerreiro Iniciante',
    description: 'Alcance o nível 5',
    icon: '⚔️',
    rarity: 'comum' as const,
    requirement: { type: 'level', count: 5 },
  },
  {
    id: 'week-streak',
    title: 'Chama da Determinação',
    description: 'Mantenha 7 dias de streak',
    icon: '🔥',
    rarity: 'raro' as const,
    requirement: { type: 'streak', count: 7 },
  },
  {
    id: 'strong-warrior',
    title: 'Guerreiro Forte',
    description: 'Alcance 50 de Força',
    icon: '💪',
    rarity: 'raro' as const,
    requirement: { type: 'attribute', attribute: 'strength', count: 50 },
  },
  {
    id: 'wise-sage',
    title: 'Sábio Iluminado',
    description: 'Alcance 50 de Sabedoria',
    icon: '🧙',
    rarity: 'raro' as const,
    requirement: { type: 'attribute', attribute: 'wisdom', count: 50 },
  },
  
  // Nível 10-20
  {
    id: 'rising-hero',
    title: 'Herói em Ascensão',
    description: 'Alcance o nível 10',
    icon: '🌟',
    rarity: 'raro' as const,
    requirement: { type: 'level', count: 10 },
  },
  {
    id: 'goal-master',
    title: 'Mestre das Metas',
    description: 'Complete 50 metas',
    icon: '🎯',
    rarity: 'raro' as const,
    requirement: { type: 'goals', count: 50 },
  },
  {
    id: 'month-warrior',
    title: 'Guerreiro do Mês',
    description: 'Mantenha 30 dias de streak',
    icon: '👑',
    rarity: 'epico' as const,
    requirement: { type: 'streak', count: 30 },
  },
  {
    id: 'balanced-hero',
    title: 'Herói Equilibrado',
    description: 'Tenha todos os atributos acima de 30',
    icon: '⚖️',
    rarity: 'epico' as const,
    requirement: { type: 'balanced', count: 30 },
  },
  
  // Nível 20-50
  {
    id: 'elite-fighter',
    title: 'Lutador de Elite',
    description: 'Alcance o nível 20',
    icon: '⚡',
    rarity: 'epico' as const,
    requirement: { type: 'level', count: 20 },
  },
  {
    id: 'century-goals',
    title: 'Centurião',
    description: 'Complete 100 metas',
    icon: '💯',
    rarity: 'epico' as const,
    requirement: { type: 'goals', count: 100 },
  },
  {
    id: 'unstoppable',
    title: 'Imparável',
    description: 'Mantenha 60 dias de streak',
    icon: '🔱',
    rarity: 'epico' as const,
    requirement: { type: 'streak', count: 60 },
  },
  {
    id: 'master-strength',
    title: 'Mestre da Força',
    description: 'Alcance 80 de Força',
    icon: '🏋️',
    rarity: 'epico' as const,
    requirement: { type: 'attribute', attribute: 'strength', count: 80 },
  },
  {
    id: 'genius-mind',
    title: 'Mente Genial',
    description: 'Alcance 80 de Inteligência',
    icon: '🧠',
    rarity: 'epico' as const,
    requirement: { type: 'attribute', attribute: 'intelligence', count: 80 },
  },
  
  // Nível 50+
  {
    id: 'legendary-hero',
    title: 'Herói Lendário',
    description: 'Alcance o nível 50',
    icon: '👹',
    rarity: 'lendario' as const,
    requirement: { type: 'level', count: 50 },
  },
  {
    id: 'goal-legend',
    title: 'Lenda das Metas',
    description: 'Complete 500 metas',
    icon: '🏆',
    rarity: 'lendario' as const,
    requirement: { type: 'goals', count: 500 },
  },
  {
    id: 'eternal-flame',
    title: 'Chama Eterna',
    description: 'Mantenha 100 dias de streak',
    icon: '🔥',
    rarity: 'lendario' as const,
    requirement: { type: 'streak', count: 100 },
  },
  {
    id: 'ultimate-power',
    title: 'Poder Supremo',
    description: 'Alcance o nível 100',
    icon: '💫',
    rarity: 'lendario' as const,
    requirement: { type: 'level', count: 100 },
  },
  {
    id: 'perfect-balance',
    title: 'Equilíbrio Perfeito',
    description: 'Tenha todos os atributos no máximo (100)',
    icon: '☯️',
    rarity: 'lendario' as const,
    requirement: { type: 'balanced', count: 100 },
  },
  {
    id: 'omnipotent',
    title: 'Onipotente',
    description: 'Alcance 100 em qualquer atributo',
    icon: '🌌',
    rarity: 'lendario' as const,
    requirement: { type: 'max-attribute', count: 100 },
  },
];

export const checkAchievements = (
  character: CharacterStats,
  totalGoals: number,
  streak: number
): Achievement[] => {
  const newAchievements: Achievement[] = [];
  const unlockedIds = character.achievements.map(a => a.id);

  ACHIEVEMENTS_DATABASE.forEach(achievement => {
    if (unlockedIds.includes(achievement.id)) return;

    let unlocked = false;
    if (achievement.requirement.type === 'level') {
      unlocked = character.level >= achievement.requirement.count;
    } else if (achievement.requirement.type === 'goals') {
      unlocked = totalGoals >= achievement.requirement.count;
    } else if (achievement.requirement.type === 'streak') {
      unlocked = streak >= achievement.requirement.count;
    } else if (achievement.requirement.type === 'attribute') {
      const attr = achievement.requirement.attribute as keyof CharacterAttributes;
      unlocked = character.attributes[attr] >= achievement.requirement.count;
    } else if (achievement.requirement.type === 'balanced') {
      const allAbove = Object.values(character.attributes).every(
        val => val >= achievement.requirement.count
      );
      unlocked = allAbove;
    } else if (achievement.requirement.type === 'max-attribute') {
      const hasMax = Object.values(character.attributes).some(
        val => val >= achievement.requirement.count
      );
      unlocked = hasMax;
    }

    if (unlocked) {
      newAchievements.push({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity,
        unlockedAt: new Date().toISOString(),
      });
    }
  });

  return newAchievements;
};

export const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'comum':
      return 'from-gray-400 to-gray-500';
    case 'raro':
      return 'from-blue-400 to-blue-600';
    case 'epico':
      return 'from-purple-400 to-purple-600';
    case 'lendario':
      return 'from-yellow-400 via-orange-500 to-red-500';
  }
};

export const getRarityGlow = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'comum':
      return 'shadow-gray-500/50';
    case 'raro':
      return 'shadow-blue-500/50';
    case 'epico':
      return 'shadow-purple-500/50';
    case 'lendario':
      return 'shadow-yellow-500/50';
  }
};

// Nomes dos atributos em português
export const ATTRIBUTE_NAMES: Record<keyof CharacterAttributes, string> = {
  strength: 'Força',
  intelligence: 'Inteligência',
  agility: 'Agilidade',
  endurance: 'Resistência',
  wisdom: 'Sabedoria',
  charisma: 'Carisma',
};

// Ícones dos atributos
export const ATTRIBUTE_ICONS: Record<keyof CharacterAttributes, string> = {
  strength: '💪',
  intelligence: '🧠',
  agility: '⚡',
  endurance: '🛡️',
  wisdom: '📚',
  charisma: '✨',
};
