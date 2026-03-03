import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from 'src/app/shared/services/box.service';

@Component({
  selector: 'app-rename-file-projet',
  templateUrl: './rename-file-projet.component.html',
  styleUrls: ['./rename-file-projet.component.scss']
})
export class RenameFileProjetComponent implements OnInit {

  renameFormGroup: FormGroup;
  message: any;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private boxService: BoxService,
    public dialogRef: MatDialogRef<RenameFileProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.renameFormGroup = this.formBuilder.group({
      nom: [this.data?.nom || '', Validators.required]
    });
  }

  rename(): void {
    if (this.renameFormGroup.invalid) {
      return;
    }

    const nom = this.renameFormGroup.value.nom?.trim();
    if (!nom || nom === this.data?.nom) {
      this.dialogRef.close(false);
      return;
    }

    this.boxService.renameFileProjet(this.data.id, { nom }).subscribe((res: any) => {
      this.message = 'Fichier renommé avec succès';
      this.openSnackBar(this.message);
      this.dialogRef.close(res);
    }, () => {
      this.message = "Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
    });
  }

  openSnackBar(message) {
    this.snackBar.open(message, 'Fermer', {
      duration: 6000,
    });
  }
}
