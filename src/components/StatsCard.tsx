'use client';

import { Sparkles, Zap, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  icon: 'sparkles' | 'zap' | 'trending';
  label: string;
  value: string | number;
  color: string;
  gradient: string;
  subtitle?: string;
}

export default function StatsCard({ icon, label, value, color, gradient, subtitle }: StatsCardProps) {
  const IconComponent = {
    sparkles: Sparkles,
    zap: Zap,
    trending: TrendingUp,
  }[icon];

  return (
    <div 
      className={`bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 
                  rounded-xl p-4 sm:p-5 text-center card-hover hover:border-${color}/50 
                  transition-all duration-300 group`}
    >
      <div className="flex justify-center mb-2">
        <div className={`p-3 bg-${color}/10 rounded-lg group-hover:scale-110 transition-transform`}>
          <IconComponent className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
      <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-400 mt-1">{label}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-2">{subtitle}</div>
      )}
    </div>
  );
}
