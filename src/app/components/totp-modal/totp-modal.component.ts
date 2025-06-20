import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-totp-modal',
  templateUrl: './totp-modal.component.html',
})
export class TotpModalComponent {
  totpCode: string = '';

  constructor(
    public dialogRef: MatDialogRef<TotpModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {}

  confirmar() {
    this.dialogRef.close(this.totpCode);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
