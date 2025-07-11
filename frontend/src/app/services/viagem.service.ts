import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ViagemCreateDTO, ViagemResponseDTO } from '../model/viagem';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class ViagemService {
  
  constructor(private http: HttpClient) {}
  baseUrl: string = environment.mainUrlAPI;  

  getAll(): Observable<ViagemResponseDTO[]> {
    return this.http.get<ViagemResponseDTO[]>(`${this.baseUrl}/viagens`);
  }

  save(viagem: ViagemCreateDTO): Observable<ViagemResponseDTO> {
    return this.http.post<ViagemResponseDTO>(
      `${this.baseUrl}/viagens`,
      viagem
    );
  }

  atualizar(viagem: ViagemCreateDTO, id: number): Observable<ViagemResponseDTO> {
    return this.http.put<ViagemResponseDTO>(
      `${this.baseUrl}/viagens/${id}`,
      viagem
    );
  }

  findById(id: number): Observable<ViagemResponseDTO> {
    return this.http.get<ViagemResponseDTO>(`${this.baseUrl}/viagens/${id}`);
  }
}
