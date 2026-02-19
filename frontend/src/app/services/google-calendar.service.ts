import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  GoogleCalendarStatusDTO,
  GoogleCalendarListDTO,
  GoogleCalendarSelecaoDTO,
  GoogleCalendarEventDTO,
  SugestaoViagemAgendaDTO,
} from '../model/google-calendar';

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  private baseUrl = environment.mainUrlAPI;

  constructor(private http: HttpClient) {}

  getStatus(): Observable<GoogleCalendarStatusDTO> {
    return this.http.get<GoogleCalendarStatusDTO>(
      `${this.baseUrl}/google-calendar/status`
    );
  }

  getAuthUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(
      `${this.baseUrl}/google-calendar/auth-url`
    );
  }

  getCalendarios(): Observable<GoogleCalendarListDTO[]> {
    return this.http.get<GoogleCalendarListDTO[]>(
      `${this.baseUrl}/google-calendar/calendarios`
    );
  }

  salvarSelecao(dto: GoogleCalendarSelecaoDTO): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/google-calendar/calendarios/selecao`,
      dto
    );
  }

  getEventos(inicio: string, fim: string): Observable<GoogleCalendarEventDTO[]> {
    return this.http.get<GoogleCalendarEventDTO[]>(
      `${this.baseUrl}/google-calendar/eventos`,
      { params: { inicio, fim } }
    );
  }

  desconectar(): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/google-calendar/desconectar`
    );
  }

  getPeriodosLivres(): Observable<SugestaoViagemAgendaDTO[]> {
    return this.http.get<SugestaoViagemAgendaDTO[]>(
      `${this.baseUrl}/google-calendar/periodos-livres`
    );
  }
}
