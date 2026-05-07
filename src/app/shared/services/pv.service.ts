import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PvService {

  constructor(private readonly httpClient: HttpClient) { }

  public createPV(data, idProjet){
    return this.httpClient.post(`${environment.BASE_API_URL}/pv/create/${idProjet}`, data)
  }

  public updatePV(data, idPv){
    return this.httpClient.put(`${environment.BASE_API_URL}/pv/update/${idPv}`, data)
  }

  public deletePV(idPV){
    return this.httpClient.delete(`${environment.BASE_API_URL}/pv/${idPV}`)
  }

  public getPV(idPV){
    return this.httpClient.get(`${environment.BASE_API_URL}/pv/${idPV}`)
  }

  public getAllPV(idPV){
    return this.httpClient.get(`${environment.BASE_API_URL}/pv/all/${idPV}`)
  }

  public createRevision(pvId: string, formData: FormData) {
    return this.httpClient.post(`${environment.BASE_API_URL}/pv-receptions/${pvId}/revision`, formData);
  }

  public sendPvByMail(
    idPv: string,
    destinataires: Array<{ nom: string; prenom: string; email: string }>,
    pvReception?: File
  ) {
    const formData = new FormData();
    if (pvReception) {
      formData.append('pvReception', pvReception);
    }
    formData.append('destinataires', JSON.stringify(destinataires || []));
    return this.httpClient.post(`${environment.BASE_API_URL}/pv/send-mail/${idPv}`, formData);
  }

  // For signature 

  public sendSignatureMail(
    idPv: string,
    destinataire: { nom: string; prenom: string; email: string },
  ) {
    return this.httpClient.post(`${environment.BASE_API_URL}/pv/send-signature-request/${idPv}`, {destinataire: JSON.stringify(destinataire)});
  }

  public getPVForSignature(idPV: string, code: string){
    return this.httpClient.get(`${environment.BASE_API_URL}/pv/signature/${idPV}?code=${code}`)
  }

   public validateClientSignature(
    idPv: string,
    data: {
      code: string,
      signerName: string,
      signatureUrl: string,
      refuseReception: boolean,
      refusalReason: string,
      comment: string,
    }
  ) {
    return this.httpClient.post(`${environment.BASE_API_URL}/pv/validate-signature/${idPv}`, data);
  }



}
