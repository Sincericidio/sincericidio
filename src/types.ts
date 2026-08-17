export type CategoryId = 
  | 'picante'
  | 'confesiones'
  | 'fiesta'
  | 'votacion'
  | 'amistad'
  | 'secretos'
  | 'personalizadas';

export type IntensityLevel = 'suave' | 'medio' | 'picante' | 'nuclear';

export interface GameCard {
  id: string;
  category: CategoryId;
  question: string;
  intensity: IntensityLevel;
  punishment?: string; // e.g., "Bebe 2 tragos o haz 10 flexiones"
  tag?: string;
  target?: 'individual' | 'group' | 'couple' | 'left-player' | 'right-player';
  author?: string;
  isCustom?: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  sincerityPoints: number;
  drinksTaken: number;
  skipsUsed: number;
}

export type GameMode = 'cards' | 'bomb' | 'voting' | 'custom' | 'roulette';

export interface GameSettings {
  soundEnabled: boolean;
  intensityFilter: IntensityLevel[];
  activeCategories: CategoryId[];
  drinkPenaltyMultiplier: number;
  timerDurationSeconds: number;
  anonymousQuestionsAllowed: boolean;
  turnMode: 'random' | 'sequential' | 'free';
}

export interface VoteRecord {
  cardId: string;
  question: string;
  votes: Record<string, number>; // playerId -> voteCount
  winnerPlayerId?: string;
}

export interface RoomSession {
  roomCode: string;
  createdAt: number;
  hostName: string;
  players: string[];
  customQuestionsCount: number;
}
