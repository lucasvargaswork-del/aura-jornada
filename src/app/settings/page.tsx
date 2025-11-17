'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Flame, Target, Waves, AlertTriangle, Sparkles } from 'lucide-react';
import { getStoredData, saveData } from '@/lib/storage';
import { CHARACTER_CLASSES } from '@/lib/character';
import { UserData, PathType, CharacterClass } from '@/lib/types';
import CharacterAvatar from '@/components/CharacterAvatar';

export default function SettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showPathModal, setShowPathModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [selectedPath, setSelectedPath] = useState<PathType | null>(null);

  useEffect(() => {
    const data = getStoredData();
    if (!data || !data.onboardingCompleted) {
      router.push('/onboarding/welcome');
      return;
    }
    setUserData(data);
  }, [router]);

  const handleChangeClass = () => {
    if (!userData || !selectedClass) return;

    // Penalidade: perde 20% do nível atual (mínimo nível 1)
    const newLevel = Math.max(1, Math.floor(userData.character.level * 0.8));
    const levelLost = userData.character.level - newLevel;

    const updatedData: UserData = {
      ...userData,
      character: {
        ...userData.character,
        class: selectedClass,
        level: newLevel,
        experience: 0,
        experienceToNextLevel: 100 * Math.pow(1.5, newLevel - 1),
        power: Math.max(10, userData.character.power - (levelLost * 5)),
        attributes: CHARACTER_CLASSES[selectedClass].baseAttributes,
      },
    };

    saveData(updatedData);
    setUserData(updatedData);
    setShowClassModal(false);
    setSelectedClass(null);
  };

  const handleChangePath = () => {
    if (!userData || !selectedPath) return;

    const updatedData: UserData = {
      ...userData,
      path: selectedPath,
    };

    saveData(updatedData);
    setUserData(updatedData);
    setShowPathModal(false);
    setSelectedPath(null);
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
  const currentClassInfo = CHARACTER_CLASSES[userData.character.class];

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/10 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-[#0A0A0F]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/profile')}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Configurações
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Current Character */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#4AFF8B]" />
            Seu Personagem Atual
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <CharacterAvatar
              characterClass={userData.character.class}
              level={userData.character.level}
              size="xl"
              showLevel={true}
              animated={true}
            />
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-white mb-2">{currentClassInfo.name}</h3>
              <p className="text-gray-400 mb-4">{currentClassInfo.description}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-[#4AFF8B]/20 text-[#4AFF8B] rounded-full text-sm font-medium">
                  Nível {userData.character.level}
                </span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium">
                  Poder {userData.character.power}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Class */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Trocar de Classe</h2>
          <p className="text-gray-400 mb-4">
            Mude sua classe de personagem. <span className="text-orange-400 font-semibold">Atenção: Você perderá 20% do seu nível atual!</span>
          </p>
          <button
            onClick={() => setShowClassModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium 
                       hover:scale-105 transition-transform"
          >
            Escolher Nova Classe
          </button>
        </div>

        {/* Change Path */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Trocar de Caminho</h2>
          <p className="text-gray-400 mb-4">
            Mude seu caminho espiritual. Não há penalidades para esta mudança.
          </p>
          <button
            onClick={() => setShowPathModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-medium 
                       hover:scale-105 transition-transform"
          >
            Escolher Novo Caminho
          </button>
        </div>
      </main>

      {/* Class Change Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <h3 className="text-2xl font-bold text-white">Trocar de Classe</h3>
            </div>
            
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 mb-6">
              <p className="text-orange-400 text-sm">
                <strong>Atenção:</strong> Ao trocar de classe, você perderá 20% do seu nível atual 
                (de nível {userData.character.level} para nível {Math.max(1, Math.floor(userData.character.level * 0.8))}) 
                e seus atributos serão resetados para os valores base da nova classe.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {characterClasses.map((charClass) => {
                const classInfo = CHARACTER_CLASSES[charClass];
                const isSelected = selectedClass === charClass;
                const isCurrent = userData.character.class === charClass;

                return (
                  <button
                    key={charClass}
                    onClick={() => setSelectedClass(charClass)}
                    disabled={isCurrent}
                    className={`p-4 rounded-xl border-2 transition-all duration-300
                               ${isCurrent ? 'opacity-50 cursor-not-allowed bg-gray-800/50 border-gray-700' :
                                 isSelected
                                   ? `bg-gradient-to-br ${classInfo.gradient} border-white shadow-2xl scale-105`
                                   : 'bg-gray-900/50 border-gray-700 hover:border-gray-600 hover:scale-105'
                               }`}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <CharacterAvatar
                        characterClass={charClass}
                        level={1}
                        size="sm"
                        showLevel={false}
                        animated={false}
                      />
                      <h3 className={`text-base font-bold ${isSelected || isCurrent ? 'text-white' : 'text-gray-300'}`}>
                        {classInfo.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-xs text-gray-400">(Atual)</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowClassModal(false);
                  setSelectedClass(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangeClass}
                disabled={!selectedClass}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium 
                           hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Confirmar Mudança
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Path Change Modal */}
      {showPathModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-gray-800 rounded-2xl p-6 max-w-3xl w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Escolher Novo Caminho</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {paths.map((path) => {
                const Icon = path.icon;
                const isSelected = selectedPath === path.id;
                const isCurrent = userData.path === path.id;

                return (
                  <button
                    key={path.id}
                    onClick={() => setSelectedPath(path.id)}
                    disabled={isCurrent}
                    className={`p-6 rounded-xl border-2 transition-all duration-300
                               ${isCurrent ? 'opacity-50 cursor-not-allowed bg-gray-800/50 border-gray-700' :
                                 isSelected
                                   ? `bg-gradient-to-br ${path.gradient} border-white shadow-2xl scale-105`
                                   : 'bg-gray-900/50 border-gray-700 hover:border-gray-600 hover:scale-105'
                               }`}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Icon className={`w-12 h-12 ${isSelected || isCurrent ? 'text-white' : 'text-gray-400'}`} />
                      <h3 className={`text-xl font-bold ${isSelected || isCurrent ? 'text-white' : 'text-gray-300'}`}>
                        {path.name}
                      </h3>
                      <p className={`text-sm ${isSelected || isCurrent ? 'text-white/80' : 'text-gray-500'}`}>
                        {path.description}
                      </p>
                      {isCurrent && (
                        <span className="text-xs text-gray-400">(Atual)</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPathModal(false);
                  setSelectedPath(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePath}
                disabled={!selectedPath}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-medium 
                           hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Confirmar Mudança
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
