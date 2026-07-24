import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MessageService } from 'primeng/api';

import { OAuthService } from 'angular-oauth2-oidc';

import { PrimeNgModule } from '../../../shared/prime.module';
import { AgendaIAService } from '../../../services/agenda-ia.service';
import { DestinosService } from '../../../services/destinos.service';
import { ViagemService } from '../../../services/viagem.service';
import { DestinoSugerido } from '../../../model/viagem';

@Component({
  selector: 'app-descobrir-viagem',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, FormsModule, RouterModule, MarkdownModule],
  templateUrl: './descobrir-viagem.component.html',
  styleUrl: './descobrir-viagem.component.css',
})
export class DescobrirViagemComponent {
  periodo: Date[] | null = null;
  orcamento: number | null = null;
  dataMinima: Date = new Date();

  carregando = false;
  textoSugestao = '';
  destinosSugeridos: DestinoSugerido[] = [];
  // Nome do destino em processamento (criando destino + viagem), para feedback no card.
  criandoDestino: string | null = null;

  // Delimitadores do bloco parseavel que a IA anexa ao final da resposta.
  private static readonly INICIO_JSON = '[DESTINOS_JSON]';
  private static readonly FIM_JSON = '[/DESTINOS_JSON]';

  constructor(
    private agendaIAService: AgendaIAService,
    private destinosService: DestinosService,
    private viagemService: ViagemService,
    private oauthService: OAuthService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  get periodoValido(): boolean {
    return !!(this.periodo && this.periodo.length === 2 && this.periodo[0] && this.periodo[1]);
  }

  /**
   * Remove o bloco [DESTINOS_JSON]...[/DESTINOS_JSON] para exibir apenas o texto
   * legivel enquanto a resposta ainda esta sendo transmitida.
   */
  get textoExibicao(): string {
    const inicio = this.textoSugestao.indexOf(DescobrirViagemComponent.INICIO_JSON);
    if (inicio === -1) {
      return this.textoSugestao;
    }
    return this.textoSugestao.substring(0, inicio).trimEnd();
  }

  descobrir(): void {
    if (!this.periodoValido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Período obrigatório',
        detail: 'Selecione a data de ida e a data de volta.',
      });
      return;
    }

    const inicio = this.formatarData(this.periodo![0]);
    const fim = this.formatarData(this.periodo![1]);

    this.carregando = true;
    this.textoSugestao = '';
    this.destinosSugeridos = [];

    this.agendaIAService.gerarSugestaoViagemStream(inicio, fim, this.orcamento).subscribe({
      next: (chunk: string) => {
        this.textoSugestao += JSON.parse(chunk);
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao gerar sugestão:', err);
        this.carregando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível gerar as sugestões. Tente novamente mais tarde.',
        });
        this.cdRef.detectChanges();
      },
      complete: () => {
        this.carregando = false;
        this.extrairDestinos();
        this.cdRef.detectChanges();
      },
    });
  }

  /**
   * Cria a viagem em um clique: cadastra o destino automaticamente (com imagem
   * buscada ou placeholder) e cria a viagem usando o período já selecionado.
   */
  criarViagem(destino: DestinoSugerido): void {
    if (this.criandoDestino || !this.periodoValido) {
      return;
    }

    const sub = this.obterSub();
    if (!sub) {
      this.messageService.add({
        severity: 'error',
        summary: 'Sessão',
        detail: 'Não foi possível identificar o usuário. Faça login novamente.',
      });
      return;
    }

    this.criandoDestino = destino.nome;

    this.destinosService
      .criarAutomatico({
        nome: destino.nome,
        descricao: '',
        localizacao: destino.localizacao ?? '',
      })
      .subscribe({
        next: (destinoCriado) => {
          this.viagemService
            .save({
              id: 0,
              idDestino: destinoCriado.id,
              dataIda: this.periodo![0],
              dataVolta: this.periodo![1],
              sub,
            })
            .subscribe({
              next: () => {
                this.criandoDestino = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Viagem criada!',
                  detail: `Sua viagem para ${destino.nome} foi criada.`,
                });
                this.router.navigateByUrl('/viagens');
              },
              error: (err) => this.tratarErroCriacao(err),
            });
        },
        error: (err) => this.tratarErroCriacao(err),
      });
  }

  private tratarErroCriacao(err: unknown): void {
    console.error('Erro ao criar viagem a partir da sugestão:', err);
    this.criandoDestino = null;
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível criar a viagem. Tente novamente.',
    });
    this.cdRef.detectChanges();
  }

  private obterSub(): string | null {
    const claims = this.oauthService.getIdentityClaims() as { sub?: string } | null;
    return claims?.sub ?? null;
  }

  private extrairDestinos(): void {
    const inicio = this.textoSugestao.indexOf(DescobrirViagemComponent.INICIO_JSON);
    const fim = this.textoSugestao.indexOf(DescobrirViagemComponent.FIM_JSON);
    if (inicio === -1 || fim === -1 || fim <= inicio) {
      return;
    }

    const json = this.textoSugestao
      .substring(inicio + DescobrirViagemComponent.INICIO_JSON.length, fim)
      .trim();

    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        this.destinosSugeridos = parsed.filter((d) => d && d.nome);
      }
    } catch {
      // Bloco ausente ou malformado: apenas nao exibe os cards de acao.
    }
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
