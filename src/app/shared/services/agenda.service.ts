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

 public getAgendaWeb(idAgenda){
  return this.httpClient.get(`${environment.BASE_API_URL}/agenda/web/${idAgenda}`)
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

 // Agenda Projet

 public addAgendaProjet(agenda, idProjet){
  return this.httpClient.post(`${environment.BASE_API_URL}/projet/agenda/${idProjet}`,agenda);
}

public getAgendaProjet(idAgenda){
 return this.httpClient.get(`${environment.BASE_API_URL}/projet/agenda/${idAgenda}`)
}

public getAgendaProjetWeb(idAgenda){
  return this.httpClient.get(`${environment.BASE_API_URL}/projet/agenda/web/${idAgenda}`)
 }

public getAllAgendaProjet(idProjet){
 return this.httpClient.get(`${environment.BASE_API_URL}/projet/agenda/by/${idProjet}`)
}

public updateAgendaProjet(idAgenda, agenda){
 return this.httpClient.put(`${environment.BASE_API_URL}/projet/agenda/${idAgenda}`,agenda)
}

public deleteAgendaProjet(idAgenda){
 return this.httpClient.delete(`${environment.BASE_API_URL}/projet/agenda/${idAgenda}`)
}

}
