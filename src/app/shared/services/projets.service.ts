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

  public getQrcodeModule(idModule){
    return this.httpClient.get(`${environment.BASE_API_URL}/module/qrcode/${idModule}`);
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

  public countModuleByEntreprise(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/count/modules/${id}`);
  }

  public countModule(){
    return this.httpClient.get(`${environment.BASE_API_URL}/count/modules`);
  }

  public affectModule(body,id){
    return this.httpClient.post(`${environment.BASE_API_URL}/projet/module/${id}`, body);
  }

  public getProjetModule(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/projet/module/${id}`);
  }

  public deleteProjetModule(id){
    return this.httpClient.delete(`${environment.BASE_API_URL}/projet/module/${id}`);
  }

  public getQrcodeInfo(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/module/qrcode/infos/${id}`)
  }

  // Historique

  public addHistorique(id, body){
    return this.httpClient.post(`${environment.BASE_API_URL}/historique/save/${id}`,body)
  }

  public updateHistorique(id, body){
    return this.httpClient.put(`${environment.BASE_API_URL}/historique/update/${id}`,body)
  }

  public allHistorique(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/historique/list/${id}`)
  }

  public getHistorique(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/historique/get/${id}`)
  }

  public deleteHistorique(id){
    return this.httpClient.delete(`${environment.BASE_API_URL}/historique/${id}`)
  }

  // Plan

  public addPlanModule(id, body){
    return this.httpClient.post(`${environment.BASE_API_URL}/plan/module/${id}`,body)
  }

  public updatePlanModule(id, body){
    return this.httpClient.put(`${environment.BASE_API_URL}/plan/module/${id}`,body)
  }

  public getPlanModule(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/plan/module/${id}`)
  }

  public deletePlanModule(id){
    return this.httpClient.delete(`${environment.BASE_API_URL}/plan/module/${id}`)
  }

  public getAllPlanModule(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/plans/module/${id}`)
  }



  // Devis
    public addDevis(devis){
      return this.httpClient.post(`${environment.BASE_API_URL}/devis`,devis);
    }

    public updateDevis(devis, id){
      return this.httpClient.put(`${environment.BASE_API_URL}/devis/${id}`,devis);
    }

    public updateDevisSignature(devis, id){
      return this.httpClient.put(`${environment.BASE_API_URL}/devis/signature/${id}`,devis);
    }

    public getDevis(id){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis/${id}`);
    }

    public getAllDevis(){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis`);
    }

    public getAllDevisEntreprise(id){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis/entreprise/${id}`);
    }

    public deleteDevis(id){
      return this.httpClient.delete(`${environment.BASE_API_URL}/devis/${id}`);
    }

    public getAllDevisProjet(id){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis/projet/${id}`);
    }

    public getAllProduits(){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis/produits`);
    }

    public getAllProduitsByDevis(id){
      return this.httpClient.get(`${environment.BASE_API_URL}/devis/produits/devis/${id}`);
    }

    public deleteProduitsByDevis(id){
      return this.httpClient.delete(`${environment.BASE_API_URL}/devis/produits/${id}`);
    }

    public addProduitDevis(id, body){
      return this.httpClient.post(`${environment.BASE_API_URL}/devis/produits/${id}`,body);
    }

    public updateProduitDevis(id, body){
      return this.httpClient.put(`${environment.BASE_API_URL}/devis/produits/${id}`,body);
    }

    public updateProduitUniteDevis(id, body){
      return this.httpClient.put(`${environment.BASE_API_URL}/devis/produits/unite/${id}`,body);
    }

   // Factures
   public addFacture(idDevis, body){
    return this.httpClient.put(`${environment.BASE_API_URL}/devis/facture/${idDevis}`,body);
  }

  public getAllFacture(){
    return this.httpClient.get(`${environment.BASE_API_URL}/facture`);
  }

  public getAllFactureEntreprise(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/facture/entreprise/${id}`);
  }

  public getAllFactureProjet(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/facture/projet/${id}`);
  }
}
