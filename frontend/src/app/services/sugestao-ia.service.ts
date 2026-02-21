import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  SugestaoIaCreateDTO,
  SugestaoIaResponseDTO,
} from '../model/sugestao-ia';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract.service';

@Injectable({
  providedIn: 'root',
})
export class SugestaoIaService extends AbstractService<SugestaoIaCreateDTO> {
  
  constructor(private http: HttpClient) { super(http,'sugestao-ia')}
  // save(sugestao: SugestaoIaCreateDTO): Observable<SugestaoIaCreateDTO> {
  //   return this.http.post<SugestaoIaCreateDTO>(
  //     `${this.baseUrl}/sugestao-ia`,
  //     sugestao
  //   );
  // }

  findByViagemId(viagemId: number): Observable<SugestaoIaResponseDTO[]> {
    return this.http.get<SugestaoIaResponseDTO[]>(
      `${this.baseUrl}/sugestao-ia/${viagemId}`
    );
  }

  findByViagemIdAndTipoSugestaoId(
    viagemId: number,
    tipoSugestaoId: number
  ): Observable<SugestaoIaResponseDTO> {
    return this.http.get<SugestaoIaResponseDTO>(
      `${this.baseUrl}/sugestao-ia/${viagemId}/${tipoSugestaoId}`
    );
  }

  deletarPorViagemETipo(viagemId: number, tipoSugestaoId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/sugestao-ia/${viagemId}/${tipoSugestaoId}`
    );
  }
}
