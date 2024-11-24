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

  makeMove(index: number) {
    if(!(this.gameState.won || this.gameState.draw)){
      this.mindService.makeMove(index);
    }
  }
}
