import { Component,OnInit, Input } from '@angular/core';
import { BoxService } from 'src/app/shared/services/box.service';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment} from 'src/environments/environment';

@Component({
  selector: 'app-file-box',
  templateUrl: './file-box.component.html',
  styleUrls: ['./file-box.component.scss']
})
export class FileBoxComponent implements OnInit {

  fichiers:any=[];
  fileName:any;
  files:any;
  progress:number;
  idFolder:any;
  @Input() id?:any;
  @Input() idProjet?:any;
  error:any;

  constructor(
    private boxService : BoxService,
    private http: HttpClient
  ){}

  ngOnInit(){
    console.log("dossier", this.id);
  }

  onFileSelected(event){
    //console.log("File", event.target.files[0]);
    /*this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.addFile(this.file);*/

    this.files = event.target.files;
    for(let file of this.files){
      this.fileName = file.name;
      this.addFile(file);
    }

  }

  addFile(file){
    this.progress=1;
    const formData:FormData=new FormData();
    formData.append("uploadfile", file);
    if(this.id){
      formData.append('dossierParent',this.id);
    }
    return this.http.post(`${environment.BASE_API_URL}/fichier/projet/${this.idProjet}`,formData,{
      reportProgress:true,
      observe:'events'
    })
    .pipe(
      map((event:any)=>{
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round((100/event.total)*event.loaded);
        }else if(event.type==HttpEventType.Response){
          this.boxService.listDossier.next({nom:this.fileName});
          this.progress=null;
        }
      }),
      catchError((err:any)=>{
        this.progress=null;
        this.error=err.message;
        return throwError(err.message);
      })
    ).toPromise();
  }

}
