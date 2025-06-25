import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LoginService } from '../../shared/service/LoginService';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html'
})
export class QrCodeComponent implements OnInit {

  qrCodeUrl: SafeUrl | null = null;

  constructor(
    private loginService: LoginService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
   
    this.gerarQRCode();
  
  }

  gerarQRCode(): void {
    this.loginService.getQRCode().subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      },
      error: err => {
        console.error('Erro ao buscar o QR Code:', err);
      }
    });
  }
}
