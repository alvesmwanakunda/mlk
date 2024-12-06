import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly httpClient: HttpClient,
    private router: Router,
  ) { }

  /*public isAuthenticated():boolean{
    let token = JSON.parse(localStorage.getItem("user"));
    return !this.jwtHelper.isTokenExpired(token.token);
  }*/

  private handleError(error:any):Promise<any>{
    localStorage.clear();
    return Promise.reject(error.message||error);
  }

  public signin(credentials:Object):Promise<any>{

    return this.httpClient
    .post(`${environment.BASE_API_URL}/auth`,credentials)
    .toPromise()
    .then((response)=> response as Object)
    .catch(this.handleError)
  }

  public lostPassword(credentials:Object):Promise<any>{
    return this.httpClient
    .post(`${environment.BASE_API_URL}/reset`,credentials)
    .toPromise()
    .then((response)=> response as Object)
    .catch(this.handleError)
  }

  public resetPassword(credentials:Object):Promise<any>{
    return this.httpClient
    .post(`${environment.BASE_API_URL}/reset/password`,credentials)
    .toPromise()
    .then((response)=> response as Object)
    .catch(this.handleError)
  }

  public signup(credentials){
    return this.httpClient.post(`${environment.BASE_API_URL}/signup`, credentials);
  }

  public updateProfil(credentials){
    return this.httpClient.put(`${environment.BASE_API_URL}/update/profil`, credentials);
  }

  public updateProfilPassword(credentials){
    return this.httpClient.put(`${environment.BASE_API_URL}/update/profil/password`, credentials);
  }

  public checkEmail(email){
    return this.httpClient.get(`${environment.BASE_API_URL}/check-email/${email}`,);
  }

  setUser(user:Object):void{
    localStorage.setItem("user",JSON.stringify(user))
  }
  logout(){
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  // Employées

  listEmployes(){
    return this.httpClient.get(`${environment.BASE_API_URL}/employe`,);
  }

  listTransporteurs(){
    return this.httpClient.get(`${environment.BASE_API_URL}/transporteur`,);
  }


  addEmploye(data){
    return this.httpClient.post(`${environment.BASE_API_URL}/employe`,data);
  }

  addTransporteur(data){
    return this.httpClient.post(`${environment.BASE_API_URL}/transporteur`,data);
  }

  updateEmploye(data,id){
    return this.httpClient.put(`${environment.BASE_API_URL}/employe/${id}`,data);
  }

  getEmploye(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/employe/${id}`);
  }

  activeEmploye(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/active/employe/${id}`);
  }

  dissableEmploye(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/dissable/employe/${id}`);
  }
}
