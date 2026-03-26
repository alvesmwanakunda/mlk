import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PvService } from 'src/app/shared/services/pv.service';

type Destinataire = {
  nom: string;
  prenom: string;
  email: string;
};

type SendMailDialogData = {
  idPv: string;
  defaultDestinataires?: Destinataire[];
};

@Component({
  selector: 'app-sendmail-pv',
  templateUrl: './sendmail-pv.component.html',
  styleUrls: ['./sendmail-pv.component.scss']
})
export class SendmailPvComponent implements OnInit {
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
      destinataires: this.fb.array([])
    });

    const defaults = this.data?.defaultDestinataires || [];
    if (defaults.length) {
      defaults.forEach((d) => this.addDestinataire(d));
    } else {
      this.addDestinataire();
    }
  }

  get destinataires(): FormArray {
    return this.form.get('destinataires') as FormArray;
  }

  addDestinataire(value?: Partial<Destinataire>): void {
    this.destinataires.push(this.fb.group({
      nom: [value?.nom || '', [Validators.required]],
      prenom: [value?.prenom || '', [Validators.required]],
      email: [value?.email || '', [Validators.required, Validators.email]],
    }));
  }

  removeDestinataire(index: number): void {
    this.destinataires.removeAt(index);
    if (this.destinataires.length === 0) {
      this.addDestinataire();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) {
      this.pvReceptionFile = null;
      return;
    }
    this.pvReceptionFile = input.files[0];
  }

  send(): void {
    if (!this.data?.idPv) {
      this.openSnackBarError('Identifiant du PV manquant.');
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid || this.destinataires.length === 0) {
      this.openSnackBarError('Veuillez renseigner des destinataires valides.');
      return;
    }

    const recipients: Destinataire[] = this.destinataires.controls.map((ctrl: any) => ({
      nom: (ctrl.get('nom')?.value || '').trim(),
      prenom: (ctrl.get('prenom')?.value || '').trim(),
      email: (ctrl.get('email')?.value || '').trim(),
    }));

    this.isLoading = true;
    this.pvService.sendPvByMail(this.data.idPv, recipients, this.pvReceptionFile || undefined).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.openSnackBar(res?.message || 'Mail envoyé avec succès.');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        console.log('Erreur envoi mail PV:', error);
        this.openSnackBarError('Une erreur s\'est produite lors de l\'envoi du mail.');
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
