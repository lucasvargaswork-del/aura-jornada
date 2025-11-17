'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Save, Edit2, Check } from 'lucide-react';
import { getStoredData, saveData, createGoal } from '@/lib/storage';
import { UserData, Goal, CategoryType, FrequencyType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const CATEGORIES: { value: CategoryType; label: string; icon: string }[] = [
  { value: 'exercicios', label: 'Exercícios', icon: '💪' },
  { value: 'saude', label: 'Saúde', icon: '❤️' },
  { value: 'produtividade', label: 'Produtividade', icon: '⚡' },
  { value: 'estudos', label: 'Estudos', icon: '📚' },
  { value: 'bem-estar', label: 'Bem-estar', icon: '🧘' },
];

const FREQUENCIES: { value: FrequencyType; label: string }[] = [
  { value: 'diaria', label: 'Diária' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'dias-especificos', label: 'Dias específicos' },
];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function GoalsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<CategoryType>('bem-estar');
  const [newGoalFrequency, setNewGoalFrequency] = useState<FrequencyType>('diaria');
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    const data = getStoredData();
    if (!data || !data.onboardingCompleted) {
      router.push('/onboarding/welcome');
      return;
    }
    setUserData(data);
  }, [router]);

  const handleAddGoal = () => {
    if (!userData || !newGoalTitle.trim()) return;

    const specificDays = newGoalFrequency === 'dias-especificos' ? Array.from(selectedDays) : undefined;
    const newGoal = createGoal(newGoalTitle, newGoalCategory, newGoalFrequency, specificDays);

    const updatedData = {
      ...userData,
      goals: [...userData.goals, newGoal],
    };

    setUserData(updatedData);
    saveData(updatedData);

    // Reset form
    setNewGoalTitle('');
    setNewGoalCategory('bem-estar');
    setNewGoalFrequency('diaria');
    setSelectedDays(new Set());
    setShowAddForm(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!userData) return;

    const updatedData = {
      ...userData,
      goals: userData.goals.filter((g) => g.id !== goalId),
    };

    setUserData(updatedData);
    saveData(updatedData);
  };

  const handleToggleDay = (day: number) => {
    const newDays = new Set(selectedDays);
    if (newDays.has(day)) {
      newDays.delete(day);
    } else {
      newDays.add(day);
    }
    setSelectedDays(newDays);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0E1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4AFF8B] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const groupedGoals = CATEGORIES.map((cat) => ({
    category: cat,
    goals: userData.goals.filter((g) => g.category === cat.value),
  })).filter((group) => group.goals.length > 0);

  return (
    <div className="min-h-screen bg-[#0E1117] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4AFF8B]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3A8BFF]/5 rounded-full blur-[100px]" />

      {/* Header melhorado */}
      <header className="relative z-10 border-b border-gray-800/50 bg-[#0E1117]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-white">Minhas Metas</h1>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] 
                       rounded-full text-white font-medium hover:scale-105 transition-transform shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Meta</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Add goal form melhorado */}
        {showAddForm && (
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-900/50 border border-gray-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#4AFF8B]" />
                Criar Nova Meta
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-all hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300 text-sm sm:text-base">
                  Título da meta
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Ex: Meditar 10 minutos"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#4AFF8B] focus:ring-[#4AFF8B]/20"
                />
              </div>

              <div>
                <Label className="text-gray-300 text-sm sm:text-base">Categoria</Label>
                <Select value={newGoalCategory} onValueChange={(v) => setNewGoalCategory(v as CategoryType)}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300 text-sm sm:text-base">Frequência</Label>
                <Select value={newGoalFrequency} onValueChange={(v) => setNewGoalFrequency(v as FrequencyType)}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newGoalFrequency === 'dias-especificos' && (
                <div>
                  <Label className="text-gray-300 mb-2 block text-sm sm:text-base">Dias da semana</Label>
                  <div className="flex gap-2 flex-wrap">
                    {WEEKDAYS.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleToggleDay(index)}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                          selectedDays.has(index)
                            ? 'bg-[#4AFF8B] text-white scale-105 shadow-lg shadow-[#4AFF8B]/30'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:scale-105'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddGoal}
                disabled={!newGoalTitle.trim() || (newGoalFrequency === 'dias-especificos' && selectedDays.size === 0)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] 
                           rounded-full text-white font-semibold hover:scale-105 transition-transform shadow-lg
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Save className="w-4 h-4" />
                Salvar Meta
              </button>
            </div>
          </div>
        )}

        {/* Goals list melhorado */}
        {groupedGoals.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-gray-900/30 border border-gray-800 rounded-2xl">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">Você ainda não tem metas cadastradas.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] rounded-full text-white font-medium hover:scale-105 transition-transform"
            >
              Criar sua primeira meta
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {groupedGoals.map((group) => (
              <div key={group.category.value} className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">{group.category.icon}</span>
                  <span>{group.category.label}</span>
                  <span className="ml-auto text-sm text-gray-500">({group.goals.length})</span>
                </h3>

                <div className="space-y-2">
                  {group.goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900/40 to-gray-900/30 border border-gray-800 
                                 rounded-xl hover:border-gray-700 transition-all hover:scale-[1.02] group"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm sm:text-base">{goal.title}</p>
                        <p className="text-xs sm:text-sm text-gray-500 capitalize mt-1">
                          {goal.frequency === 'dias-especificos' && goal.specificDays
                            ? goal.specificDays.map((d) => WEEKDAYS[d]).join(', ')
                            : FREQUENCIES.find((f) => f.value === goal.frequency)?.label}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
