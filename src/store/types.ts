export type Player = {
  id: number;
  name: string;
  role: string;
};

export type Team = {
  id: string;
  name: string;
  players: Player[];
};

export type MatchesPayload = {
  team1Id: string;
  team2Id: string;
  tossWinner: string;
  tossDecision: "bat" | "bowl";
};
