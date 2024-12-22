import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import imageCompression from 'browser-image-compression';

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

  public getAllModuleStock(){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/stock`);
  }

  public getAllModulePr(){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/preparation`);
  }

  public getAllModulePp(){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/partir`);
  }

  public getAllModuleSite(){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/site`);
  }

  public getAllModuleByEntreprise(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/entreprise/${id}`);
  }

  public getAllModuleByEntrepriseStock(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/entreprise/${id}/stock`);
  }

  public getAllModuleByEntreprisePr(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/entreprise/${id}/preparation`);
  }

  public getAllModuleByEntreprisePp(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/entreprise/${id}/partir`);
  }

  public getAllModuleByEntrepriseSite(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/entreprise/${id}/site`);
  }

  public getAllModuleByProjet(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/projet/module/list/${id}`);
  }

  public deletePhoto(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/projet/delete/photo/${id}`);
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

  public getOneProjetModule(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/projet/module/plan/${id}`);
  }

  public getQrcodeInfo(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/module/qrcode/infos/${id}`)
  }

  // Affecte projet direct dans un projet

  public listModuleNotSite(){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/notsite`);
  }

  public addStockToProjet(idModule, idProjet){
    return this.httpClient.get(`${environment.BASE_API_URL}/modules/notsite/${idModule}/${idProjet}`);
  }



  public createFicheTechnique(body, idModule){
    return this.httpClient.post(`${environment.BASE_API_URL}/module/fiche/${idModule}`, body);
  }

  public getFicheTechnique(idModule){
    return this.httpClient.get(`${environment.BASE_API_URL}/module/fiche/${idModule}`);
  }

  public updateFicheTechnique(idFiche,body){
    return this.httpClient.put(`${environment.BASE_API_URL}/module/fiche/${idFiche}`, body);
  }

  public deleteFicheTechnique(idFiche,){
    return this.httpClient.delete(`${environment.BASE_API_URL}/module/fiche/${idFiche}`);
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

    public sendDevis(id, body){
      return this.httpClient.post(`${environment.BASE_API_URL}/send/devis/${id}`,body);
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
  // Prestations

  public getAllPrestations(){
    return this.httpClient.get(`${environment.BASE_API_URL}/categorie/prestation`);
  }

  public addPrestation(body){
    return this.httpClient.post(`${environment.BASE_API_URL}/categorie/prestation`, body);
  }

  public updatePrestation(idPrestation, body){
    return this.httpClient.put(`${environment.BASE_API_URL}/categorie/prestation/${idPrestation}`, body);
  }

  public getPrestation(idPrestation){
    return this.httpClient.get(`${environment.BASE_API_URL}/categorie/prestation/${idPrestation}`);
  }

  public deletePrestation(idPrestation){
    return this.httpClient.delete(`${environment.BASE_API_URL}/categorie/prestation/${idPrestation}`);
  }

  // Produit Prestation

  public getAllProduitPrestations(){
    return this.httpClient.get(`${environment.BASE_API_URL}/prestations`);
  }

  public getAllProduitPrestationsByCat(idCat){
    return this.httpClient.get(`${environment.BASE_API_URL}/prestation/all/${idCat}`);
  }

  public addProduitPrestation(idCat,body){
    return this.httpClient.post(`${environment.BASE_API_URL}/prestation/${idCat}`, body);
  }

  public updateProduitPrestation(idPrestation, body){
    return this.httpClient.put(`${environment.BASE_API_URL}/prestation/${idPrestation}`, body);
  }

  public getProduitPrestation(idPrestation){
    return this.httpClient.get(`${environment.BASE_API_URL}/prestation/${idPrestation}`);
  }

  public deleteProduitPrestation(idPrestation){
    return this.httpClient.delete(`${environment.BASE_API_URL}/prestation/${idPrestation}`);
  }



  // resize image angular editor
  resizeImages(){
    const editorElement = document.querySelector('.angular-editor');
    if(editorElement){
      const images = editorElement.querySelectorAll('img');
      images.forEach((img:HTMLImageElement)=>{
        img.style.width='200px';
        img.style.height='150x';
        //const base64Str = img.src;
        /*this.resizeImage(base64Str, 200, 150,(resizedBase64)=>{
          img.src = resizedBase64;
        })*/
      });
    }
  }

  resizeImage(base64Str: string, width: number, height: number, callback: (resizedBase64: string) => void) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const resizedBase64 = canvas.toDataURL();
        callback(resizedBase64);
      }
    };
  }

  processImagesInHtml(html: string, callback: (processedHtml: string) => void) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    let imagesProcessed = 0;

    images.forEach((img: HTMLImageElement) => {
      const base64Str = img.src;
      this.resizeImage(base64Str, 300, 300, (resizedBase64) => {
        img.src = resizedBase64;
        imagesProcessed++;
        if (imagesProcessed === images.length) {
          callback(doc.body.innerHTML);
        }
      });
    });

    if (images.length === 0) {
      callback(html);
    }
  }

  validateImageSize(file:File, maxSizeInBytes:number):boolean{
    return file.size <= maxSizeInBytes;
  }

  // compression des iamges

  async compressImage(base64Str: string, maxSizeMB: number = 1, maxWidthOrHeight: number = 1920): Promise<string> {
    const file = await this.base64ToFile(base64Str);
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true
    };
    const compressedFile = await imageCompression(file, options);
    return await this.fileToBase64(compressedFile);
  }

  base64ToFile(base64Str: string): Promise<File> {
    return fetch(base64Str)
      .then(res => res.blob())
      .then(blob => new File([blob], 'image.jpg', { type: 'image/jpeg' }));
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }



}
