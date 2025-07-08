import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ViagemResponseDTO } from '../../../model/viagem';
import { ViagemService } from '../../../services/viagem.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-listar-viagem',
  imports: [PrimeNgModule, CommonModule, RouterModule],
  templateUrl: './listar-viagem.component.html',
  styleUrl: './listar-viagem.component.css'
})
export class ListarViagemComponent implements OnInit {
  viagens: ViagemResponseDTO[] = [];
  exibirLista = true;
  constructor(private viagemService: ViagemService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

      this.viagemService.getAll()
        .subscribe((viagens: ViagemResponseDTO[]) => {
          this.viagens = viagens;
        });

      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          const childRoute = this.activatedRoute.firstChild;
          this.exibirLista = !childRoute?.snapshot?.url.length;
        })
  }

  editarViagem() {

  }

  deletarViagem(viagem: ViagemResponseDTO) {

  }

  detalharViagem(id: number) {

  }
}
