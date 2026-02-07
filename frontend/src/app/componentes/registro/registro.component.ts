import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioCreateDTO } from '../../model/usuario';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../shared/prime.module';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, PrimeNgModule, RouterModule],
  templateUrl: './registro.component.html',
  providers: [MessageService],
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  usuario: UsuarioCreateDTO = {
    username: '',
    password: '',
    email: '',
  };

  loading = false;

  salvar() {
    this.loading = true;
    this.usuarioService.save(this.usuario).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: 'Conta criada com sucesso! Redirecionando para login...',
        });

        // Redireciona para login após 2 segundos
        setTimeout(() => {
          this.authService.initLoginFlow();
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao criar conta',
          detail: error.error?.message || 'Ocorreu um erro ao criar sua conta. Tente novamente.',
        });
      },
    });
  }

  fazerLogin() {
    this.authService.initLoginFlow();
  }
}
