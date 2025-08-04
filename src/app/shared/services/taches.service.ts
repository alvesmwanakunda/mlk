import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

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


}
