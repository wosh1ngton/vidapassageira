import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ViagemCreateDTO } from '../../../model/viagem';
import { DestinoCreateDTO, DestinoResponseDTO } from '../../../model/destino';
import { Form, FormsModule } from '@angular/forms';
import { ViagemService } from '../../../services/viagem.service';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-form-viagem',
  imports: [PrimeNgModule, FormsModule],
  standalone: true,
  templateUrl: './form-viagem.component.html',
  styleUrl: './form-viagem.component.css',
})
export class FormViagemComponent {
  private _destinoParaViajar?: DestinoResponseDTO;
  @Output() closeDialog = new EventEmitter<void>();


  destino: DestinoResponseDTO = {
    id: 0,
    nome: '',
    descricao: '',
    localizacao: '',
    imagemBase64: '',
  };

   viagem: ViagemCreateDTO = {
    dataIda: new Date(),
    dataVolta: new Date(),
    idDestino: 0,
    id: 0
  };

  constructor(private viagemService: ViagemService) {}

  @Input()
  set destinoParaViagem(value: DestinoResponseDTO | undefined) {
    this._destinoParaViajar = value;

    if (value) {
      this.viagem.idDestino = value.id;
      this.destino = {
        id: value.id,
        nome: value.nome,
        descricao: value.descricao,
        localizacao: value.localizacao,
        imagemBase64: ''
      };
    } else {
      this.destino = {
        id: 0,
        nome: '',
        descricao: '',
        localizacao: '',
        imagemBase64: ''
      };
    }
  }

 

  salvar() {
    this.cadastrar();
  }

  cadastrar() {
    this.viagemService.save(this.viagem).subscribe({
      next: (response) => {        
        console.log(response);
        this.closeDialog.emit();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
