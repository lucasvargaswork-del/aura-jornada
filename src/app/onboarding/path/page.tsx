'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Target, Waves, ArrowRight } from 'lucide-react';
import { initializeUser } from '@/lib/storage';
import { PathType, CharacterClass } from '@/lib/types';
import { CHARACTER_CLASSES } from '@/lib/character';
import CharacterAvatar from '@/components/CharacterAvatar';

export default function PathPage() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<PathType | null>(null);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!selectedPath) {
      setError('Escolha um caminho');
      return;
    }

    if (!selectedClass) {
      setError('Escolha sua classe de personagem');
      return;
    }

    const tempData = localStorage.getItem('temp-onboarding');
    if (!tempData) {
      router.push('/onboarding/setup');
      return;
    }

    const { name, goals } = JSON.parse(tempData);
    initializeUser(name, selectedPath, goals, selectedClass);
    localStorage.removeItem('temp-onboarding');
    router.push('/dashboard');
  };

  const paths = [
    {
      id: 'disciplina' as PathType,
      name: 'Disciplina',
      description: 'Força através da consistência',
      icon: Flame,
      gradient: 'from-orange-500 to-red-500',
      color: '#EF4444',
    },
    {
      id: 'foco' as PathType,
      name: 'Foco',
      description: 'Clareza através da concentração',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
      color: '#3B82F6',
    },
    {
      id: 'serenidade' as PathType,
      name: 'Serenidade',
      description: 'Paz através do equilíbrio',
      icon: Waves,
      gradient: 'from-purple-500 to-pink-500',
      color: '#8B5CF6',
    },
  ];

  const characterClasses: CharacterClass[] = ['mage', 'archer', 'berserker', 'rogue', 'paladin'];

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-start p-6 pt-12 relative overflow-hidden">
      {/* Background effects mais escuros */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl w-full space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-1 bg-[#4AFF8B] rounded-full" />
          <div className="w-8 h-1 bg-[#4AFF8B] rounded-full" />
          <div className="w-8 h-1 bg-[#4AFF8B] rounded-full" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Escolha seu Destino
          </h1>
          <p className="text-gray-400">
            Selecione seu caminho e sua classe de personagem
          </p>
        </div>

        {/* Seleção de Caminho */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white text-center">Seu Caminho</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {paths.map((path) => {
              const Icon = path.icon;
              const isSelected = selectedPath === path.id;

              return (
                <button
                  key={path.id}
                  onClick={() => {
                    setSelectedPath(path.id);
                    setError('');
                  }}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105
                             ${
                               isSelected
                                 ? `bg-gradient-to-br ${path.gradient} border-white shadow-2xl`
                                 : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                             }`}
                  style={
                    isSelected
                      ? {
                          boxShadow: `0 0 40px ${path.color}80, 0 0 80px ${path.color}40`,
                        }
                      : {}
                  }
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Icon className={`w-12 h-12 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {path.name}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {path.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seleção de Classe */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white text-center">Sua Classe</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {characterClasses.map((charClass) => {
              const classInfo = CHARACTER_CLASSES[charClass];
              const isSelected = selectedClass === charClass;

              return (
                <button
                  key={charClass}
                  onClick={() => {
                    setSelectedClass(charClass);
                    setError('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105
                             ${
                               isSelected
                                 ? `bg-gradient-to-br ${classInfo.gradient} border-white shadow-2xl`
                                 : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                             }`}
                  style={
                    isSelected
                      ? {
                          boxShadow: `0 0 40px ${classInfo.color}80, 0 0 80px ${classInfo.color}40`,
                        }
                      : {}
                  }
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <CharacterAvatar
                      characterClass={charClass}
                      level={1}
                      size="sm"
                      showLevel={false}
                      animated={false}
                    />
                    <h3 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {classInfo.name}
                    </h3>
                    <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {classInfo.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selectedPath || !selectedClass}
          className="w-full group relative px-8 py-4 bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] rounded-full 
                     text-white font-semibold text-lg hover:scale-105 active:scale-95 transition-all duration-300 
                     shadow-lg hover:shadow-[#4AFF8B]/50 flex items-center justify-center gap-3
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span>Iniciar Jornada</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] blur-xl opacity-50 -z-10" />
        </button>
      </div>
    </div>
  );
}
