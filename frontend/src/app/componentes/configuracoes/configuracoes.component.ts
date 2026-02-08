import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PrimeNgModule } from '../../shared/prime.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css',
})
export class ConfiguracoesComponent implements OnInit {
  usuario: any;
  exportando = false;
  excluindo = false;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carregar dados do usuário do localStorage ou service
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      this.usuario = JSON.parse(usuarioStr);
    }
  }

  exportarDados(): void {
    this.exportando = true;

    this.usuarioService.exportarDados().subscribe({
      next: (dados) => {
        // Criar arquivo JSON para download
        const dataStr = JSON.stringify(dados, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vidapassageira-dados-${new Date().getTime()}.json`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.exportando = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Seus dados foram exportados com sucesso!',
        });
      },
      error: (error) => {
        this.exportando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao exportar dados. Tente novamente.',
        });
        console.error('Erro ao exportar dados:', error);
      },
    });
  }

  confirmarExclusaoConta(): void {
    this.confirmationService.confirm({
      header: 'Excluir Conta - Confirmação',
      message: 'Tem certeza que deseja excluir sua conta? Esta ação NÃO pode ser desfeita e todos os seus dados serão permanentemente removidos.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir minha conta',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.confirmarExclusaoFinal();
      },
    });
  }

  confirmarExclusaoFinal(): void {
    this.confirmationService.confirm({
      header: 'Última Confirmação',
      message: 'Esta é sua última chance! Ao confirmar, sua conta e todos os dados associados (viagens, itinerários, compartilhamentos) serão PERMANENTEMENTE excluídos. Deseja realmente continuar?',
      icon: 'pi pi-exclamation-circle',
      acceptLabel: 'Sim, EXCLUIR PERMANENTEMENTE',
      rejectLabel: 'Não, manter minha conta',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.excluirConta();
      },
    });
  }

  excluirConta(): void {
    this.excluindo = true;

    this.usuarioService.excluirConta().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Conta Excluída',
          detail: 'Sua conta foi excluída com sucesso. Você será redirecionado para a página inicial.',
        });

        // Aguardar 2 segundos e fazer logout
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.excluindo = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir conta. Tente novamente ou entre em contato com o suporte.',
        });
        console.error('Erro ao excluir conta:', error);
      },
    });
  }
}
