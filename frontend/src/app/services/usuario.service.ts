import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioCreateDTO, UsuarioDTO } from '../model/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient) {}
  baseUrl: string = `http://localhost:8070/api`;

  save(usuario: UsuarioCreateDTO | UsuarioDTO): Observable<UsuarioCreateDTO> {
    return this.http.post<UsuarioCreateDTO>(
      `${this.baseUrl}/auth/register`,
      usuario
    );
  }

  saveUsuarioAplicacao(usuario: UsuarioDTO): Observable<UsuarioCreateDTO> {
    return this.http.post<UsuarioCreateDTO>(
      `${this.baseUrl}/usuarios`,
      usuario
    );
  }

   verificaSeUsuarioExiste(sub: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/usuarios/verifica-existencia/${sub}`);
  }

 

  
}
