import { Component, model, OnInit } from '@angular/core';
import { FormDestinoComponent } from '../form-destino/form-destino.component';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { CommonModule } from '@angular/common';
import { DestinosService } from '../../../../services/destinos.service';
import { DestinoCreateDTO, DestinoResponseDTO } from '../../../../model/destino';

@Component({
  selector: 'app-destino',
  imports: [FormDestinoComponent, PrimeNgModule, CommonModule],
  templateUrl: './destino.component.html',
  styleUrl: './destino.component.css',  
})
export class DestinoComponent implements OnInit {

  constructor(private destinoService: DestinosService) {}

  ngOnInit(): void {
      this.listarDestinos();
  }
  modalDialog = model(false);
  destinoSelecionado?: DestinoResponseDTO;

  destinos: any = [];

  listarDestinos() {
    this.destinoService.getAll().subscribe((destinos) => {
      this.destinos = destinos;
    });  
  }

  abrirDestinoDialog() { 
    this.destinoSelecionado = undefined;   
    this.modalDialog.set(true);
  }

  atualizaListagemDestinos() {
    this.listarDestinos()
  }

  editarDestino(destino: DestinoResponseDTO) {
    this.destinoSelecionado = destino;
    this.modalDialog.set(true);

  }
  deletarDestino(destino: DestinoCreateDTO) {}
  
}
