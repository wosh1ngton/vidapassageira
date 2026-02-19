import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../shared/prime.module';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { GoogleCalendarService } from '../../services/google-calendar.service';
import { AgendaIAService } from '../../services/agenda-ia.service';
import { ViagemService } from '../../services/viagem.service';
import {
  GoogleCalendarListDTO,
  GoogleCalendarEventDTO,
  SugestaoViagemAgendaDTO,
} from '../../model/google-calendar';
import { DestinoSugerido } from '../../model/viagem';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PrimeNgModule],
  providers: [MessageService, DatePipe],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css',
})
export class AgendaComponent implements OnInit, OnDestroy {
  googleConectado = false;
  googleEmail: string | null = null;
  calendarios: GoogleCalendarListDTO[] = [];
  eventos: GoogleCalendarEventDTO[] = [];
  eventosAgrupados: { data: string; eventos: GoogleCalendarEventDTO[] }[] = [];
  periodosLivres: SugestaoViagemAgendaDTO[] = [];

  loading = false;
  loadingCalendarios = false;
  loadingEventos = false;
  loadingPeriodos = false;
  salvandoSelecao = false;

  // Sugestao IA por periodo
  sugestaoAtiva: number | null = null;
  sugestaoTexto = '';
  sugestaoEmStreaming = false;
  private sugestaoSubscription?: Subscription;

  // Salvar viagem da sugestao
  destinosSugeridos: DestinoSugerido[] = [];
  destinoSelecionado: DestinoSugerido | null = null;
  salvandoViagem = false;

  // Navegacao por mes
  mesAtual = new Date();

  constructor(
    private googleCalendarService: GoogleCalendarService,
    private agendaIAService: AgendaIAService,
    private viagemService: ViagemService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Verificar se veio do callback Google
    this.route.queryParams.subscribe((params) => {
      if (params['google-connected'] === 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Conectado!',
          detail: 'Google Calendar conectado com sucesso.',
        });
      }
    });

    this.verificarConexao();
  }

  ngOnDestroy(): void {
    this.sugestaoSubscription?.unsubscribe();
  }

  verificarConexao(): void {
    this.loading = true;
    this.googleCalendarService.getStatus().subscribe({
      next: (status) => {
        this.googleConectado = status.conectado;
        this.googleEmail = status.email || null;
        this.loading = false;

        if (this.googleConectado) {
          this.carregarCalendarios();
          this.carregarEventos();
          this.carregarPeriodosLivres();
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  conectarGoogle(): void {
    this.googleCalendarService.getAuthUrl().subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao iniciar conexão com Google.',
        });
      },
    });
  }

  desconectarGoogle(): void {
    this.googleCalendarService.desconectar().subscribe({
      next: () => {
        this.googleConectado = false;
        this.googleEmail = null;
        this.calendarios = [];
        this.eventos = [];
        this.eventosAgrupados = [];
        this.periodosLivres = [];
        this.messageService.add({
          severity: 'info',
          summary: 'Desconectado',
          detail: 'Google Calendar desconectado.',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao desconectar.',
        });
      },
    });
  }

  carregarCalendarios(): void {
    this.loadingCalendarios = true;
    this.googleCalendarService.getCalendarios().subscribe({
      next: (calendarios) => {
        this.calendarios = calendarios;
        this.loadingCalendarios = false;
      },
      error: () => {
        this.loadingCalendarios = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar calendários.',
        });
      },
    });
  }

  salvarSelecao(): void {
    const calendarIds = this.calendarios
      .filter((c) => c.selecionado)
      .map((c) => c.calendarId);

    if (calendarIds.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um calendário.',
      });
      return;
    }

    this.salvandoSelecao = true;
    this.googleCalendarService.salvarSelecao({ calendarIds }).subscribe({
      next: () => {
        this.salvandoSelecao = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Salvo!',
          detail: 'Seleção de calendários salva.',
        });
        this.carregarEventos();
        this.carregarPeriodosLivres();
      },
      error: () => {
        this.salvandoSelecao = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar seleção.',
        });
      },
    });
  }

  carregarEventos(): void {
    this.loadingEventos = true;
    const inicio = this.getInicioMes();
    const fim = this.getFimMes();

    this.googleCalendarService.getEventos(inicio, fim).subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.agruparEventosPorData();
        this.loadingEventos = false;
      },
      error: () => {
        this.loadingEventos = false;
      },
    });
  }

  carregarPeriodosLivres(): void {
    this.loadingPeriodos = true;
    this.googleCalendarService.getPeriodosLivres().subscribe({
      next: (periodos) => {
        this.periodosLivres = periodos;
        this.loadingPeriodos = false;
      },
      error: () => {
        this.loadingPeriodos = false;
      },
    });
  }

  mesAnterior(): void {
    this.mesAtual = new Date(
      this.mesAtual.getFullYear(),
      this.mesAtual.getMonth() - 1,
      1
    );
    this.carregarEventos();
  }

  proximoMes(): void {
    this.mesAtual = new Date(
      this.mesAtual.getFullYear(),
      this.mesAtual.getMonth() + 1,
      1
    );
    this.carregarEventos();
  }

  gerarSugestao(index: number, periodo: SugestaoViagemAgendaDTO): void {
    if (this.sugestaoEmStreaming) return;

    this.sugestaoAtiva = index;
    this.sugestaoTexto = '';
    this.sugestaoEmStreaming = true;

    this.sugestaoSubscription?.unsubscribe();
    this.sugestaoSubscription = this.agendaIAService
      .gerarSugestaoViagemStream(periodo.inicioFolga, periodo.fimFolga)
      .subscribe({
        next: (chunk) => {
          try {
            const parsed = JSON.parse(chunk);
            this.sugestaoTexto += parsed;
          } catch {
            this.sugestaoTexto += chunk;
          }
        },
        error: () => {
          this.sugestaoEmStreaming = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao gerar sugestão.',
          });
        },
        complete: () => {
          this.sugestaoEmStreaming = false;
          this.parsearDestinos();
        },
      });
  }

  fecharSugestao(): void {
    this.sugestaoSubscription?.unsubscribe();
    this.sugestaoAtiva = null;
    this.sugestaoTexto = '';
    this.sugestaoEmStreaming = false;
    this.destinosSugeridos = [];
    this.destinoSelecionado = null;
  }

  private parsearDestinos(): void {
    const regex = /\[DESTINOS_JSON\]\s*([\s\S]*?)\s*\[\/DESTINOS_JSON\]/;
    const match = this.sugestaoTexto.match(regex);

    if (match && match[1]) {
      try {
        this.destinosSugeridos = JSON.parse(match[1].trim());
      } catch {
        this.destinosSugeridos = [];
      }
      // Remover o bloco JSON do texto exibido
      this.sugestaoTexto = this.sugestaoTexto.replace(regex, '').trim();
    }
  }

  selecionarDestino(destino: DestinoSugerido): void {
    this.destinoSelecionado =
      this.destinoSelecionado === destino ? null : destino;
  }

  salvarViagemDaAgenda(): void {
    if (!this.destinoSelecionado || this.sugestaoAtiva === null) return;

    const periodo = this.periodosLivres[this.sugestaoAtiva];
    if (!periodo) return;

    this.salvandoViagem = true;
    this.viagemService
      .criarDaAgenda({
        nomeDestino: this.destinoSelecionado.nome,
        localizacao: this.destinoSelecionado.localizacao,
        dataIda: periodo.inicioFolga,
        dataVolta: periodo.fimFolga,
      })
      .subscribe({
        next: () => {
          this.salvandoViagem = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Viagem salva!',
            detail: `Viagem para ${this.destinoSelecionado!.nome} criada com sucesso.`,
          });
          this.destinoSelecionado = null;
        },
        error: () => {
          this.salvandoViagem = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao salvar viagem.',
          });
        },
      });
  }

  get nomeMes(): string {
    return this.datePipe.transform(this.mesAtual, 'MMMM yyyy', '', 'pt-BR') || '';
  }

  get temCalendariosSelecionados(): boolean {
    return this.calendarios.some((c) => c.selecionado);
  }

  private getInicioMes(): string {
    const d = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth(), 1);
    return d.toISOString().split('T')[0];
  }

  private getFimMes(): string {
    const d = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 0);
    return d.toISOString().split('T')[0];
  }

  private agruparEventosPorData(): void {
    const grupos = new Map<string, GoogleCalendarEventDTO[]>();

    for (const evento of this.eventos) {
      const data = evento.inicio
        ? evento.inicio.substring(0, 10)
        : 'Sem data';

      if (!grupos.has(data)) {
        grupos.set(data, []);
      }
      grupos.get(data)!.push(evento);
    }

    this.eventosAgrupados = Array.from(grupos.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, eventos]) => ({ data, eventos }));
  }

  formatarData(dataStr: string): string {
    if (!dataStr || dataStr === 'Sem data') return dataStr;
    const date = new Date(dataStr + 'T00:00:00');
    return this.datePipe.transform(date, 'EEEE, dd/MM', '', 'pt-BR') || dataStr;
  }

  formatarHora(dateTimeStr: string | null): string {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return this.datePipe.transform(date, 'HH:mm', '', 'pt-BR') || '';
  }

  formatarPeriodo(inicio: string, fim: string): string {
    const i = new Date(inicio + 'T00:00:00');
    const f = new Date(fim + 'T00:00:00');
    const di = this.datePipe.transform(i, 'dd/MM/yyyy', '', 'pt-BR') || '';
    const df = this.datePipe.transform(f, 'dd/MM/yyyy', '', 'pt-BR') || '';
    return `${di} a ${df}`;
  }
}
