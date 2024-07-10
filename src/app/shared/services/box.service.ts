import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoxService {

  listDossier:BehaviorSubject<{}>=new BehaviorSubject('');
  PrevieusBox:BehaviorSubject<{}>=new BehaviorSubject('');

  constructor(private readonly httpClient: HttpClient) { }

  public getAllDocuments(){
    return this.httpClient.get(`${environment.BASE_API_URL}/dossier`)
  }
  public addFile(file){
    return this.httpClient.post(`${environment.BASE_API_URL}/fichier`,file);
  }
  public updateFile(idFile,file){
    return this.httpClient.put(`${environment.BASE_API_URL}/fichier/${idFile}`,file);
  }
  public addFolder(folder){
    return this.httpClient.post(`${environment.BASE_API_URL}/dossier`,folder);
  }
  public getFile(idFile){
    return this.httpClient.get(`${environment.BASE_API_URL}/fichier/${idFile}`)
  }
  public getFolderId(idDoc){
    return this.httpClient.get(`${environment.BASE_API_URL}/dossier/read/${idDoc}`)
  }
  public getFolderDetailId(idDoc){
    return this.httpClient.get(`${environment.BASE_API_URL}/dossier/${idDoc}`)
  }
  public updateFolder(idDoc, doc){
    return this.httpClient.put(`${environment.BASE_API_URL}/dossier/${idDoc}`,doc)
  }
  public deleteFolder(idFolder){
    return this.httpClient.delete(`${environment.BASE_API_URL}/dossier/${idFolder}`)
  }
  public deleteFile(idFile){
    return this.httpClient.delete(`${environment.BASE_API_URL}/fichier/${idFile}`)
  }

  // box projet

  public getFolderByProjet(idProjet){
    return this.httpClient.get(`${environment.BASE_API_URL}/dossier/projet/${idProjet}`)
  }

  public addFolderByProjet(idProjet,folder){
    return this.httpClient.post(`${environment.BASE_API_URL}/dossier/projet/${idProjet}`,folder)
  }

  /*downloadFile(filePath: string,fileName: string): void {
    const a = document.createElement('a');
    a.href = filePath;
    a.download = fileName; // Nom du fichier à télécharger
    a.target = '_blank'; // Ouvrir dans un nouvel onglet/fenêtre
    a.click();
  }*/

  downloadPDF(url: string): Observable<Blob> {
    const options = { responseType: 'blob' as 'json' };
    return this.httpClient
   .get<Blob>(url, options)
   .pipe(map((res) => {
    return new Blob([res], { type: 'application/pdf' });
    })
    );
 }

 downloadFile(url){
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.download = 'file.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

 // move folder and file

public moveFolder(id,parent){
  return this.httpClient.get(`${environment.BASE_API_URL}/dossier/move/${id}/${parent}`)
}

public moveFile(id,parent){
  return this.httpClient.get(`${environment.BASE_API_URL}/fichier/move/${id}/${parent}`)
}







}
