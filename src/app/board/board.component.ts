import { Component, EffectRef, inject, Signal } from '@angular/core';
import { FieldComponent } from "./field/field.component";
import {MatButtonModule} from '@angular/material/button';
import { MindService } from '../mind.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    FieldComponent,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  private mindService = inject(MindService)
  gameState = this.mindService.gameReadOnly().currentGame

  // get player() {
    // return this.xIsNext ? 'X' : 'O';
  // }

  makeMove(index: number) {
    this.mindService.makeMove(index);
    // if (!this.fields[index] && !this.winner) {
    //   this.fields[index] = this.player;
    //   this.xIsNext = !this.xIsNext;
    //   this.winner = this.calculateWinner();
    //   console.log("now AI move")
    //   if (!this.winner) {
    //     console.log("funcutoi")
    //     this.aiMove();
    //   }
    // }
  }
}
