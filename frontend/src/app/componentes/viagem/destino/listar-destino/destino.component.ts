import { Component, EventEmitter, model, OnInit } from '@angular/core';
import { FormDestinoComponent } from '../form-destino/form-destino.component';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { CommonModule } from '@angular/common';
import { DestinosService } from '../../../../services/destinos.service';
import { DestinoCreateDTO, DestinoResponseDTO } from '../../../../model/destino';
import { FormViagemComponent } from "../../form-viagem/form-viagem.component";
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-destino',
  imports: [FormDestinoComponent, PrimeNgModule, CommonModule, FormViagemComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './destino.component.html',
  styleUrl: './destino.component.css',  
})
export class DestinoComponent implements OnInit {

  constructor(private destinoService: DestinosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  showPlanejarViagem: boolean = false;
  destinoViagem: DestinoResponseDTO | undefined;
  

  ngOnInit(): void {
      this.listarDestinos();
  }
  modalDialog = model(false);
  destinoSelecionado?: DestinoResponseDTO;

  destinos: any = [];

  listarDestinos() {
    this.destinoService.getAll().subscribe((destinos) => {
      this.destinos = destinos;
    });  
  }

  abrirDestinoDialog() { 
    this.destinoSelecionado = undefined;   
    this.modalDialog.set(true);
  }

  atualizaListagemDestinos() {
    this.listarDestinos()
  }

  editarDestino(destino: DestinoResponseDTO) {
    this.destinoSelecionado = destino;
    this.modalDialog.set(true);

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
                this.deletarDestino(id);
                this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Registro excluído' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Você cancelou a operação' });
            },
        });
  }

  deletarDestino(id: number) {
    this.destinoService.deletar(id).subscribe(() => {
      this.listarDestinos();
    });
  }

 
  
  planejarViagem(destino: DestinoResponseDTO) {
    this.showPlanejarViagem = true;
    this.destinoViagem = destino;
  }
  
}
