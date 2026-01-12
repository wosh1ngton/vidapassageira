import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { ItinerarioResponseDto } from "../../../model/atividade-itinerario";
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../../../shared/prime.module";
import { DialogService, DynamicDialogInjector, DynamicDialogRef } from "primeng/dynamicdialog";
import { ItinerarioFormComponent } from "./form-itinerario-viagem/form-itinerario-viagem.component";
import { ConfirmationService, MessageService } from "primeng/api";
import { ViagemService } from "../../../services/viagem.service";
import { EventItem } from "../planejar-viagem/planejar-viagem.component";



@Component({
    selector: 'app-itinerario-viagem',
    templateUrl: './itinerario-viagem.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, PrimeNgModule],
    providers: [ConfirmationService, MessageService]
})
export class ItinerarioViagemComponent {

    @Input() atividades: ItinerarioResponseDto[];
    @Input() eventosItinerario: EventItem[];
    @Output() updatePagina = new EventEmitter<boolean>();
    

    ref: DynamicDialogRef | undefined;

    constructor(
        private dialogService: DialogService, 
        private cdRef: ChangeDetectorRef,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private viagensService: ViagemService
    ) {

    }

    editarItemItinerario(item: ItinerarioResponseDto) {
        
        this.ref = this.dialogService.open(ItinerarioFormComponent, {
            header: 'Edição do Itinerário',
            width: '50vw',
            modal:true,
            data: item,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        });
        this.ref.onClose.subscribe((res) => {            
            this.updatePagina.emit(true);            
        });
        
    }

    confirmarDelecao(id: number) {
    this.confirmationService.confirm({          
            //target: event.target as EventTarget,
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
                this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Registro excluído' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Você cancelou a operação' });
            },
        });
  }

  deletarItemItinerario(id: number) {
    this.viagensService.deletar(id).subscribe(() => {
      this.updatePagina.emit(true);
    });
  }

  marcarComoVisitado(id: number) {
    this.viagensService.marcarConcluido(id)
        .subscribe({
            next: (val) => {
                this.messageService.add({
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail:`Marcado como concluído`
                });
                this.updatePagina.emit(true);
            },
            error: (err) => {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail:`Ocorreu um erro ao marcar como concluído`
                })
            }            
            
        });
       
  }
}