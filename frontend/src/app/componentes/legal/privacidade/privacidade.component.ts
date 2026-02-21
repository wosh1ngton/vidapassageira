import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacidade',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './privacidade.component.html',
  styleUrl: './privacidade.component.css',
})
export class PrivacidadeComponent {
  lastUpdate = '21 de Fevereiro de 2026';
}
