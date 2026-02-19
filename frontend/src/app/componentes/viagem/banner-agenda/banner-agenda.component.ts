import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../../../shared/prime.module';
import { GoogleCalendarService } from '../../../services/google-calendar.service';
import { ViagemService } from '../../../services/viagem.service';
import { SugestaoViagemAgendaDTO } from '../../../model/google-calendar';
import { ViagemResponseDTO } from '../../../model/viagem';

@Component({
  selector: 'app-banner-agenda',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgModule],
  templateUrl: './banner-agenda.component.html',
  styleUrl: './banner-agenda.component.css',
})
export class BannerAgendaComponent implements OnInit {
  mostrarBanner = false;
  proximoPeriodo: SugestaoViagemAgendaDTO | null = null;

  constructor(
    private googleCalendarService: GoogleCalendarService,
    private viagemService: ViagemService
  ) {}

  ngOnInit(): void {
    const bannerFechado = localStorage.getItem('agendaBannerFechado');
    if (bannerFechado === 'true') return;

    this.googleCalendarService.getStatus().subscribe({
      next: (status) => {
        if (status.conectado) {
          this.carregarProximoPeriodo();
        }
      },
      error: () => {},
    });
  }

  private carregarProximoPeriodo(): void {
    this.googleCalendarService.getPeriodosLivres().subscribe({
      next: (periodos) => {
        if (periodos.length > 0) {
          this.verificarViagemExistente(periodos);
        }
      },
      error: () => {},
    });
  }

  private verificarViagemExistente(periodos: SugestaoViagemAgendaDTO[]): void {
    this.viagemService.getAll().subscribe({
      next: (viagens) => {
        // Encontrar o primeiro periodo sem viagem cadastrada
        const periodoDisponivel = periodos.find(
          (periodo) => !this.temViagemNoPeriodo(periodo, viagens)
        );

        if (periodoDisponivel) {
          this.proximoPeriodo = periodoDisponivel;
          this.mostrarBanner = true;
        }
      },
      error: () => {
        // Se falhar ao buscar viagens, mostra o banner normalmente
        this.proximoPeriodo = periodos[0];
        this.mostrarBanner = true;
      },
    });
  }

  private temViagemNoPeriodo(
    periodo: SugestaoViagemAgendaDTO,
    viagens: ViagemResponseDTO[]
  ): boolean {
    const inicioFolga = new Date(periodo.inicioFolga + 'T00:00:00').getTime();
    const fimFolga = new Date(periodo.fimFolga + 'T00:00:00').getTime();

    return viagens.some((viagem) => {
      const ida = new Date(viagem.dataIda + 'T00:00:00').getTime();
      const volta = new Date(viagem.dataVolta + 'T00:00:00').getTime();
      // Verifica sobreposição de datas
      return ida <= fimFolga && volta >= inicioFolga;
    });
  }

  fecharBanner(): void {
    this.mostrarBanner = false;
    localStorage.setItem('agendaBannerFechado', 'true');
  }

  formatarData(dataStr: string): string {
    if (!dataStr) return '';
    const date = new Date(dataStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  }
}
