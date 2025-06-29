import { Component } from '@angular/core';
import Swal from 'sweetalert2'; 
import { EmailService } from '../../shared/service/emailService';

@Component({
  selector: 'app-recuperacao-de-senha',
  templateUrl: './recuperacao-de-senha.component.html',
  styleUrls: ['./recuperacao-de-senha.component.scss']
})
export class RecuperacaoDeSenhaComponent {
  
  email: string = '';

  constructor(private emailService: EmailService) {}

  enviarEmail() {
    if (!this.email) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Por favor, informe um e-mail válido.',
      });
      return;
    }

    this.emailService.enviarEmailRecuperacao(this.email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'E-mail enviado com sucesso!',
          text: 'Verifique sua caixa de entrada.',
        });
        this.email = '';
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao enviar o e-mail. Tente novamente mais tarde.',
        });
        console.error('Erro ao enviar e-mail:', err);
      }
    });
  }
}