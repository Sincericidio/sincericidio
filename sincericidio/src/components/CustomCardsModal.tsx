import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Tag, Flame, ShieldAlert } from 'lucide-react';
import { GameCard, CategoryId, IntensityLevel } from '../types';
import { CATEGORIES_CONFIG } from '../data/cards';

interface CustomCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCards: GameCard[];
  onAddCustomCard: (card: Omit<GameCard, 'id' | 'isCustom'>) => void;
  onDeleteCustomCard: (id: string) => void;
}

export const CustomCardsModal: React.FC<CustomCardsModalProps> = ({
  isOpen,
  onClose,
  customCards,
  onAddCustomCard,
  onDeleteCustomCard,
}) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<CategoryId>('confesiones');
  const [intensity, setIntensity] = useState<IntensityLevel>('picante');
  const [punishment, setPunishment] = useState('');
  const [tag, setTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    onAddCustomCard({
      question: question.trim(),
      category,
      intensity,
      punishment: punishment.trim() || 'Bebe 2 tragos.',
      tag: tag.trim() || 'PreguntaPersonalizada',
      target: 'individual',
    });

    setQuestion('');
    setPunishment('');
    setTag('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Mazo de Cartas Personalizadas</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Añade tus propias preguntas, salseos locales o secretos del grupo.
            </p>
          </div>
          <button
            id="close-custom-cards-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creation Form */}
        <form onSubmit={handleSubmit} className="mt-4 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Pregunta o Confesión:
            </label>
            <textarea
              id="custom-card-question-input"
              rows={2}
              placeholder="Ej: ¿Qué persona de este grupo te caía mal al principio y por qué?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Categoría:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES_CONFIG.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Intensidad:
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as IntensityLevel)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="suave">🟢 Suave</option>
                <option value="medio">🟡 Picardía</option>
                <option value="picante">🔥 +18 Hot</option>
                <option value="nuclear">☢️ Nuclear</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              Penalización o Castigo (opcional):
            </label>
            <input
              type="text"
              placeholder="Ej: Bebe 2 tragos o enseña tu última foto."
              value={punishment}
              onChange={(e) => setPunishment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              id="submit-custom-card-btn"
              type="submit"
              disabled={!question.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir al mazo</span>
            </button>
          </div>
        </form>

        {/* Existing Custom Cards */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
          <div className="text-xs font-semibold text-neutral-400 mb-1 flex items-center justify-between">
            <span>Cartas creadas por ti ({customCards.length}):</span>
          </div>

          {customCards.length === 0 ? (
            <div className="py-6 text-center text-xs text-neutral-500">
              No tienes preguntas personalizadas aún. ¡Crea una arriba para sorprender a tus amigos!
            </div>
          ) : (
            customCards.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-neutral-200">{c.question}</div>
                  {c.punishment && (
                    <div className="text-rose-400 text-[11px] mt-1">🍺 {c.punishment}</div>
                  )}
                </div>
                <button
                  onClick={() => onDeleteCustomCard(c.id)}
                  className="p-1.5 rounded-lg bg-neutral-900 text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                  title="Eliminar carta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
