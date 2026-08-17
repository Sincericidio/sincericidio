import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GameCard, CategoryId, IntensityLevel, Player, GameMode } from './types';
import { INITIAL_CARDS, DEFAULT_PLAYERS, CATEGORIES_CONFIG } from './data/cards';
import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { CardDeck } from './components/CardDeck';
import { VotingMode } from './components/VotingMode';
import { BombTimerMode } from './components/BombTimerMode';
import { RouletteMode } from './components/RouletteMode';
import { PlayerSetupModal } from './components/PlayerSetupModal';
import { CustomCardsModal } from './components/CustomCardsModal';
import { RoomQRModal } from './components/RoomQRModal';
import { StatsDrawer } from './components/StatsDrawer';
import { sounds } from './utils/audio';
import { Flame, Sparkles, Users, Bomb, Shuffle, HelpCircle } from 'lucide-react';

const STORAGE_KEY_PLAYERS = 'sincericidio_players';
const STORAGE_KEY_CUSTOM_CARDS = 'sincericidio_custom_cards';
const STORAGE_KEY_SETTINGS = 'sincericidio_settings';

export default function App() {
  // --- STATE INITIALIZATION ---
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return DEFAULT_PLAYERS;
  });

  const [customCards, setCustomCards] = useState<GameCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_CARDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  });

  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([
    'picante',
    'confesiones',
    'fiesta',
    'votacion',
    'amistad',
    'secretos',
    'personalizadas',
  ]);

  const [selectedIntensities, setSelectedIntensities] = useState<IntensityLevel[]>([
    'suave',
    'medio',
    'picante',
    'nuclear',
  ]);

  const [currentMode, setCurrentMode] = useState<GameMode>('cards');
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isCustomCardsOpen, setIsCustomCardsOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Stats Counters
  const [totalAnswersCount, setTotalAnswersCount] = useState(0);
  const [totalDrinksCount, setTotalDrinksCount] = useState(0);

  // Room Code
  const [roomCode] = useState(() => 'SIN-' + Math.floor(1000 + Math.random() * 9000));

  // --- SAVE TO LOCALSTORAGE ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
    } catch {
      // Ignore
    }
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_CARDS, JSON.stringify(customCards));
    } catch {
      // Ignore
    }
  }, [customCards]);

  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Combine initial cards + custom cards
  const allCards = useMemo(() => {
    return [...INITIAL_CARDS, ...customCards];
  }, [customCards]);

  // Filtered Cards based on selected categories & intensities
  const activeDeck = useMemo(() => {
    let filtered = allCards.filter((card) => {
      const matchCat = selectedCategories.includes(card.category);
      const matchIntensity = selectedIntensities.includes(card.intensity);
      return matchCat && matchIntensity;
    });

    if (filtered.length === 0) {
      return INITIAL_CARDS;
    }

    // Shuffle
    return [...filtered].sort(() => Math.random() - 0.5);
  }, [allCards, selectedCategories, selectedIntensities]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const currentCard = activeDeck[currentCardIndex % activeDeck.length] || null;

  // Next Card Action
  const handleNextCard = (answered: boolean) => {
    const currentPlayer = players[activePlayerIndex % players.length];
    if (currentPlayer) {
      if (answered) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === currentPlayer.id ? { ...p, sincerityPoints: p.sincerityPoints + 1 } : p
          )
        );
        setTotalAnswersCount((prev) => prev + 1);
      } else {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === currentPlayer.id ? { ...p, drinksTaken: p.drinksTaken + 1 } : p
          )
        );
        setTotalDrinksCount((prev) => prev + 1);
      }
    }

    // Next player turn
    if (players.length > 0) {
      setActivePlayerIndex((prev) => (prev + 1) % players.length);
    }
    setCurrentCardIndex((prev) => prev + 1);
  };

  const handleSkipCard = () => {
    setCurrentCardIndex((prev) => prev + 1);
  };

  // Category Toggle
  const handleToggleCategory = (catId: CategoryId) => {
    sounds.playTick();
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
    setCurrentCardIndex(0);
  };

  const handleSelectAllCategories = () => {
    sounds.playTick();
    setSelectedCategories(CATEGORIES_CONFIG.map((c) => c.id));
    setCurrentCardIndex(0);
  };

  // Intensity Toggle
  const handleToggleIntensity = (intensity: IntensityLevel) => {
    sounds.playTick();
    setSelectedIntensities((prev) => {
      if (prev.includes(intensity)) {
        if (prev.length === 1) return prev;
        return prev.filter((i) => i !== intensity);
      } else {
        return [...prev, intensity];
      }
    });
    setCurrentCardIndex(0);
  };

  // Player Management
  const handleAddPlayer = (name: string, avatar: string) => {
    const newPlayer: Player = {
      id: 'p-' + Date.now(),
      name,
      avatar,
      color: 'from-rose-500 to-pink-500',
      sincerityPoints: 0,
      drinksTaken: 0,
      skipsUsed: 0,
    };
    setPlayers((prev) => [...prev, newPlayer]);
    sounds.playSuccess();
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateScore = (id: string, sincerityDelta: number, drinksDelta: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              sincerityPoints: Math.max(0, p.sincerityPoints + sincerityDelta),
              drinksTaken: Math.max(0, p.drinksTaken + drinksDelta),
            }
          : p
      )
    );
    if (drinksDelta > 0) {
      setTotalDrinksCount((prev) => prev + drinksDelta);
      sounds.playDrink();
    }
  };

  // Custom Cards Management
  const handleAddCustomCard = (cardData: Omit<GameCard, 'id' | 'isCustom'>) => {
    const newCard: GameCard = {
      ...cardData,
      id: 'custom-' + Date.now(),
      isCustom: true,
      category: 'personalizadas',
    };
    setCustomCards((prev) => [newCard, ...prev]);
    sounds.playSuccess();
  };

  const handleDeleteCustomCard = (id: string) => {
    setCustomCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddAnonymousQuestion = (questionText: string) => {
    const anonCard: GameCard = {
      id: 'anon-' + Date.now(),
      question: questionText,
      category: 'personalizadas',
      intensity: 'picante',
      punishment: 'Bebe 2 tragos.',
      tag: 'BuzónSecreto',
      target: 'individual',
      isCustom: true,
    };
    setCustomCards((prev) => [anonCard, ...prev]);
  };

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm('¿Reiniciar los marcadores de sinceridad y tragos de todos los jugadores?')) {
      setPlayers((prev) =>
        prev.map((p) => ({
          ...p,
          sincerityPoints: 0,
          drinksTaken: 0,
          skipsUsed: 0,
        }))
      );
      setTotalAnswersCount(0);
      setTotalDrinksCount(0);
      setCurrentCardIndex(0);
      sounds.playFlip();
    }
  };

  const activePlayer = players[activePlayerIndex % (players.length || 1)] || null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          sounds.playFlip();
          setCurrentMode(mode);
        }}
        players={players}
        activePlayerIndex={activePlayerIndex}
        onOpenPlayerModal={() => setIsPlayerModalOpen(true)}
        onOpenQRModal={() => setIsQRModalOpen(true)}
        onOpenCustomCards={() => setIsCustomCardsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onResetGame={handleResetGame}
      />

      {/* Main Content View */}
      <main className="flex-1 flex flex-col justify-start items-center py-4 sm:py-6">
        {currentMode === 'cards' && (
          <div className="w-full flex flex-col items-center">
            <CategoryFilter
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              onSelectAllCategories={handleSelectAllCategories}
              selectedIntensities={selectedIntensities}
              onToggleIntensity={handleToggleIntensity}
              customCardsCount={customCards.length}
            />

            <div className="w-full mt-4 sm:mt-6">
              <CardDeck
                card={currentCard}
                activePlayer={activePlayer}
                onNextCard={handleNextCard}
                onSkipCard={handleSkipCard}
                cardsRemaining={activeDeck.length - (currentCardIndex % activeDeck.length)}
                totalCards={activeDeck.length}
              />
            </div>
          </div>
        )}

        {currentMode === 'voting' && (
          <VotingMode
            cards={allCards}
            players={players}
            onPlayerDrink={(pId, amount) => handleUpdateScore(pId, 0, amount)}
          />
        )}

        {currentMode === 'bomb' && (
          <BombTimerMode
            cards={allCards}
            players={players}
            onPlayerDrink={(pId, amount) => handleUpdateScore(pId, 0, amount)}
          />
        )}

        {currentMode === 'roulette' && (
          <RouletteMode
            cards={allCards}
            players={players}
            onPlayerDrink={(pId, amount) => handleUpdateScore(pId, 0, amount)}
            onPlayerSincere={(pId) => handleUpdateScore(pId, 1, 0)}
          />
        )}
      </main>

      {/* Modals */}
      <PlayerSetupModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        players={players}
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        onUpdateScore={handleUpdateScore}
      />

      <CustomCardsModal
        isOpen={isCustomCardsOpen}
        onClose={() => setIsCustomCardsOpen(false)}
        customCards={customCards}
        onAddCustomCard={handleAddCustomCard}
        onDeleteCustomCard={handleDeleteCustomCard}
      />

      <RoomQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        roomCode={roomCode}
        onAddAnonymousQuestion={handleAddAnonymousQuestion}
      />

      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        players={players}
        totalAnswersCount={totalAnswersCount}
        totalDrinksCount={totalDrinksCount}
      />

      {/* Bottom Subtle Footer */}
      <footer className="w-full py-4 text-center text-xs text-neutral-600 border-t border-neutral-900">
        <p>Sincericidio • Juega con responsabilidad • Bebe con moderación</p>
      </footer>
    </div>
  );
}
