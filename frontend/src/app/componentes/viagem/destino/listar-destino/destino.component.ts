import { Component, EventEmitter, model, OnInit, OnDestroy } from '@angular/core';
import { FormDestinoComponent } from '../form-destino/form-destino.component';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinosService } from '../../../../services/destinos.service';
import { DestinoCreateDTO, DestinoResponseDTO } from '../../../../model/destino';
import { FormViagemComponent } from "../../form-viagem/form-viagem.component";
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-destino',
  imports: [FormDestinoComponent, PrimeNgModule, CommonModule, FormsModule],
  templateUrl: './destino.component.html',
  styleUrl: './destino.component.css',
})
export class DestinoComponent implements OnInit, OnDestroy {

  constructor(
    private destinoService: DestinosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}
  showPlanejarViagem: boolean = false;
  destinoViagem: DestinoResponseDTO | undefined;
  ref: DynamicDialogRef | undefined;

  termoBusca: string = '';
  private buscaSubject = new Subject<string>();
  private buscaSubscription?: Subscription;

  ngOnInit(): void {
      this.listarDestinos();
      this.buscaSubscription = this.buscaSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(termo => {
        if (termo.trim().length >= 2) {
          this.buscarDestinos(termo);
        } else {
          this.listarDestinos();
        }
      });
  }

  ngOnDestroy(): void {
    this.buscaSubscription?.unsubscribe();
  }

  modalDialog = model(false);
  destinoSelecionado?: DestinoResponseDTO;

  destinos: any = [];
  loading: boolean = true;

  onBuscaChange(termo: string) {
    this.buscaSubject.next(termo);
  }

  limparBusca() {
    this.termoBusca = '';
    this.listarDestinos();
  }

  listarDestinos() {
    this.loading = true;
    this.destinoService.getAll().subscribe({
      next: (destinos) => {
        this.destinos = destinos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar destinos:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar destinos'
        });
      }
    });
  }

  buscarDestinos(termo: string) {
    this.loading = true;
    this.destinoService.buscar(termo).subscribe({
      next: (destinos) => {
        this.destinos = destinos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar destinos:', error);
        this.loading = false;
      }
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
  
  criarViagem(destino: any) {
    this.ref = this.dialogService.open(FormViagemComponent, {
      header: 'Editar viagem',
      width: '50vw',
      modal: true,
      data: {entidade: destino, isEdicao: false},
      focusOnShow: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    })
   
  
  }
}
