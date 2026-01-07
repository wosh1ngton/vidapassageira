import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { AtividadeItinerarioCreateDTO } from '../../../../model/atividade-itinerario';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemService } from '../../../../services/viagem.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-itinerario-viagem',
  templateUrl: './form-itinerario-viagem.component.html',
  imports: [FormsModule, PrimeNgModule, CommonModule, ReactiveFormsModule],
})
export class ItinerarioFormComponent implements OnInit {
  atividadeForm!: FormGroup;

  itinerario: AtividadeItinerarioCreateDTO;

  categorias = [
    { label: 'Praia', value: 'Praia' },
    { label: 'Trilha', value: 'Trilha' },
    { label: 'Cultura', value: 'Cultura' },
    { label: 'Gastronomia', value: 'Gastronomia' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogService: DialogService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private activatedRoute: ActivatedRoute,
    private viagensService: ViagemService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.config.data != null) {
      this.getItinerarioEmEdicao();
    }

    this.atividadeForm = this.fb.group({
      nome: [this.itinerario?.nome, Validators.required],
      orcamento: [this.itinerario?.orcamento, [Validators.required]],
      duracao: [this.itinerario?.duracao, Validators.required],
      categoria: [this.itinerario?.categoria, Validators.required],
      descricao: [this.itinerario?.descricao, Validators.required],
      melhorHorario: [this.itinerario?.melhorHorario, Validators.required],
    });
  }

  private getItinerarioEmEdicao() {
    this.itinerario = {
      idViagem: null,
      id: this.config.data.id,
      nome: this.config.data.nome,
      orcamento: this.config.data.orcamento,
      duracao: this.config.data.duracao,
      melhorHorario: this.config.data.melhorHorario,
      categoria: this.config.data.categoria,
      descricao: this.config.data.descricao,
    };
  }

  cancelar() {
    this.ref.close();
  }

  salvar(formItinerario: any) {
    let idViagem = this.router.url.split('/').at(-1);
    this.itinerario = {
      ...formItinerario.value,
      idViagem: idViagem,
      id: this.config?.data?.id ?? null,
    };
    if (this.atividadeForm.valid) {
      if(this.itinerario.id) {        
        this.editarItinerario();
      } else {
        this.criarItinerario();
      }
      console.log(this.itinerario);
    }
  }

  private editarItinerario() {
    this.viagensService.editarItemItinerario(this.itinerario).subscribe({
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
    this.viagensService.salvarItemItinerario(this.itinerario).subscribe({
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
