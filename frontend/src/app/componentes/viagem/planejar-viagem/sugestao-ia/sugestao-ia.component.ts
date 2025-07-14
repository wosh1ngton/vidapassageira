import { Component, Input } from '@angular/core';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { TipoSugestaoIaEnum } from '../../../../model/enums/TipoSugestaoIA.enum';

@Component({
  selector: 'app-sugestao-ia',
  standalone: true,
  imports: [PrimeNgModule,CommonModule, MarkdownModule],
  templateUrl: './sugestao-ia.component.html',
  styleUrl: './sugestao-ia.component.css'
})
export class SugestaoIaComponent {

 
  @Input() sugestao: string | undefined;
  @Input() tipoSugestao: TipoSugestaoIaEnum | undefined;
  
}
