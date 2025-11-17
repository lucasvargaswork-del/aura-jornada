'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, ArrowRight, Zap, Crown, Shield } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleContinue = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push('/onboarding/setup');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4AFF8B]/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#4AFF8B]/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 max-w-3xl w-full text-center space-y-8 transition-all duration-500 ${
        isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {/* Epic Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4AFF8B] via-purple-500 to-red-500 rounded-full blur-3xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity" />
            
            {/* Main icon container */}
            <div className="relative bg-gradient-to-br from-[#4AFF8B] via-purple-600 to-red-600 p-8 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
              <Crown className="w-20 h-20 text-white drop-shadow-2xl" />
              
              {/* Orbiting icons */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                <Swords className="w-6 h-6 text-[#4AFF8B]" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-spin-slow" style={{ animationDelay: '1s' }}>
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 animate-spin-slow" style={{ animationDelay: '2s' }}>
                <Zap className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Epic Title with gradient */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4AFF8B] via-purple-400 to-red-400 drop-shadow-2xl animate-gradient-x">
            LEVELING KING
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#4AFF8B] to-transparent" />
            <Zap className="w-5 h-5 text-[#4AFF8B] animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#4AFF8B] to-transparent" />
          </div>
        </div>

        {/* Epic welcome messages */}
        <div className="space-y-6 mt-12">
          <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4AFF8B] to-purple-400 animate-fade-in">
            Desperte o Rei Interior
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400 animate-fade-in-delay">
            Domine Seus Hábitos, Conquiste Seu Reino
          </p>
        </div>

        {/* Epic story text */}
        <div className="mt-12 space-y-6 text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
          <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm animate-fade-in-delay-2">
            <p className="text-xl">
              Em um mundo onde a <span className="text-[#4AFF8B] font-semibold">disciplina</span> é poder,
              e cada <span className="text-purple-400 font-semibold">hábito</span> forja sua lenda...
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 animate-fade-in-delay-3">
            <div className="p-4 bg-[#4AFF8B]/10 rounded-xl border border-[#4AFF8B]/30 backdrop-blur-sm">
              <Swords className="w-8 h-8 text-[#4AFF8B] mx-auto mb-2" />
              <p className="text-sm text-gray-300">Cada meta completada é uma batalha vencida</p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Seus atributos crescem com sua jornada</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30 backdrop-blur-sm">
              <Zap className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Desbloqueie habilidades épicas</p>
            </div>
          </div>

          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4AFF8B] via-purple-400 to-red-400 mt-8 animate-pulse">
            Sua Lenda Começa Agora
          </p>
        </div>

        {/* Epic CTA Button */}
        <button
          onClick={handleContinue}
          className="mt-12 group relative px-10 py-5 bg-gradient-to-r from-[#4AFF8B] via-purple-600 to-red-600 rounded-full text-white font-bold text-xl
                     hover:scale-110 active:scale-95 transition-all duration-500 shadow-2xl hover:shadow-[#4AFF8B]/50
                     flex items-center gap-3 mx-auto animate-bounce-slow"
        >
          <Swords className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="drop-shadow-lg">INICIAR JORNADA</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          
          {/* Multi-layer glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4AFF8B] via-purple-600 to-red-600 blur-2xl opacity-60 -z-10 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4AFF8B] via-purple-600 to-red-600 blur-3xl opacity-40 -z-20" />
        </button>

        {/* Subtitle hint */}
        <p className="text-sm text-gray-500 animate-fade-in-delay-3">
          Pressione para começar sua transformação épica
        </p>
      </div>
    </div>
  );
}
