import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjetsService {

  constructor(private readonly httpClient: HttpClient) { }

  public addProjet(projet){
    return this.httpClient.post(`${environment.BASE_API_URL}/projet`,projet);
  }

  public addProjetEntreprise(projet,idEntreprise){
    return this.httpClient.post(`${environment.BASE_API_URL}/projet/entreprise/${idEntreprise}`,projet);
  }

  public getProjet(idProjet){
    return this.httpClient.get(`${environment.BASE_API_URL}/projet/${idProjet}`)
  }

  public getProjetEntreprise(idEntreprise){
    return this.httpClient.get(`${environment.BASE_API_URL}/projet/entreprise/${idEntreprise}`)
  }

  public getAllProjet(){
    return this.httpClient.get(`${environment.BASE_API_URL}/projet`)
  }

  public updateProjet(idProjet, projet){
    return this.httpClient.put(`${environment.BASE_API_URL}/projet/${idProjet}`,projet)
  }

  public updateProjetEntreprise(idProjet, projet){
    return this.httpClient.put(`${environment.BASE_API_URL}/projet/entreprise/${idProjet}`,projet)
  }

  public deleteProjet(idProjet){
    return this.httpClient.delete(`${environment.BASE_API_URL}/projet/${idProjet}`)
  }

  public updateProjetPhoto(idProjet, projet){
    return this.httpClient.put(`${environment.BASE_API_URL}/projet/file/${idProjet}`,projet)
  }
}
