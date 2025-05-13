import { Component, model } from '@angular/core';
import { Destino } from '../../../../model/destino';
import { FormDestinoComponent } from '../form-destino/form-destino.component';

@Component({
  selector: 'app-destino',
  imports: [FormDestinoComponent],
  templateUrl: './destino.component.html',
  styleUrl: './destino.component.css'
})
export class DestinoComponent {

  modalDialog = model(false);

  destinos = [
    new Destino("Bonito", "Destino de beleza natural", "Brasil - MS"),
    new Destino("Amazônia", "Destino de beleza natural", "Brasil - AM"),
  ]

  abrirDestinoDialog() {
    this.modalDialog.set(true);
  }
}
