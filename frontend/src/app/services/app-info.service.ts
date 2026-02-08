import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppInfo } from '../model/app-info';

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {

  private apiUrl = `${environment.mainUrlAPI}/app`;

  constructor(private http: HttpClient) { }

  /**
   * Busca informações da aplicação (versão, nome, descrição)
   * Endpoint público - não requer autenticação
   */
  getAppInfo(): Observable<AppInfo> {
    return this.http.get<AppInfo>(`${this.apiUrl}/info`);
  }

}
