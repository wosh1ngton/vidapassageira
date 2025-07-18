import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioCreateDTO } from '../../model/usuario';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../shared/prime.module';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, PrimeNgModule],
  templateUrl: './registro.component.html',
  providers: [MessageService],
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private ref: DynamicDialogRef
  ) {}

  usuario: UsuarioCreateDTO = {
    username: '',
    password: '',
    email: '',
  };

  salvar() {
    this.usuarioService.save(this.usuario).subscribe({
      next: (response) => {
        this.ref.close({ sucesso: true, usuarioCriado: response });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `${error.error.message}`,
        });
      },
    });
   
  }
}
