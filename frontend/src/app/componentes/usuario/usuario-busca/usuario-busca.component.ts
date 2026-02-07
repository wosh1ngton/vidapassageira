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
    <div class="compartilhamento-container">
      <!-- Header Info -->
      <div class="info-section">
        <div class="icon-wrapper">
          <i class="pi pi-users"></i>
        </div>
        <div class="info-content">
          <h3 class="info-title">Compartilhar Viagem</h3>
          <p class="info-description">Busque e selecione o usuário com quem deseja compartilhar esta viagem</p>
        </div>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <label class="search-label">
          <i class="pi pi-search"></i>
          Buscar usuário
        </label>
        <p-autocomplete
          [(ngModel)]="selectedUser"
          styleClass="w-full"
          [suggestions]="items"
          (completeMethod)="search($event)"
          showEmptyMessage="true"
          emptyMessage="Nenhum usuário encontrado"
          optionLabel="username"
          placeholder="Digite o nome do usuário..."
        />
      </div>

      <!-- Selected User Preview -->
      <div class="selected-user" *ngIf="selectedUser">
        <div class="user-avatar">
          <i class="pi pi-user"></i>
        </div>
        <div class="user-info">
          <span class="user-label">Usuário selecionado:</span>
          <span class="user-name">{{ selectedUser.username }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <button pButton
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                class="cancel-button"
                (click)="cancelar()"></button>
        <button pButton
                type="button"
                label="Compartilhar"
                icon="pi pi-share-alt"
                class="share-button"
                [disabled]="!selectedUser"
                (click)="compartilhar()"></button>
      </div>
    </div>
  `,
  styles: [`
    .compartilhamento-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem;
    }

    /* Info Section */
    .info-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: linear-gradient(135deg, rgba(129, 157, 106, 0.1) 0%, rgba(129, 157, 106, 0.05) 100%);
      border-radius: 12px;
      border-left: 4px solid #819d6a;
    }

    .icon-wrapper {
      width: 50px;
      height: 50px;
      background: #819d6a;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-wrapper i {
      font-size: 1.5rem;
      color: white;
    }

    .info-content {
      flex: 1;
    }

    .info-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #333333;
      margin: 0 0 0.25rem 0;
    }

    .info-description {
      font-size: 0.9rem;
      color: #666666;
      margin: 0;
      line-height: 1.5;
    }

    /* Search Section */
    .search-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .search-label {
      font-size: 1rem;
      font-weight: 600;
      color: #333333;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-label i {
      color: #819d6a;
      font-size: 1rem;
    }

    /* Selected User Preview */
    .selected-user {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 12px;
      border: 2px solid #e9ecef;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .user-avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: linear-gradient(135deg, #819d6a 0%, #6b8558 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .user-avatar i {
      color: white;
      font-size: 1.25rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-label {
      font-size: 0.75rem;
      color: #666666;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .user-name {
      font-size: 1rem;
      font-weight: 700;
      color: #333333;
    }

    /* Actions Section */
    .actions-section {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding-top: 0.5rem;
      border-top: 1px solid #f0f0f0;
    }

    .cancel-button {
      background: white !important;
      color: #666666 !important;
      border: 2px solid #e0e0e0 !important;
    }

    .cancel-button:hover {
      background: #f8f9fa !important;
      border-color: #999999 !important;
      color: #333333 !important;
    }

    .share-button {
      background: linear-gradient(135deg, #819d6a 0%, #6b8558 100%) !important;
      border: none !important;
    }

    .share-button:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(129, 157, 106, 0.3) !important;
      transform: translateY(-2px);
    }

    .share-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Autocomplete Customization */
    ::ng-deep .p-autocomplete {
      width: 100%;
    }

    ::ng-deep .p-autocomplete .p-inputtext {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    ::ng-deep .p-autocomplete .p-inputtext:hover {
      border-color: #819d6a;
    }

    ::ng-deep .p-autocomplete .p-inputtext:focus {
      border-color: #819d6a;
      box-shadow: 0 0 0 3px rgba(129, 157, 106, 0.1);
    }

    /* Responsividade */
    @media screen and (max-width: 480px) {
      .actions-section {
        flex-direction: column;
      }

      .cancel-button,
      .share-button {
        width: 100%;
      }

      .info-section {
        flex-direction: column;
        text-align: center;
      }
    }
  `],
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
