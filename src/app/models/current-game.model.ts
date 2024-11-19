export interface CurrentGameModel{
  won: boolean,
  draw: boolean,
  activePlayer: 'X' | 'O'
  board: string[],
  strike?: any,
}