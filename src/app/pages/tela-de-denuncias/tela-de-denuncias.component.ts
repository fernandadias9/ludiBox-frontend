import { Component } from '@angular/core';

@Component({
  selector: 'app-tela-de-denuncias',
  templateUrl: './tela-de-denuncias.component.html',
  styleUrls: ['./tela-de-denuncias.component.scss']
})
export class TelaDeDenunciasComponent {

  status = [
    { value: '', label: 'Novo' },
    { value: '', label: 'Analisado' },
  ];

  motivos = [
    { value: '', label: 'Conteúdo indevido' },
    { value: '', label: 'Preços abusivos' },
    { value: '', label: 'Publicação falsa' },
    { value: '', label: 'Outro' },
  ];

  
  formData = {
    tipo: ''
  };
}
