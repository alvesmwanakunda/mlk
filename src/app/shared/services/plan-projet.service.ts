import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanProjetService {
  listPlans = new BehaviorSubject<{}>('');

  constructor(private readonly httpClient: HttpClient) {}

  getPlansByProjet(idProjet: string) {
    return this.httpClient.get(`${environment.BASE_API_URL}/plan/projet/${idProjet}`);
  }

  getPlanFolderDetail(idDossier: string) {
    return this.httpClient.get(`${environment.BASE_API_URL}/plan/projet/dossier/${idDossier}`);
  }

  addFolderByProjet(idProjet: string, folder: { nom: string; dossierParent?: string }) {
    return this.httpClient.post(`${environment.BASE_API_URL}/plan/projet/dossier/${idProjet}`, folder);
  }

  updateFolder(idDossier: string, folder: { nom: string }) {
    return this.httpClient.put(`${environment.BASE_API_URL}/plan/projet/dossier/${idDossier}`, folder);
  }

  deleteFolder(idDossier: string) {
    return this.httpClient.delete(`${environment.BASE_API_URL}/plan/projet/dossier/${idDossier}`);
  }

  deleteFile(idFichier: string) {
    return this.httpClient.delete(`${environment.BASE_API_URL}/plan/projet/fichier/${idFichier}`);
  }

  getUploadStatus(uploadId: string) {
    return this.httpClient.get(`${environment.BASE_API_URL}/plan/projet/upload/${uploadId}`);
  }

  uploadFiles(idProjet: string, formData: FormData) {
    return this.httpClient.post(`${environment.BASE_API_URL}/plan/projet/${idProjet}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  classifyFile(idFichier: string, isPlan: boolean) {
    return this.httpClient.patch(
      `${environment.BASE_API_URL}/plan/projet/fichier/${idFichier}/classification`,
      { isPlan }
    );
  }

  validateFile(idFichier: string, action: 'approve' | 'reject') {
    return this.httpClient.patch(
      `${environment.BASE_API_URL}/plan/projet/fichier/${idFichier}/validation`,
      { action }
    );
  }

  getActivePlansForTasks(idProjet: string) {
    return this.httpClient.get(`${environment.BASE_API_URL}/plan/projet/${idProjet}/actifs`);
  }

  getPlanFileContent(idFichier: string) {
    return this.httpClient.get(
      `${environment.BASE_API_URL}/plan/projet/fichier/${idFichier}/content`,
      { responseType: 'blob' }
    );
  }

  isSharePointPlan(plan: any): boolean {
    return plan?.planSource === 'sharepoint' || !!plan?.sharepointItemId;
  }
}
