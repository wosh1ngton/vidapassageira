import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DestinoCreateDTO, DestinoResponseDTO } from '../model/destino';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DestinosService {
  
  constructor(private http: HttpClient, private oauthService: OAuthService) {}
  baseUrl: string = environment.mainUrlAPI;

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/destinos`);
  }

  save(formData: FormData): Observable<DestinoResponseDTO> {
    return this.http.post<DestinoResponseDTO>(
      `${this.baseUrl}/destinos`,
      formData
    );
  }

  atualizar(formData: FormData, id: number): Observable<DestinoResponseDTO> {
    return this.http.put<DestinoResponseDTO>(
      `${this.baseUrl}/destinos/${id}`,
      formData
    );
  }

  deletar(id: number) {
    return this.http.delete(`${this.baseUrl}/destinos/${id}`);
  }
}
