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

  buscarUsuario(nome: string): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.baseUrl}/usuarios/busca-usuario?nome=${nome}`);
  }

  excluirConta(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/usuarios/excluir-conta`);
  }

  exportarDados(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/exportar-dados`);
  }
}
