import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAService } from '../../../services/ia.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemResponseDTO } from '../../../model/viagem';
import { ViagemService } from '../../../services/viagem.service';
import {  SugestaoIaCreateDTO,  SugestaoIaResponseDTO} from '../../../model/sugestao-ia';
import { TipoSugestaoIaEnum } from '../../../model/enums/TipoSugestaoIA.enum';
import { SugestaoIaService } from '../../../services/sugestao-ia.service';
import { SugestaoIaComponent } from './sugestao-ia/sugestao-ia.component';
import { MenuItem, MessageService } from 'primeng/api';
import { AtividadeItinerario,  AtividadeItinerarioCreateDTO, ItinerarioResponseDto} from '../../../model/atividade-itinerario';
import { ItinerarioViagemComponent } from "../itinerario-viagem/itinerario-viagem.component";

@Component({
  selector: 'app-planejar-viagem',
  standalone: true,
  imports: [CommonModule, MarkdownModule, PrimeNgModule, SugestaoIaComponent, ItinerarioViagemComponent],
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
    private messageService: MessageService
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
  selectedTipo?: TipoSugestaoIaEnum | undefined;
  itinerarioDaViagem: ItinerarioResponseDto[] = [];
  menuSelecionado: string = 'Onde Ficar?';
  hasItinerario: boolean = false;
  setMenuSelecionado(label: string) {
    this.menuSelecionado = label;
    console.log('selecao: ', this.menuSelecionado);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params:any) => {
      this.viagemId = params.get('id');
      this.getViagemById();
      this.getSugestaoByViagemId();
      this.verificaExistenciaItinerarioDaViagem();
    });
    if (!this.selectedTipo) {
      this.selectedTipo = TipoSugestaoIaEnum.ONDE_FICAR;     
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
          if(this.hasItinerario) {            
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
      .subscribe(value => this.hasItinerario = value);
    
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
      next: (item) => {
        this.itinerarioDaViagem = item;
        console.log(this.itinerarioDaViagem);
        return item;
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
    const tipoSugestaoName = TipoSugestaoIaEnum[tipoSugestao!];
    this.iaService
      .gerarOpiniaoStream(this.viagemId, tipoSugestaoName)
      .subscribe({
        next: (chunk: string) => {
          const decodedChunk = JSON.parse(chunk);
          resultado += decodedChunk;

          const tipo = tipoSugestao;
          this.cdRef.detectChanges();
          this.sugestoes.set(tipo!, resultado);
        },
        error: (err) => {
          console.error('Erro:', err);
          this.resultado = 'Erro ao gerar opinião. Tente novamente mais tarde.';
          this.cdRef.detectChanges();
        },
      });
  }

  gerarOpiniaoOndeIr(tipoSugestao: TipoSugestaoIaEnum | undefined) {
    
    this.selectedTipo = tipoSugestao;
    this.rawResultado = '';
    // this.tipoSugestaoSelected = tipoSugestao;
    this.atividades = [];
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
          this.rawResultado =
            'Erro ao gerar opinião. Tente novamente mais tarde.';
          this.cdRef.detectChanges();
        },
        complete: () => {
          this.parsearFormatarItinerario();
          this.cdRef.detectChanges();
        },
      });
  }

  selectTipo(tipo: TipoSugestaoIaEnum) {
    this.selectedTipo = tipo;
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
      descricao: '',
      melhorHorario: '',
    };

    linhas.forEach((linha) => {
      if (linha.includes(':')) {
        const [key, ...valueParts] = linha.split(':');
        const value = valueParts.join(':').trim();

        switch (key.trim()) {
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
    const itemItinerarioDto: AtividadeItinerarioCreateDTO = {
      id: 0,
      nome: item.nome,
      orcamento: this.parseOrcamento(item.orcamento),
      duracao: item.duracao,
      descricao: item.descricao,
      categoria: item.categoria,
      melhorHorario: item.melhorHorario,
      idViagem: this.viagemId,
    };

    this.viagemService.salvarItemItinerario(itemItinerarioDto).subscribe({
      next: (response: any) => {
        console.log('Item salvo com sucesso:', response);
        // Show success message or update UI
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

  private parseOrcamento(orcamento: string): number {
    // Convert "R$ 150,00" to 150.00
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

  // private parseDuracao(duracao: string): number {
  //   // Convert "3 horas" to 3
  //   const match = duracao.match(/(\d+)\s*hora/);
  //   return match ? parseInt(match[1]) : 0;
  // }

  voltar() {
    this.router.navigateByUrl(`viagens`);
  }

  salvarOpiniaoIA(sugestao: string | undefined) {
    this.sugestaoIA = {} as SugestaoIaCreateDTO;
    this.sugestaoIA.idViagem = this.viagemId;
    this.sugestaoIA.sugestao = sugestao;
    this.sugestaoIA.id = 0;
    this.sugestaoIA.tipoSugestaoIaEnum = this.selectedTipo!;

    this.sugestaoIaService.save(this.sugestaoIA).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Registro salvo com sucesso`,
        }),
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
