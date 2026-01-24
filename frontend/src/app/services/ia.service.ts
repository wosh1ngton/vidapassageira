import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TipoSugestaoIaEnum } from '../model/enums/TipoSugestaoIA.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IAService {
  constructor(private http: HttpClient,private authService: AuthService) {} 



   gerarOpiniaoStream(
  idDestino: number,
  tipoSugestao: string
): Observable<string> {
  return new Observable<string>((observer) => {
    const controller = new AbortController();

    const token = this.authService.token;

    fetch(
      `${environment.mainUrlAPI}/planejamento-ia/gerar-async?destino=${encodeURIComponent(
        idDestino
      )}&tipo=${encodeURIComponent(tipoSugestao)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        signal: controller.signal,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let buffer = '';

        const read = () => {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                observer.complete();
                return;
              }

              buffer += decoder.decode(value, { stream: true });

              const events = buffer.split('\n\n');
              buffer = events.pop() || '';

              for (const event of events) {
                if (event.startsWith('data:')) {
                  const data = event.replace(/^data:\s*/, '');
                  observer.next(data);
                }

                if (event.startsWith('event: complete')) {
                  observer.complete();
                  controller.abort();
                }
              }

              read();
            })
            .catch((err) => observer.error(err));
        };

        read();
      })
      .catch((err) => observer.error(err));

    return () => {
      controller.abort();
      console.log('Stream aborted');
    };
  });
}



}
