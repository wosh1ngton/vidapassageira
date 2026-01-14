import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ItinerarioResponseDto } from '../../../model/atividade-itinerario';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../shared/prime.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ItinerarioFormComponent } from './form-itinerario-viagem/form-itinerario-viagem.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ViagemService } from '../../../services/viagem.service';

export interface EventItem {
  id: number;
  nome: string;
  descricao: string;
  orcamento: string;
  categoria: string;
  dia: Date;
  duracaoHoras: string;
  melhorHorario: string;
  itinerarioConcluido: boolean;
  color?: string;
  icon?: string;
}

@Component({
  selector: 'app-itinerario-viagem',
  templateUrl: './itinerario-viagem.component.html',
  styleUrl: './itinerario-viagem.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgModule],
  providers: [ConfirmationService, MessageService],
})
export class ItinerarioViagemComponent implements OnInit, OnChanges {
  @Input() atividades: ItinerarioResponseDto[];
  @Output() updatePagina = new EventEmitter<boolean>();
  itensTimeLine: EventItem[] | undefined;

  ref: DynamicDialogRef | undefined;

  constructor(
    private dialogService: DialogService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private viagensService: ViagemService
  ) {}

  ngOnInit(): void {
    this.getItensTimeLine();
  }

  private getItensTimeLine() {
    this.itensTimeLine = this.atividades.map((atividade) => ({
      ...atividade,
      color: '#f4f4f4',
      icon: 'pi pi-plus',
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.getItensTimeLine();
    }
  }

  editarItemItinerario(item: ItinerarioResponseDto) {
    this.ref = this.dialogService.open(ItinerarioFormComponent, {
      header: 'Edição do Itinerário',
      width: '50vw',
      modal: true,
      data: item,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    this.ref.onClose.subscribe((res) => {
      console.log('aqui vai');
      this.updatePagina.emit(true);
    });
  }

  confirmarDelecao(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este registro?',
      header: 'Exclusão de Registro',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Excluir',
        severity: 'danger',
      },

      accept: () => {
        this.deletarItemItinerario(id);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Registro excluído',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Você cancelou a operação',
        });
      },
    });
  }

  deletarItemItinerario(id: number) {
    this.viagensService.deletar(id).subscribe(() => {
      this.updatePagina.emit(true);
    });
  }

  marcarComoVisitado(id: number) {
    this.viagensService.marcarConcluido(id).subscribe({
      next: (val) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Marcado como concluído`,
        });
        this.updatePagina.emit(true);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Ocorreu um erro ao marcar como concluído`,
        });
      },
    });
  }
}
