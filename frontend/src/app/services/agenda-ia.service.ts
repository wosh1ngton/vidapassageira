import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AgendaIAService {
  constructor(private authService: AuthService) {}

  /**
   * Gera sugestoes de destino via streaming (SSE) com base num periodo livre
   * informado manualmente e, opcionalmente, num orcamento por pessoa.
   */
  gerarSugestaoViagemStream(
    inicio: string,
    fim: string,
    orcamento?: number | null
  ): Observable<string> {
    return new Observable<string>((observer) => {
      const controller = new AbortController();
      const token = this.authService.token;

      const params = new URLSearchParams({ inicio, fim });
      if (orcamento != null && orcamento > 0) {
        params.set('orcamento', String(orcamento));
      }

      fetch(`${environment.mainUrlAPI}/agenda-ia/sugestao-viagem?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        signal: controller.signal,
      })
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
      };
    });
  }
}
