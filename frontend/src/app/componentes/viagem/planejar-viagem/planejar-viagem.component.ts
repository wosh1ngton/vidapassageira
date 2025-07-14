import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAService } from '../../../services/ia.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemResponseDTO } from '../../../model/viagem';
import { ViagemService } from '../../../services/viagem.service';
import { SugestaoIaCreateDTO,  SugestaoIaResponseDTO} from '../../../model/sugestao-ia';
import { TipoSugestaoIaEnum } from '../../../model/enums/TipoSugestaoIA.enum';
import { SugestaoIaService } from '../../../services/sugestao-ia.service';
import { SugestaoIaComponent } from './sugestao-ia/sugestao-ia.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-planejar-viagem',
  standalone: true,
  imports: [CommonModule, MarkdownModule, PrimeNgModule, SugestaoIaComponent],
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

  resultado = '';
  viagemId: any = {};
  viagem: ViagemResponseDTO | undefined;
  sugestaoIA!: SugestaoIaCreateDTO;
  sugestoesIAResponse: SugestaoIaResponseDTO[] = [];
  sugestoes: Map<TipoSugestaoIaEnum, string> = new Map();
 
  tipoSugestaoSelected: TipoSugestaoIaEnum | undefined;
  tipoSugestaoEnum = TipoSugestaoIaEnum;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.viagemId = params.get('id');
      this.getViagemById();
      this.getSugestaoByViagemId();
    });
  }

  getSugestaoByViagemId() {
    this.sugestaoIaService.findByViagemId(this.viagemId).subscribe((res) => {      
      res.forEach((val) => {
        const tipo = val.idTipoSugestaoIa as TipoSugestaoIaEnum;
        this.sugestoes.set(tipo, val.sugestao)
      });    
    });
  }

  getViagemById() {
    this.viagemService.findById(this.viagemId).subscribe((viagem) => {
      this.viagem = viagem;
    });
  }

  gerarOpiniao(tipoSugestao: TipoSugestaoIaEnum) {
    this.resultado = '';
    this.tipoSugestaoSelected = tipoSugestao;
    const tipoSugestaoName = TipoSugestaoIaEnum[tipoSugestao];
    this.iaService.gerarOpiniaoStream(this.viagemId, tipoSugestaoName).subscribe({
      next: (chunk: string) => {
        const decodedChunk = JSON.parse(chunk);
        this.resultado += decodedChunk;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erro:', err);
        this.resultado = 'Erro ao gerar opinião. Tente novamente mais tarde.';
        this.cdRef.detectChanges();
      },
    });
  }

  voltar() {
    this.router.navigateByUrl(`viagens`);
  }

  salvarOpiniaoIA(sugestao: string) {
    this.sugestaoIA = {} as SugestaoIaCreateDTO;
    this.sugestaoIA.idViagem = this.viagemId;
    this.sugestaoIA.sugestao = sugestao;
    this.sugestaoIA.id = 0;
    this.sugestaoIA.tipoSugestaoIaEnum = this.tipoSugestaoSelected!;

    this.sugestaoIaService.save(this.sugestaoIA).subscribe({
      next: (res) => {this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Registro salvo com sucesso`,
        }),
        this.getSugestaoByViagemId();
      },        
      error: (err) =>  this.messageService.add({        
          severity: 'error',
          summary: 'Erro',
          detail: `${err.error.message}`,        
      })
    });
  }
}
