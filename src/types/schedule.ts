export type TeamName = "green" | "white";

export interface Game {
  game: string;
  date: string;
  opponent: string;
  time: string;
  location: string;
  logo: string;
  masonScore: string;
  opponentScore: string;

  // Optional Hudl film for this game
  hudl?: string;
}

export interface Schedule {
  green: Game[];
  white: Game[];
}

export interface PlayCard {
  name: string;
  videoUrl: string;
}

export interface ScheduleViewProps {
  team: TeamName;
}