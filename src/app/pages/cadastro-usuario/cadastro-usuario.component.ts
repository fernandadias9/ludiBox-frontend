import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss'
})
export class CadastroUsuarioComponent {
  isPessoaJuridica: boolean = false;
  aceitaTermos: boolean = false;
  snChecked: boolean = false;
  withOverflow: boolean = false;

  constructor() {
    this.updateWithOverflow(window.innerWidth); 
  }

  togglePessoaJuridica(event: any): void {
    this.isPessoaJuridica = event.target.checked;
  }

  toggleSN(event: any): void {
    this.snChecked = event.target.checked;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.updateWithOverflow(width);
  }

  private updateWithOverflow(width: number) {
    this.withOverflow = width < 768;
  }
}
