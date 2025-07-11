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
  
  constructor(private viagemService: ViagemService    
  ) {}

  ngOnInit(): void {

      this.viagemService.getAll()
        .subscribe((viagens: ViagemResponseDTO[]) => {
          this.viagens = viagens;
        });

     
  }

  editarViagem() {

  }

  deletarViagem(viagem: ViagemResponseDTO) {

  }

  detalharViagem(id: number) {

  }
}
