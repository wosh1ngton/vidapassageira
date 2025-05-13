import { afterRender, Component, ElementRef, model, viewChild } from '@angular/core';
import { Destino } from '../../../../model/destino';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-destino',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-destino.component.html',
  styleUrl: './form-destino.component.css'
})
export class FormDestinoComponent {

  destinoDialog = viewChild.required<ElementRef<HTMLDialogElement>>('modal');
  modalStatus = model(false);
  
  destino: Destino = {
    nome : '',
    descricao: '',
    localizacao: ''
  };

  constructor(){
    afterRender(() => {
      if(this.modalStatus()){
        this.destinoDialog().nativeElement.showModal();
      } else {
        this.destinoDialog().nativeElement.close();
      }
    })
  }

  fecharModal() {
    this.modalStatus.set(false);
  }

  salvar() {
    const novoDestino = new Destino(
      this.destino.nome,
      this.destino.descricao,
      this.destino.localizacao
    );
    this.fecharModal();
    
  }
}
