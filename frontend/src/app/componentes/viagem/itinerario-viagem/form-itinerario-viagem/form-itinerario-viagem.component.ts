import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { CommonModule, formatDate } from '@angular/common';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { AtividadeItinerarioCreateDTO, AtividadeItinerarioEditarDTO } from '../../../../model/atividade-itinerario';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemService } from '../../../../services/viagem.service';
import { MessageService } from 'primeng/api';
import { DateUtil } from '../../../../shared/util/date-util';

@Component({
  selector: 'app-form-itinerario-viagem',
  templateUrl: './form-itinerario-viagem.component.html',
  styleUrl: './form-itinerario-viagem.component.css',
  imports: [FormsModule, PrimeNgModule, CommonModule, ReactiveFormsModule],
})
export class ItinerarioFormComponent implements OnInit {
  atividadeForm!: FormGroup;

  itinerarioCriar: AtividadeItinerarioCreateDTO;
  itinerarioEditar: AtividadeItinerarioEditarDTO;
  datetime24h: Date[] | undefined;

  categorias = [
    { label: 'Praia', value: 'Praia' },
    { label: 'Trilha', value: 'Trilha' },
    { label: 'Cultura', value: 'Cultura' },
    { label: 'Gastronomia', value: 'Gastronomia' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogService: DialogService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private activatedRoute: ActivatedRoute,
    private viagensService: ViagemService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    let dataDatepicker = new Date();
    if (this.config.data != null) {
      this.getItinerarioEmEdicao();
      if (this.itinerarioEditar?.dia) {
        dataDatepicker = DateUtil.isoToLocalDate(this.itinerarioEditar.dia.toString());
      }
      console.log(dataDatepicker);
    }

    this.atividadeForm = this.fb.group({
      nome: [this.itinerarioEditar?.nome, Validators.required],
      orcamento: [this.itinerarioEditar?.orcamento, [Validators.required]],
      duracao: [this.itinerarioEditar?.duracao, Validators.required],
      categoria: [this.itinerarioEditar?.categoria, Validators.required],
      dia: [dataDatepicker, Validators.required],
      descricao: [this.itinerarioEditar?.descricao, Validators.required],
      melhorHorario: [this.itinerarioEditar?.melhorHorario, Validators.required],
    });
  }

  private getItinerarioEmEdicao() {
    
    this.itinerarioEditar = {
      idViagem: null,
      id: this.config.data.id,
      nome: this.config.data.nome,
      orcamento: this.config.data.orcamento,
      duracao: this.config.data.duracao,
      melhorHorario: this.config.data.melhorHorario,
      categoria: this.config.data.categoria,
      dia: DateUtil.localISO(this.config.data.dia),
      descricao: this.config.data.descricao,
    };   
   
  }

  
  cancelar() {
    this.ref.close();
  }

  salvar(formItinerario: any) {
    let idViagem = this.router.url.split('/').at(-1);
    formItinerario.value.dia = DateUtil.localISO(formItinerario.value.dia);    
    this.itinerarioEditar = {
      ...formItinerario.value,
      idViagem: idViagem,
      id: this.config?.data?.id ?? null,
    };
    if (this.atividadeForm.valid) {
      if (this.itinerarioEditar.id) {
        this.editarItinerario();
      } else {
        this.criarItinerario();
      }
      console.log(this.itinerarioEditar);
    }
  }

  private editarItinerario() {
    console.log('quebrado ', this.itinerarioEditar)
    this.viagensService.editarItemItinerario(this.itinerarioEditar).subscribe({
      next: (val) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Registro editado com sucesso`,
        });
        this.cancelar();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao recuperar itinerário ${err}`,
        });
      },
    });
  }

  private criarItinerario() {
    this.viagensService.salvarItemItinerario(this.itinerarioEditar).subscribe({
      next: (val) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Registro criado com sucesso`,
        });
        this.cancelar();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao criar itinerário ${err}`,
        });
      },
    });
  }
}
