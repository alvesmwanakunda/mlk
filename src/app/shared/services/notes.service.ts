import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private readonly httpClient: HttpClient) { }

  public addNoteModule(idModule,module){
    return this.httpClient.post(`${environment.BASE_API_URL}/module/note/${idModule}`,module);
  }

  public getNoteModule(idModule){
    return this.httpClient.get(`${environment.BASE_API_URL}/module/note/${idModule}`);
  }

  public getNoteProjetModule(idProjet){
    return this.httpClient.get(`${environment.BASE_API_URL}/module/projet/note/${idProjet}`);
  }

  public deleteNoteModule(idNote){
    return this.httpClient.delete(`${environment.BASE_API_URL}/module/note/${idNote}`);
  }

  public updateNoteModule(idNote, body){
    return this.httpClient.put(`${environment.BASE_API_URL}/module/note/${idNote}`,body);
  }

  public getSingleNoteModule(idNote){
    return this.httpClient.get(`${environment.BASE_API_URL}/module/note/single/${idNote}`);
  }
}
