import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {

  constructor(private readonly httpClient: HttpClient) { }

  public getCategories(){
    return this.httpClient.get(`${environment.BASE_API_URL}/categories`)
  }

  public getManufactures(){
    return this.httpClient.get(`${environment.BASE_API_URL}/manufacturers`)
  }

  public getSuppliers(){
    return this.httpClient.get(`${environment.BASE_API_URL}/suppliers`)
  }

  public getProduits(){
    return this.httpClient.get(`${environment.BASE_API_URL}/produits`)
  }

  public getProduitById(id){
    return this.httpClient.get(`${environment.BASE_API_URL}/produit/${id}`)
  }

  convertImageUrlToBase64(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = (error) => reject(error);
      }, (error) => {
        reject(error);
      });
    });
  }
}
