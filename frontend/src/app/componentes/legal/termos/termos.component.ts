import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './termos.component.html',
  styleUrl: './termos.component.css',
})
export class TermosComponent {
  lastUpdate = '06 de Fevereiro de 2026';
}
