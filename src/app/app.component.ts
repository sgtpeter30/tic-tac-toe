import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BoardComponent } from "./board/board.component";
import { SettingsComponent } from "./settings/settings.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatTabsModule,
    BoardComponent,
    SettingsComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tic-tac-toe';
}
