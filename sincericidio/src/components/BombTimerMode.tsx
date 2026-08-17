import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bomb, Flame, Play, Pause, RotateCcw, AlertOctagon, UserCheck, ArrowRight } from 'lucide-react';
import { GameCard, Player } from '../types';
import { sounds } from '../utils/audio';

interface BombTimerModeProps {
  cards: GameCard[];
  players: Player[];
  onPlayerDrink: (playerId: string, amount: number) => void;
}

export const BombTimerMode: React.FC<BombTimerModeProps> = ({ cards, players, onPlayerDrink }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [totalDuration, setTotalDuration] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [isExploded, setIsExploded] = useState(false);

  const timerRef = useRef<number | null>(null);
  const currentCard = cards[currentCardIndex % cards.length];
  const activePlayer = players[activePlayerIndex % (players.length || 1)];

  // Start round
  const startRound = () => {
    // Random duration between 8 and 18 seconds for maximum unpredictability
    const randomDuration = Math.floor(Math.random() * 11) + 8;
    setTotalDuration(randomDuration);
    setTimeLeft(randomDuration);
    setIsRunning(true);
    setIsExploded(false);
  };

  const handlePassBomb = () => {
    sounds.playTick();
    // Pass to next player and pick new rapid question
    setActivePlayerIndex((prev) => (prev + 1) % players.length);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const resetBomb = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsExploded(false);
    setTimeLeft(10);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsExploded(true);
            sounds.playExplosion();
            if (activePlayer) {
              onPlayerDrink(activePlayer.id, 2);
            }
            return 0;
          }
          sounds.playTick();
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, activePlayer, onPlayerDrink]);

  const progressPercentage = (timeLeft / totalDuration) * 100;
  const isUrgent = timeLeft <= 3 && isRunning;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Header Banner */}
      <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
        <Bomb className="w-4 h-4" />
        <span>MODO PATATA CALIENTE / BOMBA DE TIEMPO</span>
      </div>

      {/* Active Holder Badge */}
      {activePlayer && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xl">{activePlayer.avatar}</span>
          <div className="text-xs">
            <span className="text-neutral-400">Tiene la bomba: </span>
            <span className="font-bold text-white">{activePlayer.name}</span>
          </div>
        </div>
      )}

      {/* Animated Bomb Centerpiece */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        <motion.div
          animate={
            isExploded
              ? { scale: [1, 1.4, 1.1], rotate: [0, -10, 10, 0] }
              : isUrgent
              ? { scale: [1, 1.15, 1], rotate: [-4, 4, -4] }
              : isRunning
              ? { scale: [1, 1.05, 1] }
              : { scale: 1 }
          }
          transition={{ repeat: isRunning ? Infinity : 0, duration: isUrgent ? 0.25 : 0.6 }}
          className={`w-36 h-36 rounded-full flex flex-col items-center justify-center relative shadow-2xl border-4 transition-colors ${
            isExploded
              ? 'bg-red-600 border-red-400 text-white shadow-red-500/50'
              : isUrgent
              ? 'bg-amber-600 border-amber-400 text-white shadow-amber-500/40'
              : 'bg-neutral-900 border-neutral-700 text-neutral-200'
          }`}
        >
          {isExploded ? (
            <div className="text-center">
              <span className="text-4xl">💥</span>
              <span className="block text-xs font-black uppercase tracking-wider mt-1">¡BOOOM!</span>
            </div>
          ) : (
            <>
              <Bomb className={`w-10 h-10 ${isRunning ? 'animate-bounce' : ''}`} />
              <span className="text-2xl font-black font-mono mt-1">{timeLeft}s</span>
            </>
          )}
        </motion.div>

        {/* Circular pulse aura */}
        {isRunning && (
          <div
            className={`absolute -inset-4 rounded-full opacity-30 animate-ping pointer-events-none ${
              isUrgent ? 'bg-red-500' : 'bg-amber-500'
            }`}
          />
        )}
      </div>

      {/* Question / Task Box */}
      <motion.div
        key={currentCard?.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl p-6 bg-neutral-900 border border-neutral-800 text-center shadow-lg my-4"
      >
        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
          ¡Responde de inmediato o pasa la bomba!
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold text-neutral-100">
          "{currentCard?.question}"
        </h3>
      </motion.div>

      {/* Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
        {!isRunning && !isExploded && (
          <button
            id="start-bomb-btn"
            onClick={startRound}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Encender Mecha</span>
          </button>
        )}

        {isRunning && (
          <button
            id="pass-bomb-btn"
            onClick={handlePassBomb}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-95 transition-all animate-pulse"
          >
            <span>¡HE RESPONDIDO! PASAR BOMBA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {isExploded && (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-xs text-red-300 font-semibold w-full">
              💀 {activePlayer?.name} se ha quemado y bebe 2 tragos.
            </div>
            <button
              id="restart-bomb-btn"
              onClick={startRound}
              className="px-6 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Siguiente Ronda de Bomba</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
