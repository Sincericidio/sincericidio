import React from 'react';
import { X, Trophy, Beer, CheckCircle2, Flame, Award, Heart, Skull } from 'lucide-react';
import { Player } from '../types';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  totalAnswersCount: number;
  totalDrinksCount: number;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  isOpen,
  onClose,
  players,
  totalAnswersCount,
  totalDrinksCount,
}) => {
  if (!isOpen) return null;

  // Sorter
  const mostSincere = [...players].sort((a, b) => b.sincerityPoints - a.sincerityPoints)[0];
  const mostDrunk = [...players].sort((a, b) => b.drinksTaken - a.drinksTaken)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Marcador & Estadísticas</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Resultados en vivo de sinceridad y tragos en la sesión.
            </p>
          </div>
          <button
            id="close-stats-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Summary Metrics */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verdades Dichas</span>
            </div>
            <div className="text-2xl font-black text-white">{totalAnswersCount}</div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
            <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-xs mb-1">
              <Beer className="w-4 h-4" />
              <span>Tragos Repartidos</span>
            </div>
            <div className="text-2xl font-black text-white">{totalDrinksCount}</div>
          </div>
        </div>

        {/* Highlight Badges */}
        <div className="space-y-2 mb-4">
          {mostSincere && mostSincere.sincerityPoints > 0 && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div className="text-xs">
                <span className="font-bold text-amber-400 block">El/La Más Sincero/a (MVP):</span>
                <span className="text-neutral-200 font-semibold">
                  {mostSincere.name} con {mostSincere.sincerityPoints} respuestas honestas
                </span>
              </div>
            </div>
          )}

          {mostDrunk && mostDrunk.drinksTaken > 0 && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
              <span className="text-2xl">🍺</span>
              <div className="text-xs">
                <span className="font-bold text-rose-400 block">Rey/Reina de los Tragos:</span>
                <span className="text-neutral-200 font-semibold">
                  {mostDrunk.name} con {mostDrunk.drinksTaken} tragos acumulados
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Players Standings List */}
        <div className="space-y-2 flex-1">
          <div className="text-xs font-semibold text-neutral-400 mb-2">Clasificación individual:</div>
          {players.map((player, idx) => (
            <div
              key={player.id}
              className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-neutral-500 w-4">#{idx + 1}</span>
                <span className="text-xl">{player.avatar}</span>
                <div>
                  <div className="font-bold text-neutral-100">{player.name}</div>
                  <div className="text-[11px] text-neutral-400">
                    Ratio de verdad: {player.sincerityPoints + player.drinksTaken > 0 ? Math.round((player.sincerityPoints / (player.sincerityPoints + player.drinksTaken)) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-emerald-400">⭐ {player.sincerityPoints}</div>
                <div className="font-bold text-rose-400">🍺 {player.drinksTaken}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
