import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PvService } from 'src/app/shared/services/pv.service';
import { SendmailPvComponent } from '../sendmail-pv/sendmail-pv.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

type Destinataire = {
  nom: string;
  prenom: string;
  email: string;
};

type SendMailDialogData = {
  idPv: string;
  defaultDestinataire?: Destinataire;
};

@Component({
  selector: 'app-send-signature-mail',
  templateUrl: './send-signature-mail.component.html',
  styleUrls: ['./send-signature-mail.component.scss']
})
export class SendSignatureMailComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  pvReceptionFile: File | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pvService: PvService,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<SendmailPvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendMailDialogData,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      destinataire: this.fb.group({
        nom: ['', [Validators.required]],
        prenom: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
      })
    });

    const destinataire = this.data?.defaultDestinataire || null;
    if (destinataire) {
      this.form.get('destinataire')?.setValue(destinataire);
    }
  }


  send(): void {
    if (!this.data?.idPv) {
      this.openSnackBarError('Identifiant du PV manquant.');
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid || !this.form.get('destinataire')?.value) {
      this.openSnackBarError('Veuillez renseigner un destinataire valide.');
      return;
    }

    const destinataire = this.form.get('destinataire')?.value;
    console.log("Destinataire", destinataire);

    this.isLoading = true;
    this.pvService.sendSignatureMail(this.data.idPv, destinataire).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.openSnackBar(res?.message || 'Demande de signature envoyée avec succès.');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        console.log('Erreur envoi demande de signature:', error);
        this.openSnackBarError('Une erreur s\'est produite lors de l\'envoi de la demande de signature.');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string): void {
    this.snackbar.open(message, 'Fermer', {
      duration: 6000,
    });
  }

  openSnackBarError(message: string): void {
    this.snackbar.open(message, 'Fermer', {
      duration: 6000,
      panelClass: ['error-snackbar']
    });
  }
}
