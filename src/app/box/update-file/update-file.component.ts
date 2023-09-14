import { Component,OnInit, Inject } from '@angular/core';
import { BoxService } from 'src/app/shared/services/box.service';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment} from 'src/environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoxComponent } from '../box.component';



@Component({
  selector: 'app-update-file',
  templateUrl: './update-file.component.html',
  styleUrls: ['./update-file.component.scss']
})
export class UpdateFileComponent implements OnInit {

  message:any;
  folder:any;
  fileName:any;
  file:File;
  progress:number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef:MatDialogRef<BoxComponent>,
    private boxService : BoxService,
    private http: HttpClient
  ){}

  ngOnInit(){
    this.getFile();
  }

  getFile(){
    this.boxService.getFile(this.data.id).subscribe((data:any)=>{
      this.folder = data.message;
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  onFileSelected(event){
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.updateFile(this.file);
  }


  updateFile(file){
    this.progress=1;
    const formData:FormData=new FormData();
    formData.append("uploadfile", file);
    return this.http.put(`${environment.BASE_API_URL}/fichier/${this.data.id}`,formData,{
      reportProgress:true,
      observe:'events'
    })
    .pipe(
      map((event:any)=>{
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round((100/event.total)*event.loaded);
        }else if(event.type==HttpEventType.Response){
          this.progress=null;
          this.dialogRef.close(true)
        }
      }),
      catchError((err:any)=>{
        this.progress=null;
        this.dialogRef.close(false)
        return throwError(err.message);
      })
    ).toPromise();
  }



}
