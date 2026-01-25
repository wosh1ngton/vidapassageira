import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PrimeNgModule } from '../../../shared/prime.module';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioDTO } from '../../../model/usuario';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViagemCompartilhamentoDTO } from '../../../model/viagem-compartilhamento';
import { CompartilhamentoService } from '../../../services/compartilhamento.service';
import { MessageService } from 'primeng/api';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  template: `
    <div class="card flex justify-center">
      <p-autocomplete
        [(ngModel)]="selectedUser"
        styleClass="w-full"
        [suggestions]="items"
        (completeMethod)="search($event)"
        showEmptyMessage="true"
        emptyMessage="Nenhum resultado encontrado"
        optionLabel="username"
      />
      
      <p-button
        label="Escolher"
        (click)="compartilhar()"
        [disabled]="!selectedUser"
      />
    </div>
  `,
  standalone: true,
  imports: [AutoCompleteModule, FormsModule, PrimeNgModule, CommonModule],
})
export class UsuarioBuscaComponent {
  items: UsuarioDTO[] = [];
  selectedUser: UsuarioDTO;
  compartilhamento: ViagemCompartilhamentoDTO;

  constructor(
    private usuarioService: UsuarioService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private compartilhamentoService: CompartilhamentoService,
    private messageService: MessageService
  ) {}

  search(event: AutoCompleteCompleteEvent) {
    this.usuarioService.buscarUsuario(event.query).subscribe((value) => {
      this.items = value;
    });
  }

  cancelar() {
    this.ref.close();
  }
  compartilhar() {
    const idViagem = this.config.data.idViagem;
    this.compartilhamento = {
        id: null,
        idViagem : idViagem,
        idUsuario : this.selectedUser.id
    }

    this.compartilhamentoService.compartilharViagem(this.compartilhamento)
        .subscribe({
            next: (val) =>{
                this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Viagem Compartilhada' }); 
                this.cancelar();
                
            },      
            error: (err: JSON) => this.messageService.add({
                severity: 'error', summary: 'Erro', detail: `Erro ao tentar compartilhar ${JSON.stringify(err["message"])}`
            })
        });
    }

   
  
}
