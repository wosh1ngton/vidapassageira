import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrimeNgModule } from '../../../shared/prime.module';
import { ViagemCreateDTO } from '../../../model/viagem';
import { DestinoResponseDTO } from '../../../model/destino';
import { FormsModule } from '@angular/forms';
import { ViagemService } from '../../../services/viagem.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-viagem',
  imports: [PrimeNgModule, FormsModule, CommonModule],
  standalone: true,

  templateUrl: './form-viagem.component.html',
  styleUrl: './form-viagem.component.css',
})
export class FormViagemComponent implements OnInit {
  private _destinoParaViajar?: DestinoResponseDTO;
  @Output() closeDialog = new EventEmitter<void>();
  usuario: any = {};

  destino: DestinoResponseDTO = {
    id: 0,
    nome: '',
    descricao: '',
    localizacao: '',
    imagemBase64: '',
  };

   viagem: ViagemCreateDTO = {
    dataIda: new Date(),
    dataVolta: new Date(),
    idDestino: 0,
    id: 0,
    sub: ''
  };

  constructor(private viagemService: ViagemService, 
    private oauthService: OAuthService,
    private configDialog: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private router: Router
  ) {}

  ngOnInit(): void {    
      const isEdicao = this.isEdicao();
      if(isEdicao) {        
        this.getViagem();
      } else {
        this.destino.nome = this.configDialog.data?.entidade.nome;
        this.viagem.idDestino = this.configDialog.data?.entidade.id;
      }     
      
  }

  private isEdicao(): boolean {
    return !!this.configDialog.data?.isEdicao;
  }

  private getViagem() {
    this.viagemService.findById(this.configDialog.data.id)
      .subscribe((val) => {
        this.destino = val.destino;
        this.viagem = {
          id: val.id,
          dataIda: new Date(val.dataIda),
          dataVolta: new Date(val.dataVolta),
          idDestino: val.destino.id,
          sub: this.usuario.sub
        };


      });
  }

  @Input()
  set destinoParaViagem(value: DestinoResponseDTO | undefined) {
    this._destinoParaViajar = value;

    if (value) {
      this.viagem.idDestino = value.id;
      this.destino = {
        id: value.id,
        nome: value.nome,
        descricao: value.descricao,
        localizacao: value.localizacao,
        imagemBase64: ''
      };
    } else {
      this.destino = {
        id: 0,
        nome: '',
        descricao: '',
        localizacao: '',
        imagemBase64: ''
      };
    }


  }

  getUserInfo() {
    const claims: any = this.oauthService.getIdentityClaims();

    if (claims) {
      this.usuario.email = claims['email'];
      this.usuario.name = claims['name'] || claims['preferred_username'];
      this.usuario.sub = claims['sub']
    }
  }
 

  salvar() {
    this.getUserInfo();
    const isEdicao = this.isEdicao();
    if(isEdicao) {
      this.editar();
      return;
    }
    this.cadastrar();
  }

  editar() {
    this.viagemService.editar(this.viagem)
      .subscribe({
      next: (response) => {        
        console.log(response);
        this.close();
        this.closeDialog.emit();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  cadastrar() {
    this.viagem.sub = this.usuario.sub;
    this.viagemService.save(this.viagem).subscribe({
      next: (response) => {        
        console.log(response);
        this.router.navigateByUrl(`viagens`);        
        this.close();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  close() {
    this.ref.close((val) => console.log('sair'));
  }
}
