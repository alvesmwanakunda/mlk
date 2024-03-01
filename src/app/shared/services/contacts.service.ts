import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private readonly httpClient: HttpClient) { }


  public addContact(contact){
     return this.httpClient.post(`${environment.BASE_API_URL}/contact`,contact);
  }

  public addContactEntreprise(contact, idEntrepise){
    return this.httpClient.post(`${environment.BASE_API_URL}/contact/entreprise/${idEntrepise}`,contact);
 }

  public getContact(idContact){
    return this.httpClient.get(`${environment.BASE_API_URL}/contact/${idContact}`)
  }

  public getAllContact(){
    return this.httpClient.get(`${environment.BASE_API_URL}/contact`)
  }

  public updateContact(idContact, contact){
    return this.httpClient.put(`${environment.BASE_API_URL}/contact/${idContact}`,contact)
  }

  public updateContactFacture(idContact, contact){
    return this.httpClient.put(`${environment.BASE_API_URL}/contact/adresse/${idContact}`,contact)
  }

  public deleteContact(idContact){
    return this.httpClient.delete(`${environment.BASE_API_URL}/contact/${idContact}`)
  }

  public getContactAllEntreprise(idEntrepise){
    return this.httpClient.get(`${environment.BASE_API_URL}/contact/entreprise/${idEntrepise}`)
  }

  public getContactAllProjet(idProjet){
    return this.httpClient.get(`${environment.BASE_API_URL}/contact/projet/${idProjet}`)
  }

  // Adresse de livraison

  public addContactLivraison(body, idContact){
    return this.httpClient.post(`${environment.BASE_API_URL}/contact/livraison/${idContact}`,body);
  }

  public updateContactLivraison(body, idContact){
    return this.httpClient.put(`${environment.BASE_API_URL}/contact/livraison/${idContact}`,body);
  }
  public getContactLivraison(idContact){
    return this.httpClient.get(`${environment.BASE_API_URL}/contact/livraison/${idContact}`);
  }


  /*public updateEntreprisePhoto(idEntreprise, entreprise){
    return this.httpClient.put(`${environment.BASE_API_URL}/entreprise/file/${idEntreprise}`,entreprise)
  }*/
}
