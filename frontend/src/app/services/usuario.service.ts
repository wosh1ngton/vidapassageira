import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioCreateDTO } from '../model/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient) {}
  baseUrl: string = `http://localhost:8070/api`;

  save(usuario: UsuarioCreateDTO): Observable<UsuarioCreateDTO> {
    return this.http.post<UsuarioCreateDTO>(
      `${this.baseUrl}/auth/register`,
      usuario
    );
  }
}
