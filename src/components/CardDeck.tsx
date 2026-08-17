import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Flame, Beer, CheckCircle2, RotateCw, Sparkles, AlertTriangle, ShieldAlert, Award, User } from 'lucide-react';
import { GameCard, Player } from '../types';
import { CATEGORIES_CONFIG } from '../data/cards';
import { sounds } from '../utils/audio';

interface CardDeckProps {
  card: GameCard | null;
  activePlayer: Player | null;
  onNextCard: (answered: boolean) => void;
  onSkipCard: () => void;
  cardsRemaining: number;
  totalCards: number;
}

export const CardDeck: React.FC<CardDeckProps> = ({
  card,
  activePlayer,
  onNextCard,
  onSkipCard,
  cardsRemaining,
  totalCards,
}) => {
  const [isFlipped, setIsFlipped] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-4 text-2xl">
          🃏
        </div>
        <h3 className="text-xl font-bold text-neutral-200">¡Fin del mazo!</h3>
        <p className="text-sm text-neutral-400 mt-2 max-w-sm">
          Has completado todas las cartas seleccionadas. Puedes reiniciar el mazo o cambiar los filtros.
        </p>
        <button
          id="reload-deck-btn"
          onClick={() => onNextCard(false)}
          className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold shadow-lg shadow-rose-600/30 hover:brightness-110"
        >
          Reiniciar cartas
        </button>
      </div>
    );
  }

  const categoryMeta = CATEGORIES_CONFIG.find((c) => c.id === card.category) || CATEGORIES_CONFIG[0];

  const handleSincereAnswer = () => {
    sounds.playSuccess();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#38bdf8']
    });
    setIsAnimating(true);
    setTimeout(() => {
      onNextCard(true);
      setIsAnimating(false);
    }, 200);
  };

  const handleDrinkPenalty = () => {
    sounds.playDrink();
    setIsAnimating(true);
    setTimeout(() => {
      onNextCard(false);
      setIsAnimating(false);
    }, 200);
  };

  const handleWildcard = () => {
    sounds.playFlip();
    onSkipCard();
  };

  const intensityBadge = {
    suave: { text: 'Nivel Suave', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    medio: { text: 'Picardía Media', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    picante: { text: '¡Muy Picante! +18', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    nuclear: { text: '☢️ VERDAD NUCLEAR', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  }[card.intensity];

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col items-center justify-center">
      {/* Player Turn Indicator Bar */}
      {activePlayer && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-4 flex items-center justify-between px-4 py-2 rounded-2xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{activePlayer.avatar}</span>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Turno de juego
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{activePlayer.name}</span>
                <span className="text-[11px] font-normal text-rose-400">
                  (⭐ {activePlayer.sincerityPoints} | 🍺 {activePlayer.drinksTaken})
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-neutral-400 font-mono">
            {totalCards - cardsRemaining + 1}/{totalCards}
          </div>
        </motion.div>
      )}

      {/* Interactive 3D Card */}
      <div className="w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ scale: 0.9, opacity: 0, rotateY: -15, y: 20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateY: 15, y: -20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className={`w-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border shadow-2xl transition-all ${
              card.intensity === 'nuclear'
                ? 'border-purple-500/40 bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-purple-950/40 shadow-purple-500/10'
                : card.intensity === 'picante'
                ? 'border-rose-500/40 bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-rose-950/40 shadow-rose-500/10'
                : 'border-neutral-800 bg-neutral-900/95'
            }`}
          >
            {/* Top Card Bar: Category & Intensity */}
            <div className="flex items-center justify-between gap-2 border-b border-neutral-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${categoryMeta.bgBadge}`}>
                  {categoryMeta.emoji} {categoryMeta.label}
                </span>
                {card.tag && (
                  <span className="text-[11px] text-neutral-400 font-medium px-2 py-0.5 rounded-md bg-neutral-800/60">
                    #{card.tag}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${intensityBadge.color}`}>
                {intensityBadge.text}
              </span>
            </div>

            {/* Main Question Body */}
            <div className="my-6 sm:my-8">
              {card.target && card.target !== 'individual' && (
                <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {card.target === 'group' && 'Pregunta para TODO el grupo'}
                  {card.target === 'left-player' && 'Pregunta hacia la persona a tu izquierda'}
                  {card.target === 'right-player' && 'Pregunta hacia la persona a tu derecha'}
                  {card.target === 'couple' && 'Dilema en parejas'}
                </div>
              )}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-100 tracking-tight leading-snug">
                "{card.question}"
              </h2>
            </div>

            {/* Punishment / Alternative Drink Box */}
            {card.punishment && (
              <div className="rounded-2xl bg-neutral-950/70 border border-neutral-800 p-3.5 flex items-start gap-3 text-xs">
                <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                  <Beer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-rose-400 block mb-0.5 uppercase tracking-wide text-[10px]">
                    Si te niegas a contestar:
                  </span>
                  <span className="text-neutral-300 font-medium leading-relaxed">
                    {card.punishment}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Control Buttons */}
      <div className="w-full mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Sincere Button */}
        <button
          id="btn-sincere"
          onClick={handleSincereAnswer}
          className="col-span-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>¡Soy sincero! (+1)</span>
        </button>

        {/* Drink / Punish Button */}
        <button
          id="btn-drink"
          onClick={handleDrinkPenalty}
          className="col-span-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 active:scale-95 transition-all"
        >
          <Beer className="w-4 h-4 text-rose-200" />
          <span>Paso y bebo (🍺)</span>
        </button>

        {/* Wildcard / Change Question */}
        <button
          id="btn-wildcard"
          onClick={handleWildcard}
          className="col-span-2 sm:col-span-1 py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-neutral-800 active:scale-95 transition-all"
        >
          <RotateCw className="w-4 h-4 text-neutral-400" />
          <span>Cambiar carta</span>
        </button>
      </div>
    </div>
  );
};
