import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { TipoSugestaoIaEnum } from '../model/enums/TipoSugestaoIA.enum';

@Injectable({
  providedIn: 'root',
})
export class IAService {
  constructor(private http: HttpClient) {} 


   gerarOpiniaoStream(idDestino: number, tipoSugestao: string): Observable<string> {
    return new Observable<string>((observer) => {
      const eventSource = new EventSource(
        `${
          environment.mainUrlAPI
        }/planejamento-ia/gerar-async?destino=${encodeURIComponent(idDestino)}&tipo=${encodeURIComponent(tipoSugestao)}`
      );

      eventSource.onmessage = (event) => {        
        const data = event.data;        
        observer.next(data);
      };

      eventSource.onerror = () => {        
        eventSource.close();
      };

      return () => {
        eventSource.close();
        console.log('EventSource cleaned up');
      };
    });
  }


}
