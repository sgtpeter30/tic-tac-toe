import { computed, effect, EffectRef, Injectable, Signal, signal } from '@angular/core';
import { MindModel } from './models/mind.model';
import { CurrentGameModel } from './models/current-game.model';
import { isEmpty } from 'rxjs';
import { winningConditions } from './constants/winning-conditions';
import { StripeModel } from './models/winning-conditions.model';
import { findBestMove } from './constants/optimal-move-function-copy';

@Injectable({
  providedIn: 'root'
})
export class MindService {
  private mindStore = signal<MindModel>({
    currentGame: {
      won: false,
      draw: false,
      activePlayer: 'X',
      board: Array(9).fill(""),
    },
    settings: {
      players: 2,
      level: 'easy'
    }
  })
  public gameReadOnly: Signal<MindModel> = computed(() => this.mindStore())

  public makeMove(index: number) {
    const currentMind = this.mindStore()
    console.log(currentMind.currentGame.board[index])
    if (!currentMind.currentGame.board[index] && !currentMind.currentGame.won && !currentMind.currentGame.draw) {
      currentMind.currentGame.board[index] = currentMind.currentGame.activePlayer;
      currentMind.currentGame = this.checkWonCondidtion(currentMind.currentGame);
      // if single-player
      if (currentMind.settings.players === 1)
        currentMind.currentGame.board = this.letAIMove(currentMind.currentGame.board);
      // change player
      if (!currentMind.currentGame.won && !currentMind.currentGame.draw && currentMind.settings.players > 1)
        currentMind.currentGame.activePlayer === "X" ? currentMind.currentGame.activePlayer = "O" : currentMind.currentGame.activePlayer = "X";

      this.mindStore.update(() => currentMind)
    }
  }

  private letAIMove(board: string[]) {
    // const currentMind = this.mindStore()
    // console.log(currentMind.currentGame.board)
    // const currBoard = currentMind.currentGame.board
    // const groupSize = 3
    // const board = [];
    // for (const item of currBoard.map((value, index) => ({ index, value }))) {
    // for (let i = 0; i < currBoard.length; i += groupSize) {
    //   const chunk = currBoard.slice(i, i + groupSize);
    //   board.push(chunk);
    // }
    // let board = [ [ 'x', 'o', 'x' ], 
    //           [ 'o', 'o', 'x' ], 
    //           [ '_', '_', '_' ] ]; 
    // console.log(board)
    // const bestMove = findBestMove(board); 
    // console.log(bestMove)
    const bestMove = this.findBestMove(board)
    console.log(bestMove)
    if (bestMove !== -1) {
      board[bestMove] = 'O';
    }else{

    }
    return board
  }

  private checkWonCondidtion(currentGame: CurrentGameModel): CurrentGameModel {
    for (let condition of winningConditions) {
      const [a, b, c] = condition.winIndex;
      const board = currentGame.board;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        currentGame.won = true;
        this.addStripe(condition.stripe)
      }
    }
    console.log(currentGame.board)
    console.log(currentGame.board.find(item => !item))
    if (currentGame.board.find(item => !item) === undefined) {
      console.log("draw")
      currentGame.draw = true;
    }
    return currentGame
  }

  private addStripe(values: StripeModel) {
    document.documentElement.style.setProperty('--won-display', "flex");
    document.documentElement.style.setProperty('--won-top-position', values.top);
    document.documentElement.style.setProperty('--won-left-position', values.left);
    document.documentElement.style.setProperty('--won-rotate', values.rotate);
  }

  public changePlayerNumber() {
    const currentMind = this.mindStore()
    currentMind.settings.players === 2 ? currentMind.settings.players = 1 : currentMind.settings.players = 2;
    this.mindStore.update(() => currentMind)
  }
  public setDifficulty(value: 'easy' | 'medium' | "hard") {
    const currentMind = this.mindStore()
    currentMind.settings.level = value
    this.mindStore.update(() => currentMind)
  }

  public restartGame() {
    const currentMind = this.mindStore()
    currentMind.currentGame.board = Array(9).fill("");
    currentMind.currentGame.won = false;
    currentMind.currentGame.draw = false;
    currentMind.currentGame.activePlayer = "X";
    document.documentElement.style.setProperty('--won-display', "none");
    this.mindStore.update(() => currentMind)
    console.log("restart")
  }


  private findBestMove(board: string[]): number {
    console.log("findBestMove")
    // Implement Minimax algorithm here
    let bestVal = -99999;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      console.log(board[i])
      if (board[i] === "") {
        board[i] = 'O'; // AI's turn
        const moveVal = this.minimax(board, 0, false);
        console.log(moveVal)
        board[i] = ""; // Undo move

        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  }

  private minimax(board: string[], depth: number, isMaximizing: boolean): number {
    const scores: { [key: string]: number } = { X: -10, O: 10, tie: 0 };
    const winner = this.evaluateBoard(board);

    if (winner) return scores[winner];

    if (isMaximizing) {
      let bestVal = -Infinity;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = 'O'; // AI's turn
          bestVal = Math.max(bestVal, this.minimax(board, depth + 1, false));
          board[i] = ""; // Undo move
        }
      }
      return bestVal;
    } else {
      let bestVal = Infinity;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = 'X'; // Player's turn
          bestVal = Math.min(bestVal, this.minimax(board, depth + 1, true));
          board[i] = ""; // Undo move
        }
      }
      return bestVal;
    }
  }
  private evaluateBoard(board: string[]){
    for (let condition of winningConditions) {
      const [a, b, c] = condition.winIndex;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }
}
