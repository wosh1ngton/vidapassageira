import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { UsuarioDTO } from '../model/usuario';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario: UsuarioDTO | null = null;
  private loginTriggered = false;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  /**
   * Inicializa o serviço carregando o usuário se houver token válido
   */
  initialize() {
    if (this.oauthService.hasValidAccessToken()) {
      this.loadUser();
    }
  }

  initLoginFlow() {

    if (this.loginTriggered) {
      return;
    }

    if (this.oauthService.hasValidAccessToken()) {
      this.loadUser();
      return;
    }

    this.loginTriggered = true;
    this.oauthService.initCodeFlow();
  }

  private loadUser() {
    const claims: any = this.oauthService.getIdentityClaims();

    if (!claims) return;

    this.usuario = {
      id: claims.sub,
      email: claims.email,
      username: claims.name || claims.preferred_username,
    };

    this.usuarioService
      .verificaSeUsuarioExiste(this.usuario.id)
      .subscribe((exists) => {
        if (!exists) {
          this.usuarioService.saveUsuarioAplicacao(this.usuario!).subscribe();
        }
      });
  }

  logout() {
    this.oauthService.logOut();
  }

  get token() {
    return this.oauthService.getAccessToken();
  }

  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
