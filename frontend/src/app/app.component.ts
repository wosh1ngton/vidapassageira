import { Component, OnInit } from '@angular/core';
import { OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { PrimeNG } from 'primeng/config';
import { authCodeFlowConfig } from './auth-config';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegistroComponent } from './componentes/registro/registro.component';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, MessageModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  providers: [DialogService]
})
export class AppComponent implements OnInit {
  title = 'frontend';
  usuario: any = {};
  dialogCadastroUsuarioRef: DynamicDialogRef | undefined;

  constructor(
    private primeng: PrimeNG, 
    private oauthService: OAuthService,
    private dialogService: DialogService) {}

  ngOnInit() {
    this.getUserInfo();
    this.primeng.ripple.set(true);
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.oauthService.getAccessToken();
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
    this.dialogCadastroUsuarioRef = this.dialogService.open(RegistroComponent,
      {
        header: 'Cadastrar Usuário',
        width: '50%',
        contentStyle: { 'overflow': 'auto' },
        data: {
          usuario: this.usuario
        },
        closeOnEscape: true,        
        
      }
    )
  }
}
