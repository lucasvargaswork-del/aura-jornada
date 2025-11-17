export type PathType = 'disciplina' | 'foco' | 'serenidade';

export type FrequencyType = 'diaria' | 'semanal' | 'dias-especificos';

export type CategoryType = 'exercicios' | 'saude' | 'produtividade' | 'estudos' | 'bem-estar';

// Sistema de Classes RPG
export type CharacterClass = 'mage' | 'archer' | 'berserker' | 'rogue' | 'paladin';

// Sistema de Atributos RPG
export interface CharacterAttributes {
  strength: number;      // Força - sobe com exercícios físicos
  intelligence: number;  // Inteligência - sobe com estudos
  agility: number;       // Agilidade - sobe com exercícios e produtividade
  endurance: number;     // Resistência - sobe com saúde e bem-estar
  wisdom: number;        // Sabedoria - sobe com bem-estar e estudos
  charisma: number;      // Carisma - sobe com todas as categorias (geral)
}

export interface CharacterStats {
  class: CharacterClass;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  power: number; // Poder do personagem
  attributes: CharacterAttributes; // Novos atributos
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'comum' | 'raro' | 'epico' | 'lendario';
}

export interface Goal {
  id: string;
  title: string;
  category: CategoryType;
  frequency: FrequencyType;
  specificDays?: number[]; // 0-6 (domingo-sábado)
  completed: boolean;
  createdAt: string;
}

export interface UserData {
  name: string;
  path: PathType;
  character: CharacterStats; // Sistema de personagem RPG
  goals: Goal[];
  auraLevel: number;
  streak: number;
  lastCompletedDate: string;
  totalGoalsCompleted: number;
  onboardingCompleted: boolean;
}

export interface Milestone {
  days: number;
  title: string;
  description: string;
}
