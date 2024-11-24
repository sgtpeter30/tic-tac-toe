import { computed, Injectable, Signal, signal } from '@angular/core';
import { MindModel } from './models/mind.model';
import { CurrentGameModel, Moves, Player } from './models/current-game.model';
import { winningConditions } from './constants/winning-conditions';
import { StripeModel } from './models/winning-conditions.model';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class MindService {
  private mindStore = signal<MindModel>({
    currentGame: {
      won: false,
      draw: false,
      humanPlayer: 'X',
      activePlayer: 'X',
      board: Array(9).fill(""),
    },
    settings: {
      players: 2,
      level: 'hard'
    }
  })
  public gameReadOnly: Signal<MindModel> = computed(() => this.mindStore())

  testObject: any = {};

  public makeMove(index: number) {
    const currentMind = this.mindStore()
    console.log('activePlayer: ' + currentMind.currentGame.activePlayer)
    if (!currentMind.currentGame.board[index] && !this.isGameEnded(currentMind.currentGame)) {
      currentMind.currentGame.board[index] = currentMind.currentGame.activePlayer;
      currentMind.currentGame = this.checkWonCondidtion(currentMind.currentGame);

      // change player
      if (!this.isGameEnded(currentMind.currentGame)) {
        console.log("change currentMind")
        currentMind.currentGame.activePlayer = this.switchActivePlayer(currentMind.currentGame.activePlayer)
      }

      // if single-player
      if (currentMind.settings.players === 1 && !this.isGameEnded(currentMind.currentGame)) {
        console.log("yep proper settings for AI")
        currentMind.currentGame.board = this.letAIMove(currentMind.currentGame);
        currentMind.currentGame = this.checkWonCondidtion(currentMind.currentGame);
        if (!this.isGameEnded(currentMind.currentGame)) {
          currentMind.currentGame.activePlayer = this.switchActivePlayer(currentMind.currentGame.activePlayer)
        }
        console.log(currentMind.currentGame.activePlayer)
      }
      // this.testAiMove();


      this.mindStore.update(() => currentMind)
    }
  }

  isGameEnded(currentGame: CurrentGameModel) {
    console.log(currentGame)
    return currentGame.won || currentGame.draw
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

  private letAIMove(currentGame: CurrentGameModel): Moves[] {
    const board: Moves[] = Array.from(currentGame.board)
    const aiPlayer = currentGame.activePlayer;
    console.log("AI move")
    console.log(aiPlayer)

    const bestMove = this.findBestMove(board)
    board[bestMove] = aiPlayer;

    return board;
  }

  private findBestMove(board: Moves[]): number {
    let bestScore = Infinity; // Minimalizacja dla O
    let bestMove: number | null = null; // Przechowuje najlepszy ruch
    const availableMoves = this.getAvailableMoves(board);

    for (const move of availableMoves) {
      board[move] = 'O'; // Symulacja ruchu dla O
      const moveScore = this.minMax(board, true); // Sprawdź wynik dla ruchu
      board[move] = ""; // Cofnij ruch      
      if (moveScore < bestScore) {
        bestScore = moveScore;
        bestMove = move;
      }
    }
    if (bestMove === null) {
      return availableMoves[0]; // Fallback
    }
    console.log(`Best move selected: ${bestMove}, Score: ${bestScore}`);
    return bestMove;
  }

  private minMax(board: Moves[], isMaximizing: boolean): number {
    const score = this.evaluateBoardForAI(board);
    if (score !== null) {
      return score; // Zwróć wynik, jeśli gra się skończyła
    }

    const user = this.gameReadOnly().currentGame.humanPlayer
    const availableMoves = this.getAvailableMoves(board);
    if (isMaximizing) {
      let bestScoreX = -Infinity;
      for (const move of availableMoves) {
        board[move] = user; // Symulacja ruchu dla X
        const moveScore = this.minMax(board, false); // Rekurencja
        board[move] = ""; // Cofnij ruch
        bestScoreX = Math.max(bestScoreX, moveScore);
      }
      return bestScoreX;
    } else {
      let bestScore = Infinity; // Minimalizacja dla O
      for (const move of availableMoves) {
        board[move] = this.switchActivePlayer(user); // Symulacja ruchu dla O
        const moveScore = this.minMax(board, true); // Rekurencja
        board[move] = ""; // Cofnij ruch
        bestScore = Math.min(bestScore, moveScore);
      }
      return bestScore;
    }
  };

  private getAvailableMoves(board: string[]): number[] {
    return board.map((value, index) => (value === "" ? index : "")).filter(index => index !== "")
  }

  private evaluateBoardForAI(board: string[], player?: any) {
    const user = this.gameReadOnly().currentGame.humanPlayer
    for (let condition of winningConditions) {
      const [a, b, c] = condition.winIndex;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === user ? 1 : -1;
      }
    }
    if (board.find(item => !item) !== undefined) {
      return null;
    }
    return 0;
  }

  switchActivePlayer(currentActive: "X" | "O") {
    return currentActive === "X" ? "O" : "X"
  }

  public testAI() {
    const mind = this.mindStore();
    mind.settings.players = 1;
    mind.currentGame.humanPlayer = "X",
      mind.currentGame.activePlayer = "O",
      mind.currentGame.draw = false,
      mind.currentGame.won = false,
      mind.currentGame.board = [
        'X', 'O', 'X',
        '', '', '',
        'O', '', 'X'
      ];
    this.mindStore.update(() => mind)

    mind.currentGame.board = this.letAIMove(mind.currentGame);
    console.log("test AI")
    this.mindStore.update(() => mind)
  }
}
