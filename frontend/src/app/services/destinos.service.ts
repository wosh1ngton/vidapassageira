import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DestinoCreateDTO, DestinoResponseDTO } from '../model/destino';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class DestinosService {
  
  constructor(private http: HttpClient, private oauthService: OAuthService) {}
  baseUrl: string = `http://localhost:8070/api`;

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/destinos`);
  }

  save(destino: DestinoCreateDTO): Observable<DestinoResponseDTO> {
    return this.http.post<DestinoResponseDTO>(
      `${this.baseUrl}/destinos`,
      destino
    );
  }
}
