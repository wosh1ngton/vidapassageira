import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeNgModule } from './shared/prime.module';
import { MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { AppInfoService } from './services/app-info.service';

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
  currentYear = new Date().getFullYear();
  mostrarBannerBeta = true;
  appVersion = '';

  constructor(
    private primeng: PrimeNG,
    private authService: AuthService,
    private appInfoService: AppInfoService
  ) {}

  ngOnInit() {

    this.primeng.ripple.set(true);
    this.menuVisible = false; // Menu sempre inicia fechado
    // Carrega usuário se houver token válido, mas não inicia login automaticamente
    this.authService.initialize();

    // Verificar se o banner beta foi fechado anteriormente
    const bannerFechado = localStorage.getItem('betaBannerFechado');
    if (bannerFechado === 'true') {
      this.mostrarBannerBeta = false;
    }

    // Buscar versão da aplicação
    this.appInfoService.getAppInfo().subscribe({
      next: (info) => {
        this.appVersion = info.version;
      },
      error: () => {
        this.appVersion = '1.0.0'; // Fallback se API falhar
      }
    });
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    localStorage.setItem('menu', this.menuVisible ? 'open' : 'closed');
  }

  fecharMenu() {
    this.menuVisible = false;
    localStorage.setItem('menu', 'closed');
  }

  logout() {
    this.authService.logout();
  }

  fecharBannerBeta() {
    this.mostrarBannerBeta = false;
    localStorage.setItem('betaBannerFechado', 'true');
  }

  get token() {
    return this.authService.token;
  }

   get usuario() {
    return this.authService.usuario;
    }


}
