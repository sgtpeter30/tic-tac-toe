import { Component, inject } from '@angular/core';
import { MindService } from '../mind.service';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSlideToggleModule, 
    MatButtonToggleModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private mindService = inject(MindService);
  gameInfo = this.mindService.gameReadOnly()

  restartGame() {
    this.mindService.restartGame()
  }

  triggerChangePlayerNumber(){
    this.mindService.changePlayerNumber();
  }

  triggerSetDifficulty(event: any){
    console.log(event.value)
    this.mindService.setDifficulty(event.value)
  }
}
