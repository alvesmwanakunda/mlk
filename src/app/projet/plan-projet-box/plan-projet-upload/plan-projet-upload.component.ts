import { Component, Input, OnDestroy } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { PlanProjetService } from 'src/app/shared/services/plan-projet.service';
import { ClassifyPlanFileComponent } from '../classify-plan-file/classify-plan-file.component';

type UploadPhase = 'browser' | 'sharepoint' | null;

@Component({
  selector: 'app-plan-projet-upload',
  templateUrl: './plan-projet-upload.component.html',
  styleUrls: ['./plan-projet-upload.component.scss']
})
export class PlanProjetUploadComponent implements OnDestroy {
  @Input() idProjet: string;
  @Input() idFolder: string;

  fileName: string;
  phase: UploadPhase = null;
  progress = 0;
  sharepointProgress = 0;
  isUploading = false;

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private planProjetService: PlanProjetService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this.clearPollTimer();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length || this.isUploading) {
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('uploadfile', file));
    if (this.idFolder) {
      formData.append('dossierParent', this.idFolder);
    }

    this.isUploading = true;
    this.phase = 'browser';
    this.progress = 1;
    this.sharepointProgress = 0;
    this.fileName = files.length === 1 ? files[0].name : `${files.length} fichiers`;

    this.planProjetService.uploadFiles(this.idProjet, formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = event.total
            ? Math.round((100 / event.total) * event.loaded)
            : 0;
          return;
        }

        if (event.type === HttpEventType.Response) {
          const jobs = event.body?.message || [];
          const uploadIds = jobs
            .map((job: any) => job.uploadId)
            .filter(Boolean);

          if (!uploadIds.length) {
            this.resetUploadState();
            this.showError('Réponse upload invalide.');
            return;
          }

          this.phase = 'sharepoint';
          this.progress = 100;
          this.sharepointProgress = 0;
          this.startSharePointPolling(uploadIds);
        }
      },
      error: (err) => {
        this.resetUploadState();
        this.showError(
          err?.error?.message || err?.message || 'Erreur lors du chargement.'
        );
      }
    });

    input.value = '';
  }

  private startSharePointPolling(uploadIds: string[]) {
    this.clearPollTimer();

    const poll = () => {
      forkJoin(uploadIds.map((id) => this.planProjetService.getUploadStatus(id))).subscribe({
        next: (responses: any[]) => {
          const jobs = responses.map((res) => res.message);
          const progresses = jobs.map((job) => job?.progress || 0);
          this.sharepointProgress = Math.round(
            progresses.reduce((sum, value) => sum + value, 0) / progresses.length
          );

          const failedJob = jobs.find((job) => job?.status === 'error');
          if (failedJob) {
            this.clearPollTimer();
            this.resetUploadState();
            this.showError(
              failedJob.error || "Erreur lors de l'envoi sur SharePoint."
            );
            return;
          }

          const allDone = jobs.every((job) => job?.status === 'done');
          if (allDone) {
            this.clearPollTimer();
            this.sharepointProgress = 100;
            const uploadedFiles = jobs
              .map((job) => job?.result)
              .filter(Boolean);
            this.openClassificationDialogs(uploadedFiles);
          }
        },
        error: () => {
          this.clearPollTimer();
          this.resetUploadState();
          this.showError("Impossible de suivre l'envoi SharePoint.");
        }
      });
    };

    poll();
    this.pollTimer = setInterval(poll, 1000);
  }

  private openClassificationDialogs(files: any[]) {
    if (!files.length) {
      this.planProjetService.listPlans.next({ nom: 'upload' });
      this.resetUploadState();
      return;
    }

    let index = 0;

    const openNext = () => {
      if (index >= files.length) {
        this.planProjetService.listPlans.next({ nom: 'upload' });
        this.resetUploadState();
        return;
      }

      const file = files[index];
      index += 1;

      const dialogRef = this.dialog.open(ClassifyPlanFileComponent, {
        width: '520px',
        maxWidth: '95vw',
        panelClass: 'classify-plan-dialog-panel',
        disableClose: false,
        data: { id: file._id, nom: file.nom }
      });

      dialogRef.afterClosed().subscribe(() => {
        openNext();
      });
    };

    openNext();
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 8000,
      panelClass: ['error-snackbar']
    });
  }

  private clearPollTimer() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private resetUploadState() {
    this.clearPollTimer();
    this.phase = null;
    this.progress = 0;
    this.sharepointProgress = 0;
    this.fileName = null;
    this.isUploading = false;
  }
}
