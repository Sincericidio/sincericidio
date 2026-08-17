import React from 'react';
import { Flame, Users, Bomb, Sparkles, QrCode, BarChart3, Volume2, VolumeX, Shuffle, RotateCcw } from 'lucide-react';
import { GameMode, Player } from '../types';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  players: Player[];
  activePlayerIndex: number;
  onOpenPlayerModal: () => void;
  onOpenQRModal: () => void;
  onOpenCustomCards: () => void;
  onOpenStats: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  players,
  activePlayerIndex,
  onOpenPlayerModal,
  onOpenQRModal,
  onOpenCustomCards,
  onOpenStats,
  soundEnabled,
  onToggleSound,
  onResetGame,
}) => {
  const activePlayer = players[activePlayerIndex];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-500 shadow-lg shadow-rose-500/20">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                SINCERICIDIO
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Verdad sin filtros, confesiones y fiesta
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800/80">
          <button
            id="nav-tab-cards"
            onClick={() => onSelectMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'cards'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Cartas
          </button>
          <button
            id="nav-tab-voting"
            onClick={() => onSelectMode('voting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'voting'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Votación
          </button>
          <button
            id="nav-tab-bomb"
            onClick={() => onSelectMode('bomb')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'bomb'
                ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Bomb className="w-3.5 h-3.5" />
            Bomba
          </button>
          <button
            id="nav-tab-roulette"
            onClick={() => onSelectMode('roulette')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'roulette'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            Ruleta
          </button>
        </div>

        {/* Action Controls & Player Indicator */}
        <div className="flex items-center gap-2">
          {/* Active Player Chip */}
          {players.length > 0 && activePlayer && (
            <button
              id="active-player-btn"
              onClick={onOpenPlayerModal}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all text-xs"
              title="Gestionar jugadores"
            >
              <span className="text-base leading-none">{activePlayer.avatar}</span>
              <span className="font-semibold text-neutral-200 max-w-[80px] truncate hidden sm:inline">
                {activePlayer.name}
              </span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-neutral-800 text-neutral-400">
                {players.length}
              </span>
            </button>
          )}

          {/* Custom Cards button */}
          <button
            id="open-custom-cards-btn"
            onClick={onOpenCustomCards}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
            title="Mazo personalizado"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* QR Room button */}
          <button
            id="open-qr-room-btn"
            onClick={onOpenQRModal}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
            title="Compartir sala y QR"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Stats scoreboard */}
          <button
            id="open-stats-btn"
            onClick={onOpenStats}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-sky-400 hover:border-sky-500/30 transition-all"
            title="Marcador y estadísticas"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
            }`}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar efectos de sonido'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset / Reiniciar */}
          <button
            id="reset-game-btn"
            onClick={onResetGame}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-all"
            title="Reiniciar partida"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 border-t border-neutral-800/60 bg-neutral-950">
        <button
          onClick={() => onSelectMode('cards')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            currentMode === 'cards' ? 'bg-rose-600 text-white' : 'text-neutral-400'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Cartas
        </button>
        <button
          onClick={() => onSelectMode('voting')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            currentMode === 'voting' ? 'bg-sky-600 text-white' : 'text-neutral-400'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Votación
        </button>
        <button
          onClick={() => onSelectMode('bomb')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            currentMode === 'bomb' ? 'bg-amber-600 text-white' : 'text-neutral-400'
          }`}
        >
          <Bomb className="w-3.5 h-3.5" />
          Bomba
        </button>
        <button
          onClick={() => onSelectMode('roulette')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            currentMode === 'roulette' ? 'bg-purple-600 text-white' : 'text-neutral-400'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" />
          Ruleta
        </button>
      </div>
    </header>
  );
};
