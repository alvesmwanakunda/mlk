import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private readonly httpClient: HttpClient) { }

  public addAgenda(agenda){
    return this.httpClient.post(`${environment.BASE_API_URL}/agenda`,agenda);
 }

 public getAgenda(idAgenda){
   return this.httpClient.get(`${environment.BASE_API_URL}/agenda/${idAgenda}`)
 }

 public getAllAgenda(){
   return this.httpClient.get(`${environment.BASE_API_URL}/agenda`)
 }

 public updateAgenda(idAgenda, agenda){
   return this.httpClient.put(`${environment.BASE_API_URL}/agenda/${idAgenda}`,agenda)
 }

 public deleteAgenda(idAgenda){
   return this.httpClient.delete(`${environment.BASE_API_URL}/agenda/${idAgenda}`)
 }

}
