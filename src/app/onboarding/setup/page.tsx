'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, ArrowRight, Dumbbell, Book, Briefcase, Heart, Sparkles, Coffee, Moon, Droplet, Apple, Brain, Target, Users, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createGoal } from '@/lib/storage';
import { Goal, CategoryType } from '@/lib/types';
import { CATEGORY_TO_ATTRIBUTES, ATTRIBUTE_NAMES } from '@/lib/character';

const PRESET_GOALS = [
  // Exercícios
  { title: 'Treino de força 45min', category: 'exercicios' as CategoryType, icon: Dumbbell },
  { title: 'Corrida/Caminhada 30min', category: 'exercicios' as CategoryType, icon: Target },
  { title: 'Alongamento 15min', category: 'exercicios' as CategoryType, icon: Sparkles },
  { title: 'Yoga ou Pilates', category: 'exercicios' as CategoryType, icon: Heart },
  
  // Saúde
  { title: 'Beber 2L de água', category: 'saude' as CategoryType, icon: Droplet },
  { title: 'Dormir 8 horas', category: 'saude' as CategoryType, icon: Moon },
  { title: 'Comer 3 porções de frutas', category: 'saude' as CategoryType, icon: Apple },
  { title: 'Tomar vitaminas/suplementos', category: 'saude' as CategoryType, icon: Heart },
  
  // Bem-estar
  { title: 'Meditar 10min', category: 'bem-estar' as CategoryType, icon: Sparkles },
  { title: 'Gratidão: 3 coisas boas', category: 'bem-estar' as CategoryType, icon: Smile },
  { title: 'Tempo sem telas 1h', category: 'bem-estar' as CategoryType, icon: Moon },
  { title: 'Conversar com amigos/família', category: 'bem-estar' as CategoryType, icon: Users },
  
  // Estudos
  { title: 'Ler 20 páginas', category: 'estudos' as CategoryType, icon: Book },
  { title: 'Estudar curso online 30min', category: 'estudos' as CategoryType, icon: Brain },
  { title: 'Praticar idioma 15min', category: 'estudos' as CategoryType, icon: Book },
  { title: 'Assistir documentário educativo', category: 'estudos' as CategoryType, icon: Brain },
  
  // Produtividade
  { title: 'Trabalho focado 2h (Pomodoro)', category: 'produtividade' as CategoryType, icon: Briefcase },
  { title: 'Planejar o dia (5min)', category: 'produtividade' as CategoryType, icon: Target },
  { title: 'Limpar inbox de email', category: 'produtividade' as CategoryType, icon: Briefcase },
  { title: 'Revisar metas semanais', category: 'produtividade' as CategoryType, icon: Target },
];

const CATEGORY_COLORS = {
  exercicios: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/20' },
  saude: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', glow: 'shadow-green-500/20' },
  'bem-estar': { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  estudos: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  produtividade: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
};

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<Set<number>>(new Set());
  const [customGoals, setCustomGoals] = useState<Array<{ title: string; category: CategoryType }>>([]);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<CategoryType>('bem-estar');
  const [error, setError] = useState('');

  const handleToggleGoal = (index: number) => {
    const newSelected = new Set(selectedGoals);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedGoals(newSelected);
    setError('');
  };

  const handleAddCustomGoal = () => {
    if (newGoalInput.trim()) {
      setCustomGoals([...customGoals, { title: newGoalInput.trim(), category: newGoalCategory }]);
      setNewGoalInput('');
      setError('');
    }
  };

  const handleRemoveCustomGoal = (index: number) => {
    setCustomGoals(customGoals.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Por favor, digite seu nome de guerreiro(a)!');
      return;
    }

    const totalGoals = selectedGoals.size + customGoals.length;
    if (totalGoals < 3) {
      setError('Escolha pelo menos 3 metas para começar sua jornada épica!');
      return;
    }

    // Salvar dados temporários
    const goals: Goal[] = [];
    
    selectedGoals.forEach(index => {
      const preset = PRESET_GOALS[index];
      goals.push(createGoal(preset.title, preset.category, 'diaria'));
    });

    customGoals.forEach(({ title, category }) => {
      goals.push(createGoal(title, category, 'diaria'));
    });

    localStorage.setItem('temp-onboarding', JSON.stringify({ name, goals }));
    router.push('/onboarding/path');
  };

  const totalSelected = selectedGoals.size + customGoals.length;

  // Obter atributos afetados pela categoria selecionada
  const getAffectedAttributes = (category: CategoryType) => {
    const attrs = CATEGORY_TO_ATTRIBUTES[category] || [];
    return attrs.map(attr => ATTRIBUTE_NAMES[attr]).join(', ');
  };

  // Agrupar metas por categoria
  const groupedGoals = PRESET_GOALS.reduce((acc, goal, index) => {
    if (!acc[goal.category]) {
      acc[goal.category] = [];
    }
    acc[goal.category].push({ ...goal, index });
    return acc;
  }, {} as Record<CategoryType, Array<typeof PRESET_GOALS[0] & { index: number }>>);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-start p-6 pt-12 relative overflow-hidden">
      {/* Epic background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4AFF8B]/5 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-5xl w-full space-y-8">
        {/* Epic progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="w-10 h-2 bg-gradient-to-r from-[#4AFF8B] to-purple-500 rounded-full shadow-lg shadow-[#4AFF8B]/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#4AFF8B] to-purple-500 rounded-full blur-md opacity-50" />
          </div>
          <div className="relative">
            <div className="w-10 h-2 bg-gradient-to-r from-purple-500 to-red-500 rounded-full shadow-lg shadow-purple-500/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-red-500 rounded-full blur-md opacity-50" />
          </div>
          <div className="w-10 h-2 bg-gray-700 rounded-full" />
        </div>

        {/* Epic header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4AFF8B] via-purple-400 to-red-400 mb-3">
            Configure Sua Jornada Épica
          </h1>
          <p className="text-gray-400 text-lg">
            Escolha <span className="text-[#4AFF8B] font-semibold">pelo menos 3 metas</span> para começar (sem limite máximo!)
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#4AFF8B] to-transparent" />
            <Sparkles className="w-4 h-4 text-[#4AFF8B] animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#4AFF8B] to-transparent" />
          </div>
        </div>

        {/* Name input - Epic style */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <Label htmlFor="name" className="text-gray-300 text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4AFF8B]" />
            Como devemos te chamar, guerreiro(a)?
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Digite seu nome de batalha..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-900/50 border-2 border-gray-700 text-white text-lg placeholder:text-gray-500 
                       focus:border-[#4AFF8B] focus:ring-[#4AFF8B]/20 h-14 rounded-xl
                       transition-all duration-300 hover:border-gray-600"
          />
        </div>

        {/* Preset goals - Grouped by category */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <Label className="text-gray-300 text-xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-[#4AFF8B]" />
            Metas Sugeridas por Categoria
          </Label>
          
          {Object.entries(groupedGoals).map(([category, goals]) => {
            const colors = CATEGORY_COLORS[category as CategoryType];
            return (
              <div key={category} className="space-y-3">
                <h3 className={`text-lg font-bold capitalize ${colors.text} flex items-center gap-2`}>
                  {category === 'exercicios' && <Dumbbell className="w-5 h-5" />}
                  {category === 'saude' && <Heart className="w-5 h-5" />}
                  {category === 'bem-estar' && <Sparkles className="w-5 h-5" />}
                  {category === 'estudos' && <Book className="w-5 h-5" />}
                  {category === 'produtividade' && <Briefcase className="w-5 h-5" />}
                  {category}
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {goals.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = selectedGoals.has(goal.index);
                    return (
                      <button
                        key={goal.index}
                        onClick={() => handleToggleGoal(goal.index)}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-300 group
                                   ${isSelected
                                     ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow} scale-[1.02]`
                                     : 'bg-gray-900/30 border-gray-700 hover:border-gray-600 hover:bg-gray-900/50'
                                   }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          className="mt-1 transition-all"
                        />
                        <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? colors.text : 'text-gray-500'} transition-colors`} />
                        <div className="flex-1 text-left">
                          <span className={`font-medium block ${isSelected ? 'text-white' : 'text-gray-300'} group-hover:text-white transition-colors`}>
                            {goal.title}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            Sobe: {getAffectedAttributes(goal.category)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom goals - Epic style */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <Label className="text-gray-300 text-xl font-bold flex items-center gap-2">
            <Plus className="w-6 h-6 text-[#3A8BFF]" />
            Crie Suas Metas Personalizadas
          </Label>
          
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Digite sua meta épica..."
              value={newGoalInput}
              onChange={(e) => setNewGoalInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGoal()}
              className="bg-gray-900/50 border-2 border-gray-700 text-white text-lg placeholder:text-gray-500
                         focus:border-[#3A8BFF] focus:ring-[#3A8BFF]/20 h-14 rounded-xl"
            />
            
            <div className="flex gap-3">
              <select
                value={newGoalCategory}
                onChange={(e) => setNewGoalCategory(e.target.value as CategoryType)}
                className="flex-1 px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white text-base
                           focus:border-[#3A8BFF] focus:ring-[#3A8BFF]/20 focus:outline-none transition-all"
              >
                <option value="exercicios">💪 Exercícios (Força, Agilidade, Resistência)</option>
                <option value="estudos">📚 Estudos (Inteligência, Sabedoria)</option>
                <option value="produtividade">⚡ Produtividade (Inteligência, Agilidade, Carisma)</option>
                <option value="saude">❤️ Saúde (Resistência, Sabedoria)</option>
                <option value="bem-estar">✨ Bem-estar (Sabedoria, Carisma, Resistência)</option>
              </select>
              
              <button
                onClick={handleAddCustomGoal}
                className="px-6 py-3 bg-gradient-to-r from-[#3A8BFF] to-purple-600 hover:from-[#3A8BFF]/80 hover:to-purple-600/80 
                           rounded-xl transition-all duration-300 flex items-center gap-2 text-white font-semibold
                           shadow-lg hover:shadow-[#3A8BFF]/50 hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </button>
            </div>
          </div>

          {customGoals.length > 0 && (
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {customGoals.map((goal, index) => {
                const colors = CATEGORY_COLORS[goal.category];
                return (
                  <div
                    key={index}
                    className={`flex items-start justify-between p-4 ${colors.bg} border-2 ${colors.border} 
                               rounded-xl shadow-lg ${colors.glow} group hover:scale-[1.02] transition-all`}
                  >
                    <div className="flex-1">
                      <span className="text-white font-semibold block">{goal.title}</span>
                      <span className={`text-xs ${colors.text} capitalize font-medium`}>
                        {goal.category} • Sobe: {getAffectedAttributes(goal.category)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveCustomGoal(index)}
                      className="p-2 hover:bg-red-500/20 rounded-full transition-colors ml-2 group-hover:scale-110"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Epic counter */}
        <div className="text-center py-6">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
            totalSelected >= 3 
              ? 'bg-[#4AFF8B]/10 border-[#4AFF8B] shadow-lg shadow-[#4AFF8B]/30' 
              : 'bg-gray-900/50 border-gray-700'
          }`}>
            <Target className={`w-5 h-5 ${totalSelected >= 3 ? 'text-[#4AFF8B]' : 'text-gray-500'}`} />
            <p className={`text-lg font-bold ${totalSelected >= 3 ? 'text-[#4AFF8B]' : 'text-gray-400'}`}>
              {totalSelected} metas selecionadas {totalSelected >= 3 ? '✓' : '(mínimo 3)'}
            </p>
          </div>
        </div>

        {/* Error message - Epic style */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl text-red-400 text-center font-semibold
                          shadow-lg shadow-red-500/20 animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* Epic continue button */}
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleContinue}
            disabled={totalSelected < 3 || !name.trim()}
            className="w-full group relative px-10 py-5 bg-gradient-to-r from-[#4AFF8B] via-purple-600 to-red-600 rounded-full 
                       text-white font-bold text-xl hover:scale-105 active:scale-95 transition-all duration-300 
                       shadow-2xl hover:shadow-[#4AFF8B]/50 flex items-center justify-center gap-3
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:grayscale"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            <span className="drop-shadow-lg">CONTINUAR JORNADA</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4AFF8B] via-purple-600 to-red-600 blur-2xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
}
