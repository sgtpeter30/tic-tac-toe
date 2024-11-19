import { Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', component: BoardComponent},
  { path: 'settings', component: SettingsComponent}
];
