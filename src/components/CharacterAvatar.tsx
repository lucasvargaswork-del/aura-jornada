import { CharacterClass } from '@/lib/types';
import { CHARACTER_CLASSES } from '@/lib/character';

interface CharacterAvatarProps {
  characterClass: CharacterClass;
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
  animated?: boolean;
}

export default function CharacterAvatar({
  characterClass,
  level,
  size = 'md',
  showLevel = true,
  animated = true,
}: CharacterAvatarProps) {
  // Validação: garantir que sempre temos uma classe válida
  const validClass = characterClass && CHARACTER_CLASSES[characterClass] ? characterClass : 'mage';
  const classInfo = CHARACTER_CLASSES[validClass];

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  // SVG personalizado para cada classe
  const ClassAvatar = ({ className }: { className: string }) => {
    switch (validClass) {
      case 'mage':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Chapéu de mago */}
            <path d="M50 10 L70 50 L30 50 Z" fill="currentColor" opacity="0.9"/>
            <ellipse cx="50" cy="50" rx="25" ry="8" fill="currentColor" opacity="0.8"/>
            {/* Estrela mágica */}
            <path d="M50 60 L52 68 L60 68 L54 73 L56 81 L50 76 L44 81 L46 73 L40 68 L48 68 Z" fill="#FFD700"/>
            {/* Orbe de energia */}
            <circle cx="50" cy="75" r="8" fill="#8B5CF6" opacity="0.6"/>
            <circle cx="50" cy="75" r="5" fill="#A78BFA" opacity="0.8"/>
          </svg>
        );
      case 'archer':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Capuz */}
            <path d="M50 15 L70 45 L30 45 Z" fill="currentColor" opacity="0.9"/>
            <ellipse cx="50" cy="45" rx="22" ry="10" fill="currentColor" opacity="0.8"/>
            {/* Arco */}
            <path d="M30 55 Q25 70 30 85" stroke="currentColor" strokeWidth="3" fill="none"/>
            <path d="M30 55 L70 70 L30 85" stroke="currentColor" strokeWidth="2" fill="none"/>
            {/* Flecha */}
            <path d="M70 70 L85 70" stroke="#10B981" strokeWidth="2"/>
            <path d="M85 70 L90 68 L90 72 Z" fill="#10B981"/>
          </svg>
        );
      case 'berserker':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Capacete com chifres */}
            <ellipse cx="50" cy="40" rx="25" ry="20" fill="currentColor" opacity="0.9"/>
            <path d="M30 30 L25 15 L28 30" fill="currentColor"/>
            <path d="M70 30 L75 15 L72 30" fill="currentColor"/>
            {/* Espadas cruzadas */}
            <rect x="35" y="55" width="8" height="35" fill="#EF4444" transform="rotate(-30 39 72)"/>
            <rect x="57" y="55" width="8" height="35" fill="#EF4444" transform="rotate(30 61 72)"/>
            {/* Punhos das espadas */}
            <circle cx="35" cy="58" r="5" fill="#DC2626"/>
            <circle cx="65" cy="58" r="5" fill="#DC2626"/>
          </svg>
        );
      case 'rogue':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Capuz com sombra */}
            <path d="M50 10 L75 50 L25 50 Z" fill="currentColor" opacity="0.95"/>
            <ellipse cx="50" cy="50" rx="28" ry="12" fill="currentColor" opacity="0.85"/>
            {/* Máscara */}
            <rect x="35" y="45" width="30" height="8" rx="2" fill="#1F2937"/>
            {/* Adagas */}
            <path d="M35 65 L32 85 L38 85 Z" fill="#F59E0B"/>
            <path d="M65 65 L62 85 L68 85 Z" fill="#F59E0B"/>
            {/* Detalhes das adagas */}
            <rect x="33" y="60" width="4" height="8" fill="#D97706"/>
            <rect x="63" y="60" width="4" height="8" fill="#D97706"/>
          </svg>
        );
      case 'paladin':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Elmo */}
            <ellipse cx="50" cy="35" rx="22" ry="25" fill="currentColor" opacity="0.9"/>
            <rect x="40" y="30" width="20" height="15" fill="#1F2937"/>
            {/* Escudo */}
            <path d="M50 50 L70 55 L70 80 L50 90 L30 80 L30 55 Z" fill="#3B82F6" opacity="0.9"/>
            <path d="M50 50 L65 54 L65 77 L50 85 L35 77 L35 54 Z" fill="#60A5FA" opacity="0.8"/>
            {/* Cruz no escudo */}
            <rect x="48" y="60" width="4" height="20" fill="#FFFFFF"/>
            <rect x="40" y="68" width="20" height="4" fill="#FFFFFF"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative inline-block">
      {/* Avatar principal */}
      <div
        className={`${sizeClasses[size]} relative rounded-full bg-gradient-to-br ${classInfo.gradient} 
                   flex items-center justify-center shadow-2xl border-4 border-gray-900
                   ${animated ? 'hover:scale-110 transition-transform duration-300' : ''}`}
        style={{
          boxShadow: `0 0 40px ${classInfo.color}80, 0 0 80px ${classInfo.color}40`,
        }}
      >
        {/* Brilho interno */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20" />
        
        {/* Avatar do personagem */}
        <div className="relative z-10 flex items-center justify-center">
          <ClassAvatar className={`${iconSizes[size]} text-white drop-shadow-2xl`} />
        </div>

        {/* Círculo interno decorativo */}
        <div 
          className="absolute inset-4 rounded-full border-2 border-white/20"
          style={{
            boxShadow: `inset 0 0 20px ${classInfo.color}40`,
          }}
        />

        {/* Partículas flutuantes */}
        {animated && (
          <>
            <div
              className="absolute w-2 h-2 rounded-full bg-white/60 animate-ping"
              style={{
                top: '10%',
                right: '15%',
                animationDuration: '2s',
                animationDelay: '0s',
              }}
            />
            <div
              className="absolute w-2 h-2 rounded-full bg-white/60 animate-ping"
              style={{
                bottom: '15%',
                left: '10%',
                animationDuration: '2s',
                animationDelay: '1s',
              }}
            />
            <div
              className="absolute w-1.5 h-1.5 rounded-full bg-white/40 animate-ping"
              style={{
                top: '25%',
                left: '20%',
                animationDuration: '3s',
                animationDelay: '0.5s',
              }}
            />
          </>
        )}
      </div>

      {/* Badge de nível */}
      {showLevel && (
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full 
                     bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm
                     shadow-lg border-2 border-gray-900"
          style={{
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
          }}
        >
          Nv. {level}
        </div>
      )}

      {/* Aura pulsante */}
      {animated && (
        <div
          className="absolute inset-0 rounded-full animate-pulse opacity-30"
          style={{
            background: `radial-gradient(circle, ${classInfo.color}40 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
      )}
    </div>
  );
}
