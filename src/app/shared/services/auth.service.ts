import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();

  constructor(
    private readonly httpClient: HttpClient,
    private router: Router
  ) { }

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
}
