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

  // Module
  public addModule(module){
    return this.httpClient.post(`${environment.BASE_API_URL}/module`,module);
  }

  public updateModule(module, idModule){
    return this.httpClient.put(`${environment.BASE_API_URL}/module/${idModule}`,module);
  }

  public getModule(idModule){
    return this.httpClient.get(`${environment.BASE_API_URL}/module/${idModule}`);
  }

  public getAllModule(){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules`);
  }

  public getAllModuleByEntreprise(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/entreprise/${id}`);
  }

  public deleteModule(idModule){
    return this.httpClient.delete(`${environment.BASE_API_URL}/module/${idModule}`);
  }

  // Devis
    public addDevis(devis){
      return this.httpClient.post(`${environment.BASE_API_URL}/devis`,devis);
    }

    public updateDevis(devis, id){
      return this.httpClient.put(`${environment.BASE_API_URL}/devis/${id}`,devis);
    }

    public getDevis(id){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis/${id}`);
    }

    public getAllDevis(){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis`);
    }

    public deleteDevis(id){
      return this.httpClient.delete(`${environment.BASE_API_URL}/devis/${id}`);
    }
    public getAllDevisProjet(id){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis/projet/${id}`);
    }

   // Factures
   public addFacture(facture){
    return this.httpClient.post(`${environment.BASE_API_URL}/devis`,facture);
  }

  public updateFacture(facture, id){
    return this.httpClient.put(`${environment.BASE_API_URL}/devis/${id}`,facture);
  }

  public getFacture(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/facture/${id}`);
  }

  public getAllFacture(){
    return this.httpClient.get(`${environment.BASE_API_URL}/factures`);
  }

  public deleteFacture(id){
    return this.httpClient.delete(`${environment.BASE_API_URL}/facture/${id}`);
  }
  public getAllFactureProjet(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/facture/projet/${id}`);
  }
}
