import React, { useState } from 'react';
import { X, UserPlus, Trash2, Shield, Beer, Plus, Sparkles } from 'lucide-react';
import { Player } from '../types';

interface PlayerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onAddPlayer: (name: string, avatar: string) => void;
  onRemovePlayer: (id: string) => void;
  onUpdateScore: (id: string, sincerityDelta: number, drinksDelta: number) => void;
}

const AVATAR_OPTIONS = ['😎', '🦊', '🔥', '🍸', '😈', '👑', '👽', '🦄', '💣', '🥳', '🌶️', '🎭'];
const COLOR_GRADIENTS = [
  'from-rose-500 to-pink-500',
  'from-purple-500 to-indigo-500',
  'from-amber-500 to-red-500',
  'from-emerald-500 to-teal-500',
  'from-sky-500 to-blue-500',
  'from-yellow-400 to-amber-500',
];

export const PlayerSetupModal: React.FC<PlayerSetupModalProps> = ({
  isOpen,
  onClose,
  players,
  onAddPlayer,
  onRemovePlayer,
  onUpdateScore,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onAddPlayer(nameInput.trim(), selectedAvatar);
    setNameInput('');
    // Pick next avatar
    const nextIdx = (AVATAR_OPTIONS.indexOf(selectedAvatar) + 1) % AVATAR_OPTIONS.length;
    setSelectedAvatar(AVATAR_OPTIONS[nextIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>👥 Jugadores de la Partida</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Añade a tus amigos para que los turnos y castigos sean personalizados.
            </p>
          </div>
          <button
            id="close-player-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Player Form */}
        <form onSubmit={handleAdd} className="mt-4 p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
          <div className="text-xs font-semibold text-neutral-300 mb-2">Nuevo Jugador</div>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <button
                type="button"
                className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 text-xl flex items-center justify-center hover:scale-105 transition-transform"
              >
                {selectedAvatar}
              </button>
            </div>
            <input
              id="player-name-input"
              type="text"
              placeholder="Nombre o apodo..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
              maxLength={20}
            />
            <button
              id="add-player-submit-btn"
              type="submit"
              disabled={!nameInput.trim()}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Añadir</span>
            </button>
          </div>

          {/* Quick Avatar selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedAvatar(emoji)}
                className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                  selectedAvatar === emoji
                    ? 'bg-rose-500/20 border border-rose-500 text-base scale-110'
                    : 'bg-neutral-900 border border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </form>

        {/* Players List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
          {players.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No hay jugadores creados. ¡Añade al menos a 2 personas para empezar!
            </div>
          ) : (
            players.map((player) => (
              <div
                key={player.id}
                className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{player.avatar}</span>
                  <div>
                    <div className="font-bold text-sm text-neutral-100">{player.name}</div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                      <span className="text-emerald-400">⭐ {player.sincerityPoints} sinceridades</span>
                      <span>•</span>
                      <span className="text-rose-400">🍺 {player.drinksTaken} tragos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Manual Drink increment */}
                  <button
                    onClick={() => onUpdateScore(player.id, 0, 1)}
                    className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold"
                    title="Añadir trago manual"
                  >
                    +🍺
                  </button>
                  {/* Remove Player */}
                  {players.length > 2 && (
                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Eliminar jugador"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs"
          >
            Listo para jugar ({players.length} jugadores)
          </button>
        </div>
      </div>
    </div>
  );
};
