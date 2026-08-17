import React from 'react';
import { CATEGORIES_CONFIG } from '../data/cards';
import { CategoryId, IntensityLevel } from '../types';
import { SlidersHorizontal, Flame } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategories: CategoryId[];
  onToggleCategory: (catId: CategoryId) => void;
  onSelectAllCategories: () => void;
  selectedIntensities: IntensityLevel[];
  onToggleIntensity: (intensity: IntensityLevel) => void;
  customCardsCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onToggleCategory,
  onSelectAllCategories,
  selectedIntensities,
  onToggleIntensity,
  customCardsCount,
}) => {
  const intensityLevels: { id: IntensityLevel; label: string; icon: string; color: string }[] = [
    { id: 'suave', label: 'Suave', icon: '🟢', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
    { id: 'medio', label: 'Picardía', icon: '🟡', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { id: 'picante', label: '+18 Hot', icon: '🔥', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' },
    { id: 'nuclear', label: 'Nuclear', icon: '☢️', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <button
          id="cat-filter-all"
          onClick={onSelectAllCategories}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            selectedCategories.length === CATEGORIES_CONFIG.length
              ? 'bg-white text-neutral-900 border-white shadow-sm'
              : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Todos
        </button>

        {CATEGORIES_CONFIG.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          const isCustom = cat.id === 'personalizadas';
          
          return (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => onToggleCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-sm`
                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {isCustom && customCardsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-black/40 text-white">
                  {customCardsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Intensity Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-800/40 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Filtro de Intensidad:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {intensityLevels.map((lvl) => {
            const active = selectedIntensities.includes(lvl.id);
            return (
              <button
                key={lvl.id}
                id={`intensity-filter-${lvl.id}`}
                onClick={() => onToggleIntensity(lvl.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  active
                    ? `${lvl.color} border font-semibold`
                    : 'bg-neutral-900 text-neutral-500 border-neutral-800 opacity-60 hover:opacity-100'
                }`}
              >
                <span className="mr-1">{lvl.icon}</span>
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
