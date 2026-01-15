import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioCreateDTO, UsuarioDTO } from '../model/usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient) {}
  baseUrl: string = environment.mainUrlAPI;

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
