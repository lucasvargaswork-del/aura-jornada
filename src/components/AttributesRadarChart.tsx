'use client';

import { CharacterAttributes } from '@/lib/types';
import { ATTRIBUTE_NAMES, ATTRIBUTE_ICONS } from '@/lib/character';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface AttributesRadarChartProps {
  attributes: CharacterAttributes;
  size?: 'sm' | 'md' | 'lg';
  showLegend?: boolean;
}

export default function AttributesRadarChart({ 
  attributes, 
  size = 'md',
  showLegend = true 
}: AttributesRadarChartProps) {
  const data = Object.entries(attributes).map(([key, value]) => ({
    attribute: ATTRIBUTE_NAMES[key as keyof CharacterAttributes],
    value: value,
    fullMark: 100,
  }));

  const sizeClasses = {
    sm: 'h-[200px]',
    md: 'h-[300px]',
    lg: 'h-[400px]',
  };

  return (
    <div className="space-y-4">
      {/* Gráfico de Radar */}
      <div className={`w-full ${sizeClasses[size]}`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid 
              stroke="#374151" 
              strokeDasharray="3 3"
            />
            <PolarAngleAxis 
              dataKey="attribute" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#6B7280', fontSize: 10 }}
            />
            <Radar
              name="Atributos"
              dataKey="value"
              stroke="#4AFF8B"
              fill="#4AFF8B"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda com valores */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(attributes).map(([key, value]) => {
            const attrKey = key as keyof CharacterAttributes;
            return (
              <div
                key={key}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 hover:border-[#4AFF8B]/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ATTRIBUTE_ICONS[attrKey]}</span>
                    <span className="text-sm text-gray-400">{ATTRIBUTE_NAMES[attrKey]}</span>
                  </div>
                  <span className="text-lg font-bold text-[#4AFF8B]">{value}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4AFF8B] to-[#3A8BFF] transition-all duration-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
