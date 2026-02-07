import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeNgModule } from './shared/prime.module';
import { MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, PrimeNgModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  providers: [DialogService, MessageService],
})
export class AppComponent implements OnInit {
  title = 'frontend';  
  dialogCadastroUsuarioRef: DynamicDialogRef | undefined;
  menuVisible = false;

  constructor(
    private primeng: PrimeNG,
    private authService: AuthService,

  ) {}

  ngOnInit() {

    this.primeng.ripple.set(true);
    this.menuVisible = false; // Menu sempre inicia fechado
    // Carrega usuário se houver token válido, mas não inicia login automaticamente
    this.authService.initialize();
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    localStorage.setItem('menu', this.menuVisible ? 'open' : 'closed');
  }  

  logout() {
    this.authService.logout();
  }

  get token() {
    return this.authService.token;
  }

   get usuario() {
    return this.authService.usuario;
    }

   
}
