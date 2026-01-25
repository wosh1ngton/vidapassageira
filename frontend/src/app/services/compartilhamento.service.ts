import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ViagemCompartilhamentoDTO } from '../model/viagem-compartilhamento';

@Injectable({
  providedIn: 'root',
})
export class CompartilhamentoService {
  constructor(private http: HttpClient) {}
  baseUrl: string = environment.mainUrlAPI;

  compartilharViagem(compartilhamento: ViagemCompartilhamentoDTO) : Observable<ViagemCompartilhamentoDTO> {
    return this.http.post<ViagemCompartilhamentoDTO>(`${this.baseUrl}/compartilhamento`, compartilhamento); 
  }
}
