import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAService } from '../../../services/ia.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemResponseDTO } from '../../../model/viagem';
import { ViagemService } from '../../../services/viagem.service';
import { SugestaoIaCreateDTO, SugestaoIaResponseDTO } from '../../../model/sugestao-ia';
import { TipoSugestaoIaEnum } from '../../../model/enums/TipoSugestaoIA.enum';
import { SugestaoIaService } from '../../../services/sugestao-ia.service';
import { SugestaoIaComponent } from './sugestao-ia/sugestao-ia.component';

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
    private sugestaoIaService: SugestaoIaService
  ) {}

  resultado = '';
  viagemId: any = {};
  viagem: ViagemResponseDTO | undefined;
  sugestaoIA!: SugestaoIaCreateDTO;
  sugestoesIAResponse: SugestaoIaResponseDTO[] = [];
  ondeFicar: string = "";
  ondeIr: string = "";
  comoChegar: string = "";
  ondeComer: string = "";
  tipoSugestao : number = 0; 
  tipoSugestaoEnum = TipoSugestaoIaEnum;
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.viagemId = params.get('id');
      this.getViagemById();
      this.getSugestaoByViagemId();
    });
  }

  getSugestaoByViagemId() {
    this.sugestaoIaService.findByViagemId(this.viagemId)
      .subscribe((res) => {
        this.ondeFicar = res.filter(val => val.idTipoSugestaoIa === 1).map(val => val.sugestao)['0'];
        this.comoChegar = res.filter(val => val.idTipoSugestaoIa === 2).map(val => val.sugestao)['0'];
        this.ondeIr = res.filter(val => val.idTipoSugestaoIa === 3).map(val => val.sugestao)['0'];
        this.ondeComer = res.filter(val => val.idTipoSugestaoIa === 4).map(val => val.sugestao)['0'];
      });
  }

  getViagemById() {
    this.viagemService.findById(this.viagemId).subscribe((viagem) => {
      this.viagem = viagem;
    });
  }
  

  gerarOpiniao(tipoSugestao: TipoSugestaoIaEnum) {
    this.resultado = '';   
    this.iaService.gerarOpiniaoStream(this.viagemId, tipoSugestao).subscribe({
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
    this.sugestaoIA.id =0;
    this.sugestaoIA.idTipoSugestaoIa = this.tipoSugestao;    
    this.sugestaoIaService.save(this.sugestaoIA)
      .subscribe();
   
  }


}
