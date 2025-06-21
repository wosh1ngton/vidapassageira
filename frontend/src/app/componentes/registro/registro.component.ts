import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioCreateDTO } from '../../model/usuario';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PrimeNgModule } from '../../shared/prime.module';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, PrimeNgModule],
  templateUrl: './registro.component.html',
  providers: [MessageService],
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  constructor(private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {}
  dialogCadastroUsuarioRef: DynamicDialogRef | undefined;

  usuario : UsuarioCreateDTO = {
    username: '',
    password: '',
    email: ''    
  };
  
  salvar() {
    this.usuarioService.save(this.usuario).subscribe({
      next: (response) => {
        console.log('Usuário criado com sucesso:', response);
        this.dialogCadastroUsuarioRef?.close();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Erro ao criar usuário ${error.message}` });      
        this.dialogCadastroUsuarioRef?.close();
      }
    });
    console.log(this.usuario);
  }
}
