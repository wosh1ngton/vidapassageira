import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import {
  SugestaoIaCreateDTO,
  SugestaoIaResponseDTO,
} from '../model/sugestao-ia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SugestaoIaService {
  constructor(private http: HttpClient) {}
  baseUrl: string = environment.mainUrlAPI;

  save(sugestao: SugestaoIaCreateDTO): Observable<SugestaoIaCreateDTO> {
    return this.http.post<SugestaoIaCreateDTO>(
      `${this.baseUrl}/sugestao-ia`,
      sugestao
    );
  }

  findByViagemId(
    viagemId: number    
  ): Observable<SugestaoIaResponseDTO[]> {
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
}
