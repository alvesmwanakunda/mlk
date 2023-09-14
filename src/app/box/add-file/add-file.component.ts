import { Component,OnInit, Input } from '@angular/core';
import { BoxComponent } from '../box.component';
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
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {

  fichiers:any=[];
  fileName:any;
  file:File;
  progress:number;
  idFolder:any;
  @Input() id?:any;

  constructor(
    private boxService : BoxService,
    private http: HttpClient
  ){}

  ngOnInit(){
    console.log("dossier", this.id);
  }

  onFileSelected(event){
    //console.log("File", event.target.files[0]);
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.addFile(this.file);

  }

  addFile(file){
    this.progress=1;
    const formData:FormData=new FormData();
    formData.append("uploadfile", file);
    if(this.id){
      formData.append('dossierParent',this.id);
    }
    return this.http.post(`${environment.BASE_API_URL}/fichier`,formData,{
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
        return throwError(err.message);
      })
    ).toPromise();
  }
}
