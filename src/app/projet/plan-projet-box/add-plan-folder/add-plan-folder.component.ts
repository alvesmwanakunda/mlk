import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { PlanProjetService } from 'src/app/shared/services/plan-projet.service';

@Component({
  selector: 'app-add-plan-folder',
  templateUrl: './add-plan-folder.component.html',
  styleUrls: ['./add-plan-folder.component.scss']
})
export class AddPlanFolderComponent implements OnInit {
  boxFormGroup: FormGroup;
  idFolder: string;
  idProjet: string;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddPlanFolderComponent>,
    private planProjetService: PlanProjetService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idProjet = this.data.id;
    this.idFolder = this.data.idFolder;
  }

  ngOnInit() {
    this.boxFormGroup = this.formBuilder.group({
      nom: ['', Validators.required]
    });
  }

  addFolder(): void {
    if (this.isLoading || this.boxFormGroup.invalid) {
      return;
    }

    const payload: { nom: string; dossierParent?: string } = {
      nom: this.boxFormGroup.value.nom
    };

    if (this.idFolder) {
      payload.dossierParent = this.idFolder;
    }

    this.isLoading = true;
    this.dialogRef.disableClose = true;

    this.planProjetService.addFolderByProjet(this.idProjet, payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.dialogRef.disableClose = false;
      })
    ).subscribe({
      next: (res) => {
        this.openSnackBar('Dossier ajouté avec succès');
        this.dialogRef.close(res);
      },
      error: (error) => {
        this.openSnackBar(error?.error?.message || "Une erreur s'est produite.");
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', { duration: 6000 });
  }
}
