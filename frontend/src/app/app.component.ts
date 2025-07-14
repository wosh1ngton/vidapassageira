import { Component, OnInit } from '@angular/core';
import { OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { PrimeNG } from 'primeng/config';
import { authCodeFlowConfig } from './auth-config';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegistroComponent } from './componentes/registro/registro.component';
import { PrimeNgModule } from './shared/prime.module';
import { MessageService } from 'primeng/api';

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
  usuario: any = {};
  dialogCadastroUsuarioRef: DynamicDialogRef | undefined;

  constructor(
    private primeng: PrimeNG,
    private oauthService: OAuthService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.primeng.ripple.set(true);
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setupAutomaticSilentRefresh();

    try {

      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      if (this.oauthService.hasValidAccessToken()) {
        this.getUserInfo();
      } else {
       
        if (this.oauthService.state && location.hash.includes('error=')) {
          console.error('Erro de autenticação:', location.hash);          
        }
      }
    } catch (error) {
      console.error('OAuth initialization error:', error);      
    }

    
    this.oauthService.events.subscribe((event) => {
      if (event.type === 'token_received') {
        console.log('Novo token recebido');
        this.getUserInfo();
      }
      if (event.type === 'token_refresh_error') {
        console.error('Token refresh falhou:', event);
      }
    });
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  getUserInfo() {
    const claims: any = this.oauthService.getIdentityClaims();

    if (claims) {
      this.usuario.email = claims['email'];
      this.usuario.name = claims['name'];
    }
  }

  logout() {
    this.oauthService.logOut();
  }

  get token() {
    return this.oauthService.getAccessToken();
  }

  cadastrar() {
    this.dialogCadastroUsuarioRef = this.dialogService.open(RegistroComponent, {
      width: '50%',
      header: 'Cadastro de Usuário',

      closable: true,
    });
    this.dialogCadastroUsuarioRef.onClose.subscribe((response) => {
      if (response?.sucesso) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Usuário criado com sucesso`,
        });
      }
    });
  }
}
