import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ViagemCreateDTO, ViagemResponseDTO } from '../model/viagem';
import { environment } from '../../environments/environment';
import { AtividadeItinerario, AtividadeItinerarioCreateDTO, ItinerarioResponseDto } from '../model/atividade-itinerario';

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
    return this.http.post<ViagemResponseDTO>(`${this.baseUrl}/viagens`, viagem);
  }

  atualizar(
    viagem: ViagemCreateDTO,
    id: number
  ): Observable<ViagemResponseDTO> {
    return this.http.put<ViagemResponseDTO>(
      `${this.baseUrl}/viagens/${id}`,
      viagem
    );
  }

  findById(id: number): Observable<ViagemResponseDTO> {
    return this.http.get<ViagemResponseDTO>(`${this.baseUrl}/viagens/${id}`);
  }

  salvarItemItinerario(item: AtividadeItinerarioCreateDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/viagens/itinerario`, item);
  }

  editarItemItinerario(item: AtividadeItinerarioCreateDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/viagens/itinerario`, item);
  }

  findOndeIrPorViagemId(id: number): Observable<ItinerarioResponseDto[]> {
    return this.http.get<ItinerarioResponseDto[]>(`${this.baseUrl}/viagens/itinerario/${id}`);
  }

  verificaSeItinerarioExiste(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/viagens/verifica-itinerario/${id}`);
  }

   deletar(id: number) {
    return this.http.delete(`${this.baseUrl}/viagens/itinerario/${id}`);
  }
}
