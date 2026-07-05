import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { VoiceTaskDraft, VoiceTaskResponse } from '../interfaces/voiceTask.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class TachesService {

  constructor(private readonly httpClient: HttpClient) { }

  public addTTache(data, idProjet){
    return this.httpClient.post(`${environment.BASE_API_URL}/taches/${idProjet}`, data)
  }

  public updateTache(data,id){
    return this.httpClient.put(`${environment.BASE_API_URL}/taches/${id}`, data)
  }

  public deleteTache(id){
    return this.httpClient.delete(`${environment.BASE_API_URL}/taches/${id}`)
  }

  public getTache(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/taches/${id}`)
  }

   public getAllTache(idProjet){
    return this.httpClient.get(`${environment.BASE_API_URL}/taches/projet/${idProjet}`)
  }

  // Ajouter images (multipart)
  updateImagesToTask(taskId: string, files: File[]): Observable<any> {
    const fd = new FormData();
    files.forEach(f => fd.append('image', f, f.name));

    // ⚠️ ne mets pas Content-Type, Angular gère le boundary
    return this.httpClient.put(`${environment.BASE_API_URL}/taches/${taskId}/images`, fd);
  }

  // Supprimer images (JSON)
  deleteImagesFromTask(taskId: string, paths: string[]): Observable<any> {
    // Angular delete ne prend pas body sur toutes versions → on passe par request()
    return this.httpClient.request('DELETE', `${environment.BASE_API_URL}/taches/${taskId}/images`, {
      body: { paths }
    });
  }

  // Times

  public addTime(data, idTache){
    return this.httpClient.post(`${environment.BASE_API_URL}/time/taches/${idTache}`, data)
  }

  public updateTime(data,id){
    return this.httpClient.put(`${environment.BASE_API_URL}/time/taches/${id}`, data)
  }

  public deleteTime(id){
    return this.httpClient.delete(`${environment.BASE_API_URL}/time/taches/${id}`)
  }

  public getTime(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/time/taches/${id}`)
  }

   public getAllTime(idTache){
    return this.httpClient.get(`${environment.BASE_API_URL}/time/tache/${idTache}`)
  }

    // Sous Taches

  public addSubTask(data, idTache){
    return this.httpClient.post(`${environment.BASE_API_URL}/sous/taches/${idTache}`, data)
  }

  public updateSubTask(data,id){
    return this.httpClient.put(`${environment.BASE_API_URL}/sous/taches/${id}`, data)
  }

  public deleteSubTask(id){
    return this.httpClient.delete(`${environment.BASE_API_URL}/sous/taches/${id}`)
  }

  public getSubTask(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/sous/taches/${id}`)
  }

  public getAllSubTask(idTache){
    return this.httpClient.get(`${environment.BASE_API_URL}/sous/tache/${idTache}`)
  }

  public getHistoriqueTask(idTache){
    return this.httpClient.get(`${environment.BASE_API_URL}/historiques/tache/${idTache}`)
  }

  extractFromAudio(projectId: string, audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'tache-audio.webm');

    return this.httpClient.post<VoiceTaskResponse>(
      `${environment.BASE_API_URL}/taches/voice/${projectId}`,
      formData
    );
  }

  createTaskAudio(projectId: string, draft: VoiceTaskDraft) {
    return this.httpClient.post(`${environment.BASE_API_URL}/taches/${projectId}`, {
      titre: draft.titre,
      assignes: draft.assignes,
      date_debut: draft.date_debut,
      date_fin: draft.date_fin,
      description: draft.description
    });
  }

  getStatistique(){
    return this.httpClient.get(`${environment.BASE_API_URL}/taches/statistiques`)
  }

  getNotificationsTask(){
    return this.httpClient.get(`${environment.BASE_API_URL}/notificationstask`)
  }

  updateNotificationsTask(idTask){
    const body = {"isLire": true}
    return this.httpClient.put(`${environment.BASE_API_URL}/notificationstask/${idTask}`,body)
  }




}
