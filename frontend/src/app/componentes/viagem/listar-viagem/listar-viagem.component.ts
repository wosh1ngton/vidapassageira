import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ViagemResponseDTO } from '../../../model/viagem';
import { ViagemService } from '../../../services/viagem.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormViagemComponent } from '../form-viagem/form-viagem.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-listar-viagem',
  imports: [PrimeNgModule, CommonModule, RouterModule],
  templateUrl: './listar-viagem.component.html',
  styleUrl: './listar-viagem.component.css',

})
export class ListarViagemComponent implements OnInit {
  viagens: ViagemResponseDTO[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(private viagemService: ViagemService    ,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {

      this.listarViagens();

     
  }

  private listarViagens() {
    this.viagemService.getAll()
      .subscribe((viagens: ViagemResponseDTO[]) => {
        this.viagens = viagens.sort((a, b) => {
          const d1 = new Date(a.dataVolta);
          const d2 = new Date(b.dataVolta);
          return Number(d1) - Number(d2);
        });
      });
  }

  editarViagem(id: number) {
    this.ref = this.dialogService.open(FormViagemComponent, {
      header: 'Editar viagem',
      width: '50vw',
      modal: true,
      data: {id: id, isEdicao: true},
      focusOnShow: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    this.ref.onClose.subscribe(() => {
      this.listarViagens();
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
                this.deletarViagem(id);
                
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Você cancelou a operação' });
            },
        });
  }

  deletarViagem(id: number) {
    this.viagemService.deletarViagem(id).subscribe({
      next: (val) =>{
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Registro excluído' }); 
        this.listarViagens();
      },      
      error: (err: JSON) => this.messageService.add({
        severity: 'error', summary: 'Erro', detail: `Erro ao tentar excluir ${JSON.stringify(err["message"])}`
      })
      
    });
  }
  

 
}
