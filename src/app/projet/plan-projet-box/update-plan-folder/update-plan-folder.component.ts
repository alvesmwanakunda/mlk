import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { PlanProjetService } from 'src/app/shared/services/plan-projet.service';

@Component({
  selector: 'app-update-plan-folder',
  templateUrl: './update-plan-folder.component.html',
  styleUrls: ['./update-plan-folder.component.scss']
})
export class UpdatePlanFolderComponent {
  boxFormGroup: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdatePlanFolderComponent>,
    private planProjetService: PlanProjetService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; nom: string }
  ) {
    this.boxFormGroup = this.formBuilder.group({
      nom: [data.nom || '', Validators.required]
    });
  }

  updateFolder(): void {
    if (this.isLoading || this.boxFormGroup.invalid) {
      return;
    }

    this.isLoading = true;
    this.dialogRef.disableClose = true;

    this.planProjetService.updateFolder(this.data.id, this.boxFormGroup.value).pipe(
      finalize(() => {
        this.isLoading = false;
        this.dialogRef.disableClose = false;
      })
    ).subscribe({
      next: (res) => {
        this.openSnackBar('Dossier renommé avec succès');
        this.planProjetService.listPlans.next({ nom: 'update' });
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
