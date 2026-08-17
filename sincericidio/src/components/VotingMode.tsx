import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Users, Trophy, RotateCcw, Beer, Check, Crown, Flame } from 'lucide-react';
import { GameCard, Player } from '../types';
import { sounds } from '../utils/audio';

interface VotingModeProps {
  cards: GameCard[];
  players: Player[];
  onPlayerDrink: (playerId: string, amount: number) => void;
}

export const VotingMode: React.FC<VotingModeProps> = ({ cards, players, onPlayerDrink }) => {
  const votingCards = cards.filter((c) => c.category === 'votacion' || c.target === 'group');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [votedCount, setVotedCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentCard = votingCards[currentCardIndex % (votingCards.length || 1)] || cards[0];

  const handleVote = (playerId: string) => {
    sounds.playTick();
    setVotes((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
    setVotedCount((prev) => prev + 1);
  };

  const handleReveal = () => {
    sounds.playSuccess();
    setIsRevealed(true);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Determine winner
    let maxVotes = -1;
    let winnerId = '';
    Object.entries(votes).forEach(([pId, count]) => {
      const numCount = Number(count);
      if (numCount > maxVotes) {
        maxVotes = numCount;
        winnerId = pId;
      }
    });

    if (winnerId) {
      onPlayerDrink(winnerId, 2);
    }
  };

  const handleNextQuestion = () => {
    sounds.playFlip();
    setVotes({});
    setVotedCount(0);
    setIsRevealed(false);
    setCurrentCardIndex((prev) => prev + 1);
  };

  if (!currentCard) {
    return <div className="text-center py-12 text-neutral-400">No hay cartas de votación disponibles.</div>;
  }

  // Calculate winner
  let maxVotes = 0;
  let winnerPlayer: Player | undefined;
  if (isRevealed) {
    Object.entries(votes).forEach(([pId, count]) => {
      const numCount = Number(count);
      if (numCount > maxVotes) {
        maxVotes = numCount;
        winnerPlayer = players.find((p) => p.id === pId);
      }
    });
  }

  const totalVotesCast: number = (Object.values(votes) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Header Banner */}
      <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold">
        <Users className="w-4 h-4" />
        <span>MODO VOTACIÓN GRUPAL DEMOCRÁTICA</span>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentCard.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl p-6 sm:p-8 bg-neutral-900 border border-neutral-800 shadow-xl text-center relative overflow-hidden mb-6"
      >
        <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
          Debate y Votación
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug">
          "{currentCard.question}"
        </h2>
        {currentCard.punishment && (
          <p className="mt-3 text-xs text-rose-400 font-medium bg-rose-500/10 py-1.5 px-3 rounded-xl border border-rose-500/20 inline-block">
            ⚖️ Penalización: {currentCard.punishment}
          </p>
        )}
      </motion.div>

      {/* Player Vote Buttons / Results Tally */}
      {!isRevealed ? (
        <div className="w-full">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-3 px-1">
            <span>Haz clic en el jugador que merece el voto:</span>
            <span className="font-semibold text-neutral-200">Votos emitidos: {votedCount}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {players.map((player) => {
              const count = votes[player.id] || 0;
              return (
                <button
                  key={player.id}
                  id={`vote-btn-${player.id}`}
                  onClick={() => handleVote(player.id)}
                  className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-sky-500/50 hover:bg-neutral-800/80 active:scale-95 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{player.avatar}</span>
                    <div>
                      <div className="font-bold text-neutral-100 text-sm group-hover:text-sky-400 transition-colors">
                        {player.name}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {count > 0 ? `${count} ${count === 1 ? 'voto' : 'votos'}` : 'Votar'}
                      </div>
                    </div>
                  </div>
                  {count > 0 && (
                    <span className="w-7 h-7 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-md">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Reveal Button */}
          <div className="mt-6 flex justify-center">
            <button
              id="reveal-votes-btn"
              onClick={handleReveal}
              disabled={totalVotesCast === 0}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-900/30 active:scale-95 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>Revelar Veredicto Final</span>
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl p-6 bg-neutral-900/90 border border-neutral-800"
        >
          {winnerPlayer && (
            <div className="text-center mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-sm mb-1">
                <Crown className="w-5 h-5 animate-bounce" />
                <span>¡EL/LA MÁS VOTADO/A!</span>
              </div>
              <div className="text-2xl font-black text-white flex items-center justify-center gap-2">
                <span>{winnerPlayer.avatar}</span>
                <span>{winnerPlayer.name}</span>
              </div>
              <div className="text-xs text-rose-300 mt-2 font-medium">
                🍺 Recibe 2 tragos obligatorios por decisión popular.
              </div>
            </div>
          )}

          {/* Bar Chart of Votes */}
          <div className="space-y-3">
            {players.map((player) => {
              const voteCount = Number(votes[player.id] || 0);
              const percentage = totalVotesCast > 0 ? (voteCount / totalVotesCast) * 100 : 0;
              const isWinner = winnerPlayer?.id === player.id;

              return (
                <div key={player.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span>{player.avatar}</span>
                      <span className={isWinner ? 'text-amber-400 font-bold' : 'text-neutral-300'}>
                        {player.name}
                      </span>
                    </div>
                    <span className="text-neutral-400">
                      {voteCount} {voteCount === 1 ? 'voto' : 'votos'} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        isWinner
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : 'bg-gradient-to-r from-sky-500 to-blue-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Voting Card */}
          <div className="mt-6 flex justify-center">
            <button
              id="next-voting-card-btn"
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Siguiente pregunta</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
