import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAService } from '../../../services/ia.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemResponseDTO } from '../../../model/viagem';
import { ViagemService } from '../../../services/viagem.service';
import {
  SugestaoIaCreateDTO,
  SugestaoIaResponseDTO,
} from '../../../model/sugestao-ia';
import { TipoSugestaoIaEnum } from '../../../model/enums/TipoSugestaoIA.enum';
import { SugestaoIaService } from '../../../services/sugestao-ia.service';
import { SugestaoIaComponent } from './sugestao-ia/sugestao-ia.component';
import { MenuItem, MessageService } from 'primeng/api';
import {
  AtividadeItinerario,
  AtividadeItinerarioCreateDTO,
  AtividadeItinerarioEditarDTO,
  ItinerarioResponseDto,
} from '../../../model/atividade-itinerario';
import { ItinerarioViagemComponent } from '../itinerario-viagem/itinerario-viagem.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ItinerarioFormComponent } from '../itinerario-viagem/form-itinerario-viagem/form-itinerario-viagem.component';
import { DateUtil } from '../../../shared/util/date-util';


@Component({
  selector: 'app-planejar-viagem',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    PrimeNgModule,
    SugestaoIaComponent,
    ItinerarioViagemComponent,
  ],
  templateUrl: './planejar-viagem.component.html',
  styleUrl: './planejar-viagem.component.css',
})
export class PlanejarViagemComponent implements OnInit {
  constructor(
    private iaService: IAService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viagemService: ViagemService,
    private sugestaoIaService: SugestaoIaService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  
  rawResultado = '';
  viagemId: any = {};
  viagem: ViagemResponseDTO | undefined;
  sugestaoIA!: SugestaoIaCreateDTO;
  sugestoesIAResponse: SugestaoIaResponseDTO[] = [];
  sugestoes: Map<TipoSugestaoIaEnum, string> = new Map();
  sugestoesIds: Map<TipoSugestaoIaEnum, number> = new Map();
  atividades: AtividadeItinerario[] = [];
  resultado: string = '';
  tipoSugestaoSelected: TipoSugestaoIaEnum | undefined;
  tipoSugestaoEnum = TipoSugestaoIaEnum;
  items: MenuItem[] | undefined;
  selectedSubMenu?: TipoSugestaoIaEnum | undefined;
  itinerarioDaViagem: ItinerarioResponseDto[] = [];
  menuSelecionado: string = 'Onde Ficar?';
  hasItinerario: boolean = false;
  ref: DynamicDialogRef | undefined;
  exibirBtnSalvarOpiniaoIA: boolean = false;
  loadingIA: boolean = false;
  loadingMessage: string = '';

  setMenuSelecionado(label: string) {
    this.menuSelecionado = label;
    console.log('selecao: ', this.menuSelecionado);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.viagemId = params.get('id');
      this.getViagemById();
      this.getSugestaoByViagemId();
      this.verificaExistenciaItinerarioDaViagem();
    });
    if (!this.selectedSubMenu) {
      this.selectedSubMenu = TipoSugestaoIaEnum.ONDE_FICAR;
    }
    this.inicializarMenu();
  }

  isMenuActive(label: string): boolean {
    return this.menuSelecionado === label;
  }

  private inicializarMenu() {
    this.items = [
      {
        label: 'Onde Ficar?',
        icon: 'pi pi-home',
        command: () => {
          this.selectTipo(this.tipoSugestaoEnum.ONDE_FICAR);
          this.setMenuSelecionado('Onde Ficar?');
        },
      },
      {
        label: 'Como chegar?',
        icon: 'pi pi-map-marker',
        command: () => {
          this.selectTipo(this.tipoSugestaoEnum.COMO_CHEGAR);
          this.setMenuSelecionado('Como chegar?');
        },
      },
      {
        label: 'Onde Ir?',
        icon: 'pi pi-search',
        command: () => {
          this.selectTipo(this.tipoSugestaoEnum.ONDE_IR);
          this.setMenuSelecionado('Onde Ir?');
          if (this.hasItinerario) {
            this.getOndeIr();
          }
        },
      },
      {
        label: 'Onde Comer?',
        icon: 'pi pi-star',
        command: () => {
          this.selectTipo(this.tipoSugestaoEnum.ONDE_COMER);
          this.setMenuSelecionado('Onde Comer?');
        },
      },
    ];
  }

  verificaExistenciaItinerarioDaViagem(): void {
    this.viagemService.verificaSeItinerarioExiste(this.viagemId)
      .subscribe((value) => (this.hasItinerario = value));
  }

  adicionarItemItinerario(): void {
    this.ref = this.dialogService.open(ItinerarioFormComponent, {
      header: 'Adicionar item Itinerário',
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    this.ref.onClose.subscribe((res) => {
      console.log('teste iii');
      this.getOndeIr();
    });
  }

  getSugestaoByViagemId() {
    this.sugestaoIaService.findByViagemId(this.viagemId).subscribe((res) => {
      res.forEach((val) => {
        const tipo = val.idTipoSugestaoIa as TipoSugestaoIaEnum;
        this.sugestoes.set(tipo, val.sugestao);
        this.sugestoesIds.set(tipo, val.id);
      });
   
    });
  }

  getViagemById() {
    this.viagemService.findById(this.viagemId).subscribe((viagem) => {
      this.viagem = viagem;
    });
  }

  getOndeIr() {
    this.viagemService.findOndeIrPorViagemId(this.viagemId).subscribe({

      next: (item: ItinerarioResponseDto[]) => {
        this.itinerarioDaViagem = item.sort((a, b) => {
          return new Date(a.dia).getDate() - new Date(b.dia).getDate();
        });        
      },
      error: (err) => {
        console.error('um erro ocorreu ', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao recuperar itinerário',
        });
      },
    });
  }

  gerarOpiniao(tipoSugestao: TipoSugestaoIaEnum | undefined) {
    let resultado = '';
    this.tipoSugestaoSelected = tipoSugestao;
    this.loadingIA = true;

    // Define mensagem de loading baseada no tipo de sugestão
    switch (tipoSugestao) {
      case TipoSugestaoIaEnum.ONDE_FICAR:
        this.loadingMessage = 'Buscando melhores opções de hospedagem...';
        break;
      case TipoSugestaoIaEnum.COMO_CHEGAR:
        this.loadingMessage = 'Analisando rotas e transporte...';
        break;
      case TipoSugestaoIaEnum.ONDE_COMER:
        this.loadingMessage = 'Procurando restaurantes e gastronomia local...';
        break;
      default:
        this.loadingMessage = 'Gerando sugestões...';
    }

    const tipoSugestaoName = TipoSugestaoIaEnum[tipoSugestao!];
    this.iaService
      .gerarOpiniaoStream(this.viagemId, tipoSugestaoName)
      .subscribe({
        next: (chunk: string) => {
          const decodedChunk = JSON.parse(chunk);
          resultado += decodedChunk;

          const tipo = tipoSugestao;

          this.sugestoes.set(tipo!, resultado);
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Erro:', err);
          this.loadingIA = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao gerar sugestão. Tente novamente mais tarde.'
          });
          this.cdRef.detectChanges();
        },
        complete: () => {
          this.loadingIA = false;
          this.loadingMessage = '';
          this.exibirBotaoSalvarOpiniao(true);
          this.cdRef.detectChanges();
        },
      });
  }

  gerarOpiniaoOndeIr(tipoSugestao: TipoSugestaoIaEnum | undefined) {
    this.selectedSubMenu = tipoSugestao;
    this.rawResultado = '';
    this.atividades = [];
    this.loadingIA = true;
    this.loadingMessage = 'Preparando seu itinerário...';
    const tipoSugestaoName = TipoSugestaoIaEnum[tipoSugestao!];

    this.iaService
      .gerarOpiniaoStream(this.viagemId, tipoSugestaoName)
      .subscribe({
        next: (chunk: string) => {
          const decodedChunk = JSON.parse(chunk);
          this.rawResultado += decodedChunk;
          this.resultado = this.rawResultado.replace(/\n/g, '<br>');
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Erro:', err);
          this.loadingIA = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao gerar itinerário. Tente novamente mais tarde.'
          });
          this.cdRef.detectChanges();
        },
        complete: () => {
          this.parsearFormatarItinerario();
          this.salvarTodosItensItinerario();
        },
      });
  }

  selectTipo(tipo: TipoSugestaoIaEnum) {
    this.selectedSubMenu = tipo;
  }

  private parsearFormatarItinerario(): void {
    const blocos = this.rawResultado.split(/\n\n+/);
    blocos.forEach((bloco) => {
      const item = this.parsearItemItinerario(bloco);
      this.atividades.push(item);
    });
    this.resultado = '';
    this.cdRef.detectChanges();
  }

  private parsearItemItinerario(bloco: string): AtividadeItinerario {
    const linhas = bloco.split('\n');
    const item: AtividadeItinerario = {
      nome: '',
      orcamento: '',
      duracao: '',
      categoria: '',
      dia: null,
      descricao: '',
      melhorHorario: '',
    };

    linhas.forEach((linha) => {
      if (linha.includes(':')) {
        const [key, ...valueParts] = linha.split(':');
        const value = valueParts.join(':').trim();

        switch (key.trim().replace('*', '')) {
          case 'Passeio':
            item.nome = value;
            break;
          case 'Orçamento':
            item.orcamento = value;
            break;
          case 'Duração':
            item.duracao = value;
            break;
          case 'Categoria':
            item.categoria = value;
            break;
          case 'Dia':
            item.dia = DateUtil.dateConstructor(value);
            break;
          case 'Descrição':
            item.descricao = value;
            break;
          case 'Melhor horário':
            item.melhorHorario = value;
            break;
        }
      }
    });
    return item;
  }

  salvarItemItinerario(item: AtividadeItinerario): void {
    const itemItinerarioDto: AtividadeItinerarioEditarDTO = {
      id: 0,
      nome: item.nome,
      orcamento: this.parseOrcamento(item.orcamento),
      duracao: item.duracao,
      descricao: item.descricao,
      categoria: item.categoria,
      dia: item.dia.toISOString(),
      melhorHorario: item.melhorHorario,
      idViagem: this.viagemId,
    };

    this.viagemService.salvarItemItinerario(itemItinerarioDto).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${item.nome} salvo no itinerário!`,
        });
      },
      error: (err: any) => {
        console.error('Erro ao salvar item:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar item no itinerário',
        });
      },
    });
  }

  salvarTodosItensItinerario(): void {
    if (this.atividades.length === 0) {
      this.loadingIA = false;
      this.loadingMessage = '';
      return;
    }

    this.loadingMessage = 'Salvando itinerário...';
    let itemsSalvos = 0;
    let erros = 0;

    this.atividades.forEach((item) => {
      const itemItinerarioDto: AtividadeItinerarioEditarDTO = {
        id: 0,
        nome: item.nome,
        orcamento: this.parseOrcamento(item.orcamento),
        duracao: item.duracao,
        descricao: item.descricao,
        categoria: item.categoria,
        dia: item.dia.toISOString(),
        melhorHorario: item.melhorHorario,
        idViagem: this.viagemId,
      };

      this.viagemService.salvarItemItinerario(itemItinerarioDto).subscribe({
        next: () => {
          itemsSalvos++;

          // Quando todos os itens forem processados
          if (itemsSalvos + erros === this.atividades.length) {
            this.finalizarSalvamentoItinerario(itemsSalvos, erros);
          }
        },
        error: (err: any) => {
          console.error('Erro ao salvar item:', err);
          erros++;

          // Quando todos os itens forem processados
          if (itemsSalvos + erros === this.atividades.length) {
            this.finalizarSalvamentoItinerario(itemsSalvos, erros);
          }
        },
      });
    });
  }

  private finalizarSalvamentoItinerario(itemsSalvos: number, erros: number): void {
    this.loadingIA = false;
    this.loadingMessage = '';
    this.atividades = [];
    this.resultado = '';

    if (itemsSalvos > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Itinerário Criado!',
        detail: `${itemsSalvos} ${itemsSalvos === 1 ? 'atividade foi adicionada' : 'atividades foram adicionadas'} ao seu itinerário`,
      });
      this.getOndeIr();
      this.verificaExistenciaItinerarioDaViagem();
    }

    if (erros > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: `${erros} ${erros === 1 ? 'item falhou' : 'itens falharam'} ao salvar`,
      });
    }

    this.cdRef.detectChanges();
  }

  private parseOrcamento(orcamento: string): number {    
    const cleanValue = orcamento
      .replace('R$', '')
      .replace('.', '')
      .replace(',', '.')
      .trim();

    if (orcamento.toLowerCase().includes('gratuito') || cleanValue === '0') {
      return 0;
    }

    return parseFloat(cleanValue) || 0;
  }



  voltar() {
    this.router.navigateByUrl(`viagens`);
  }

  private exibirBotaoSalvarOpiniao(valor: boolean): void {
    this.exibirBtnSalvarOpiniaoIA = valor;    
  }

  salvarOpiniaoIA(sugestao: string | undefined) {
    this.sugestaoIA = {} as SugestaoIaCreateDTO;
    this.sugestaoIA.idViagem = this.viagemId;
    this.sugestaoIA.sugestao = sugestao;
    this.sugestaoIA.id = 0;
    this.sugestaoIA.tipoSugestaoIaEnum = this.selectedSubMenu!;

    this.sugestaoIaService.save(this.sugestaoIA).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Registro salvo com sucesso`,
        }),
        this.exibirBotaoSalvarOpiniao(false);
        this.getSugestaoByViagemId();
      },
      error: (err) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `${err.error.message}`,
        }),
      
    });
  }

  
}
