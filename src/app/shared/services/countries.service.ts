import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor( private http: HttpClient) { }

  getCountries():Observable<any>{
    return this.http.get<any>('assets/countries.json')
  }

  getDevises():Observable<any>{
    return this.http.get<any>('assets/devis.json')
  }

  getImage():Observable<any>{
    return this.http.get<any>('assets/image.json')
  }

  getMonth():Observable<any>{
    return this.http.get<any>('assets/month.json')
  }
}
