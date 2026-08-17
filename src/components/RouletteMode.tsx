import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Shuffle, Flame, Sparkles, Beer, RotateCcw } from 'lucide-react';
import { GameCard, Player } from '../types';
import { sounds } from '../utils/audio';

interface RouletteModeProps {
  cards: GameCard[];
  players: Player[];
  onPlayerDrink: (playerId: string, amount: number) => void;
  onPlayerSincere: (playerId: string) => void;
}

export const RouletteMode: React.FC<RouletteModeProps> = ({
  cards,
  players,
  onPlayerDrink,
  onPlayerSincere,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning || players.length === 0) return;

    sounds.playTick();
    setIsSpinning(true);
    setSelectedPlayer(null);
    setSelectedCard(null);

    const randomExtraTurns = 5 + Math.floor(Math.random() * 5);
    const newRotation = rotation + randomExtraTurns * 360 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    setTimeout(() => {
      const pickedPlayer = players[Math.floor(Math.random() * players.length)];
      const pickedCard = cards[Math.floor(Math.random() * cards.length)];
      
      setSelectedPlayer(pickedPlayer);
      setSelectedCard(pickedCard);
      setIsSpinning(false);
      sounds.playSuccess();

      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
        <Shuffle className="w-4 h-4" />
        <span>RULETA DE LA VERDAD & VÍCTIMAS</span>
      </div>

      {/* Wheel Representation */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Pointer */}
        <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-rose-500 filter drop-shadow" />

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 2.5, ease: [0.15, 0.9, 0.2, 1] }}
          className="w-56 h-56 rounded-full border-4 border-neutral-700 bg-gradient-to-tr from-purple-900 via-neutral-900 to-rose-950 p-2 relative shadow-2xl flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-full rounded-full border border-dashed border-neutral-600 flex items-center justify-center relative">
            <Sparkles className="w-10 h-10 text-purple-400 opacity-60 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </motion.div>
      </div>

      {/* Spin Button */}
      <button
        id="spin-roulette-btn"
        onClick={handleSpin}
        disabled={isSpinning || players.length === 0}
        className="mt-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-purple-900/40 active:scale-95 transition-all"
      >
        <Shuffle className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        <span>{isSpinning ? 'Girando ruleta...' : '¡Girar la Ruleta!'}</span>
      </button>

      {/* Result Reveal */}
      {selectedPlayer && selectedCard && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full rounded-3xl p-6 bg-neutral-900 border border-purple-500/30 shadow-2xl mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-purple-400 mb-2 uppercase tracking-wide">
            <span>Víctima elegida:</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">{selectedPlayer.avatar}</span>
            <span className="text-2xl font-black text-white">{selectedPlayer.name}</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-sm font-semibold text-neutral-200 mb-4">
            "{selectedCard.question}"
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                onPlayerSincere(selectedPlayer.id);
                sounds.playSuccess();
                setSelectedPlayer(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <span>Responde (+1 ⭐)</span>
            </button>
            <button
              onClick={() => {
                onPlayerDrink(selectedPlayer.id, 2);
                sounds.playDrink();
                setSelectedPlayer(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Beer className="w-3.5 h-3.5" />
              <span>Paga trago (🍺)</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
