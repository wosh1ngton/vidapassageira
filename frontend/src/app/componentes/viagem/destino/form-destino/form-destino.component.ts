import {
  afterRender,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  model,
  OnInit,
  Output,
  viewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { DestinosService } from '../../../../services/destinos.service';
import {
  DestinoCreateDTO,
  DestinoResponseDTO,
} from '../../../../model/destino';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-form-destino',
  imports: [CommonModule, FormsModule, PrimeNgModule, FileUpload],
  templateUrl: './form-destino.component.html',
  styleUrl: './form-destino.component.css',
})
export class FormDestinoComponent implements OnInit {
  modalStatus = model(false);
  visible: boolean = false;
  @Output() destinoSalvo = new EventEmitter<any>();
  private _destinoParaEditar?: DestinoResponseDTO;

  @Input()
  set destinoParaEditar(value: DestinoResponseDTO | undefined) {
    this._destinoParaEditar = value;

    if (value) {
      this.destino = {
        nome: value.nome,
        descricao: value.descricao,
        localizacao: value.localizacao,
        imagem: undefined,
      };
    } else {
      this.destino = {
        nome: '',
        descricao: '',
        localizacao: '',
        imagem: undefined,
      };
    }
  }

  destino: DestinoCreateDTO = {
    nome: '',
    descricao: '',
    localizacao: '',
    imagem: undefined,
  };

  constructor(
    private destinoService: DestinosService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  fecharModal() {
    this.modalStatus.set(false);
  }

  salvar() {
    if (this._destinoParaEditar) {
      this.atualizarDestino();
    } else {
      this.salvarNovoDestino();
    }
  }

  private atualizarDestino() {
    
    if (!this._destinoParaEditar) {
      return;
    }
    
    this.destinoService
      .atualizar(this.montarEdicaoDestino(), this._destinoParaEditar.id)
      .subscribe({
        next: (destinoSalvo) => {
          this.destinoSalvo.emit(destinoSalvo);
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao salvar destino:', error);
        },
      });
  }

  salvarNovoDestino() {
    this.destinoService.save(this.montarDestino()).subscribe({
      next: (destinoSalvo) => {
        this.destinoSalvo.emit(destinoSalvo);
        this.fecharModal();
      },
      error: (error) => {
        console.error('Erro ao salvar destino:', error);
      },
    });
  }

  private montarDestino() {
    const formData = new FormData();
    formData.append('nome', this.destino.nome || '');
    formData.append('descricao', this.destino.descricao || '');
    formData.append('localizacao', this.destino.localizacao || '');
    if (this.destino.imagem) {
      formData.append('imagem', this.destino.imagem);
    }
    return formData;
  }

  private montarEdicaoDestino() {
    const formData = new FormData();

    const destinoSemImage = { ...this.destino };
    delete destinoSemImage.imagem;
    
    formData.append(
      'destino',
      new Blob([JSON.stringify(this.destino)], { type: 'application/json' })
    );
    if (this.destino.imagem) {
      formData.append('imagem', this.destino.imagem);
    }
    return formData;
  }

  onSelect(event: FileSelectEvent) {
    const input = event.originalEvent.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.destino.imagem = input.files[0];
    }
  }
}
