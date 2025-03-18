import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntreprisesService {


  constructor(private readonly httpClient: HttpClient) { }


  public addEntreprise(entreprise){
     return this.httpClient.post(`${environment.BASE_API_URL}/entreprise`,entreprise);
  }

  public newAddEntreprise(entreprise){
    return this.httpClient.post(`${environment.BASE_API_URL}/add/entreprise`,entreprise);
 }

  public getEntreprise(idEntreprise){
    return this.httpClient.get(`${environment.BASE_API_URL}/entreprise/${idEntreprise}`)
  }

  public checkSociete(societe){
    return this.httpClient.get(`${environment.BASE_API_URL}/check-societe/${societe}`,);
  }

  public getAllEntreprise(){
    return this.httpClient.get(`${environment.BASE_API_URL}/entreprise`)
  }

  public updateEntreprise(idEntreprise, entreprise){
    return this.httpClient.put(`${environment.BASE_API_URL}/entreprise/${idEntreprise}`,entreprise)
  }

  public deleteEntreprise(idEntreprise){
    return this.httpClient.delete(`${environment.BASE_API_URL}/entreprise/${idEntreprise}`)
  }

  public updateEntreprisePhoto(idEntreprise, entreprise){
    return this.httpClient.put(`${environment.BASE_API_URL}/entreprise/file/${idEntreprise}`,entreprise)
  }

  public searchApiFrance(body){
    return this.httpClient.get(`${environment.BASE_API_URL}/api-search/${body}`)
  }

  // Conge

  public listConges(){
    return this.httpClient.get(`${environment.BASE_API_URL}/conge`)
  }

  public listCongesUser(){
    return this.httpClient.get(`${environment.BASE_API_URL}/conge/user`)
  }

  public addConge(data){
    return this.httpClient.post(`${environment.BASE_API_URL}/conge`,data)
  }

  public updateConge(data, id){
    return this.httpClient.put(`${environment.BASE_API_URL}/conge/${id}`,data)
  }

  public getConge(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/conge/${id}`)
  }

  public statusConge(data, id){
    return this.httpClient.put(`${environment.BASE_API_URL}/conge/status/${id}`,data)
  }

  public valideConge(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/conge/valider/${id}`)
  }

  public refuseConge(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/conge/refuser/${id}`)
  }

  public openFile(url){
    const encodedPath = encodeURIComponent(url);
    return this.httpClient.get(`${environment.BASE_API_URL}/open/fichier/${encodedPath}`);
  }

  downloadFile(url){
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = 'file.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



}
