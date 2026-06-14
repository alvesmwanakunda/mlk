import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { PlanProjetService } from 'src/app/shared/services/plan-projet.service';

@Component({
  selector: 'app-delete-plan-file',
  templateUrl: './delete-plan-file.component.html',
  styleUrls: ['./delete-plan-file.component.scss']
})
export class DeletePlanFileComponent {
  isLoading = false;

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DeletePlanFileComponent>,
    private planProjetService: PlanProjetService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  deleteFile(): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.dialogRef.disableClose = true;

    this.planProjetService.deleteFile(this.data.id).pipe(
      finalize(() => {
        this.isLoading = false;
        this.dialogRef.disableClose = false;
      })
    ).subscribe({
      next: (res) => {
        this.openSnackBar('Fichier supprimé avec succès');
        this.planProjetService.listPlans.next({ nom: 'delete' });
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
