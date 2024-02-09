import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

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


}
