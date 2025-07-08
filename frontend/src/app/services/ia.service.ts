import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IAService {
  constructor(private http: HttpClient) {}

  ondeIr(destino: string): Observable<string> {
    return this.http.post<string>(
      `${environment.mainUrlAPI}/planejamento-ia/onde-ir-async`,
      destino,
      { responseType: 'text' as 'json' }
    );
  }

  ondeIrStream(idDestino: number): Observable<string> {
    return new Observable<string>((observer) => {
      const eventSource = new EventSource(
        `${
          environment.mainUrlAPI
        }/planejamento-ia/onde-ir-async?destino=${encodeURIComponent(idDestino)}`
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
