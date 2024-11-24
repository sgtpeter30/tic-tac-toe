export interface CurrentGameModel{
  won: boolean,
  draw: boolean,
  humanPlayer: Player
  activePlayer: Player
  board: Moves[],
  strike?: any,
}

export type Player = 'X' | 'O'
export type Moves = 'X' | 'O' | ""

