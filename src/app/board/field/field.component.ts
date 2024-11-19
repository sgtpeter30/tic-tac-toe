import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent {
  @Input() 
  value!: string;
  @Input() 
  disabled!: boolean;
}
