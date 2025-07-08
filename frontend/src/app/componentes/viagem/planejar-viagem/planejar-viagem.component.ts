import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAService } from '../../../services/ia.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-planejar-viagem',
  standalone: true,
  imports: [CommonModule, MarkdownModule, PrimeNgModule],
  templateUrl: './planejar-viagem.component.html',
  styleUrl: './planejar-viagem.component.css',
})
export class PlanejarViagemComponent implements OnInit {
  
  constructor(private iaService: IAService,   
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
    ) {}


  resultado = '';
  destinoId : any = {};

  ngOnInit(): void {   
    this.activatedRoute.paramMap.subscribe(params => {
      this.destinoId = params.get("id");
    });    
  }

  gerarOpiniaoOndeIr() {
    this.resultado = '';
    this.iaService.ondeIrStream(this.destinoId).subscribe({
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
}
