import {
  afterRender,
  Component,
  ElementRef,
  EventEmitter,
  model,
  Output,
  viewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { DestinosService } from '../../../../services/destinos.service';
import { DestinoCreateDTO } from '../../../../model/destino';

@Component({
  selector: 'app-form-destino',
  imports: [CommonModule, FormsModule, PrimeNgModule],
  templateUrl: './form-destino.component.html',
  styleUrl: './form-destino.component.css',
})
export class FormDestinoComponent {
  modalStatus = model(false);
  visible: boolean = false;
  @Output() destinoSalvo = new EventEmitter<any>();

  destino: DestinoCreateDTO = {
    nome: '',
    descricao: '',
    localizacao: '',
  };

  constructor(private destinoService: DestinosService) {}

  fecharModal() {
    this.modalStatus.set(false);
  }

  salvar() {
  
    const novoDestino = {
      nome: this.destino.nome,
      descricao: this.destino.descricao,
      localizacao: this.destino.localizacao
    };
    
    this.destinoService.save(novoDestino)
      .subscribe({
        next: (destinoSalvo) => {
          this.destinoSalvo.emit(destinoSalvo);
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao salvar destino:', error);
        }
      });    
    
  }


}
