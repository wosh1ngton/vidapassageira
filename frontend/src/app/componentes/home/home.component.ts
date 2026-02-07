import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  features: Feature[] = [
    {
      icon: 'pi pi-building',
      title: 'Onde Ficar',
      description: 'Sugestoes personalizadas de hospedagens, hoteis, pousadas e acomodacoes perfeitas para seu perfil e orcamento.'
    },
    {
      icon: 'pi pi-car',
      title: 'Como Chegar',
      description: 'Orientacoes sobre transporte, rotas, voos, transfers e a melhor forma de se deslocar ate seu destino.'
    },
    {
      icon: 'pi pi-map-marker',
      title: 'Onde Ir',
      description: 'Pontos turisticos imperdiveis, atracoes locais, experiencias unicas e roteiros completos criados pela IA.'
    },
    {
      icon: 'pi pi-shopping-bag',
      title: 'Onde Comer',
      description: 'Recomendacoes gastronomicas locais, restaurantes, cafes e pratos tipicos que voce precisa experimentar.'
    }
  ];

  steps: Step[] = [
    {
      title: 'Escolha Seu Destino',
      description: 'Cadastre ou selecione o destino dos seus sonhos com datas de ida e volta.'
    },
    {
      title: 'Receba Sugestoes da IA',
      description: 'Nossa inteligencia artificial analisa seu destino e gera sugestoes personalizadas em segundos.'
    },
    {
      title: 'Monte Seu Itinerario',
      description: 'Organize suas atividades em uma linha do tempo, adicione orcamentos e personalize cada detalhe.'
    },
    {
      title: 'Compartilhe Com Amigos',
      description: 'Convide amigos para visualizar seu itinerario e planejem juntos a viagem perfeita.'
    }
  ];

  /**
   * Verifica se o usuário está autenticado
   */
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Navega para a rota desejada se autenticado, caso contrário inicia login
   */
  navigateOrLogin(route: string) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([route]);
    } else {
      this.authService.initLoginFlow();
    }
  }
}
