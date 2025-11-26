import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PrimeNgModule } from '../../../../shared/prime.module';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { TipoSugestaoIaEnum } from '../../../../model/enums/TipoSugestaoIA.enum';
import { EditorComponent } from '../../../shared/ck-editor/editor.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { marked } from "marked";
import { SugestaoIaCreateDTO } from '../../../../model/sugestao-ia';
import { EditorDialogData } from '../../../../model/editor-dialog-data';
import { MY_SERVICE_TOKEN } from '../../../../services/abstract.service';
import { SugestaoIaService } from '../../../../services/sugestao-ia.service';
@Component({
  selector: 'app-sugestao-ia',
  standalone: true,
  imports: [PrimeNgModule,CommonModule, MarkdownModule],
  templateUrl: './sugestao-ia.component.html',
  styleUrl: './sugestao-ia.component.css',  
  providers: [
    { provide: MY_SERVICE_TOKEN, useClass: SugestaoIaService } 
  ]
})
export class SugestaoIaComponent {

 
  @Input() sugestao: string | undefined;
  @Input() tipoSugestao: TipoSugestaoIaEnum | undefined;  
  @Input() id: number;
  @Output() sugestaoChange = new EventEmitter<string>();
  sugestaoIA: SugestaoIaCreateDTO;
  ref: DynamicDialogRef;  
  private myService = inject(MY_SERVICE_TOKEN);
  constructor(private dialogService: DialogService) {

  }

  ckEditor() {
    
    const dto: SugestaoIaCreateDTO = {
      id: this.id,
      idViagem: null,
      tipoSugestaoIaEnum: null,
      sugestao: this.sugestao
    };
    this.ref = this.dialogService.open(EditorComponent, {
      header: 'Editor',
      width: '70%',
      focusOnShow: false,
      closable: true,
      data: <EditorDialogData<SugestaoIaCreateDTO>> {
        object: dto,
        field: 'sugestao',
        markdown: true,
        service: this.myService
        
      }
      
    })
    this.ref.onClose.subscribe((updated: SugestaoIaCreateDTO | null) => {

      if (!updated) return;

      this.sugestao = updated.sugestao;
      this.sugestaoChange.emit(this.sugestao);
   });
  }


  
}
