import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { PlanProjetService } from 'src/app/shared/services/plan-projet.service';

export type FileIconType = 'pdf' | 'doc' | 'xls' | 'pptx' | 'image' | 'generic';

@Component({
  selector: 'app-validate-plan-file',
  templateUrl: './validate-plan-file.component.html',
  styleUrls: ['./validate-plan-file.component.scss']
})
export class ValidatePlanFileComponent {
  isLoading = false;

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ValidatePlanFileComponent>,
    private planProjetService: PlanProjetService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; nom: string; action: 'approve' | 'reject' }
  ) {}

  get isApprove(): boolean {
    return this.data.action === 'approve';
  }

  get extension(): string {
    const parts = (this.data.nom || '').split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  get fileIconType(): FileIconType {
    const ext = this.extension;
    if (ext === 'pdf') {
      return 'pdf';
    }
    if (['doc', 'docx'].includes(ext)) {
      return 'doc';
    }
    if (['xls', 'xlsx'].includes(ext)) {
      return 'xls';
    }
    if (['ppt', 'pptx'].includes(ext)) {
      return 'pptx';
    }
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      return 'image';
    }
    return 'generic';
  }

  confirm(): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.dialogRef.disableClose = true;

    this.planProjetService.validateFile(this.data.id, this.data.action).pipe(
      finalize(() => {
        this.isLoading = false;
        this.dialogRef.disableClose = false;
      })
    ).subscribe({
      next: (res) => {
        const message = this.isApprove
          ? 'Plan validé et activé'
          : 'Plan rejeté';
        this.openSnackBar(message);
        this.planProjetService.listPlans.next({ nom: 'validation' });
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
