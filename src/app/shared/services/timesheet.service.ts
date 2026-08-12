import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TimesheetStatisticsResponse } from '../interfaces/timeSheet.model';

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

  public getTimeSheetUserByPeriod(idUser,startDate,endDate){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/user/period/${idUser}/${startDate}/${endDate}`)
  }

  public getTimeSheetUserStatistics(
    idUser: string,
    month?: number,
    year?: number
  ): Observable<TimesheetStatisticsResponse> {
    let params = new HttpParams();

    if (month !== undefined) {
      params = params.set('month', month.toString());
    }

    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    return this.httpClient.get<TimesheetStatisticsResponse>(
      `${environment.BASE_API_URL}/timesheet/user/${idUser}/statistics`,
      { params }
    );
  }

  public getTimeSheetByAgent(){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/agent`)
  }

  public getTimeSheetAgentByDate(month,year){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/agent/${month}/${year}`)
  }

  public getTimeSheetDonwload(month,year){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/donwload/excel/${month}/${year}`)
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

  public getAllTimeSheetToDay(){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/today`)
  }

  getTimesheetsByMonth(month: string){
   return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/month/${month}`);
  }

  getTimesheetsByDay(date: string){
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/day/${date}`);
  }

  getTimesheetsByPeriod(startDate: string, endDate: string) {
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/period`, {
      params: { startDate, endDate }
    });
  }

  getTimesheetsAdvanced(filters: any) {
    return this.httpClient.get(`${environment.BASE_API_URL}/timesheet/advanced`, { params: filters });
  }


}
