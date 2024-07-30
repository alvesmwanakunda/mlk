import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(private readonly httpClient: HttpClient) { }

  public getTimeSheetByUser(idUser){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/user/${idUser}`)
  }

  public getTimeSheetUserByDate(idUser,month,year){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/user/${idUser}/${month}/${year}`)
  }

  public getTimeSheetByAgent(){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/agent`)
  }

  public getTimeSheetAgentByDate(month,year){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/agent/${month}/${year}`)
  }
  
  public addTimeSheet(data, idUser){
    return this.httpClient.post(`${environment.BASE_API_URL}/timesheet/${idUser}`, data)
  }

  public updateTimeSheet(data,id){
    return this.httpClient.put(`${environment.BASE_API_URL}/timesheet/${id}`, data)
  }

  public deleteTimeSheet(id){
    return this.httpClient.delete(`${environment.BASE_API_URL}/timesheet/${id}`)
  }

  public getTimeSheet(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/${id}`)
  }


}
