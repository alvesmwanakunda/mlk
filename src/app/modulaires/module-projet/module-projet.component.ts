import { Component, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewerStandarComponent } from '../../viewer-standar/viewer-standar.component';
import { MatDialog } from '@angular/material/dialog';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment} from 'src/environments/environment';
import { DeleteModuleProjetComponent } from 'src/app/projet/module-projet/delete-module-projet/delete-module-projet.component';



@Component({
  selector: 'app-module-projet',
  templateUrl: './module-projet.component.html',
  styleUrls: ['./module-projet.component.scss']
})
export class ModuleProjetComponent implements OnInit {

  idModule:any;
  moduleForm : FormGroup;
  projets:any=[];
  modules:any=[];
  fileName:any;
  file:any;
  progress:number;
  error:any;
  user:any;


  constructor(
    private _formBuilder :FormBuilder,
    private projetService: ProjetsService,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    private http: HttpClient
  ){
    this.route.params.subscribe((data:any)=>{
      this.idModule = data.id
     });
     this.user = JSON.parse(localStorage.getItem('user'));
  }

  champ_validation={
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }

  ngOnInit() {

    this.getAllModule();
    this.getAllProjet();

    this.moduleForm=this._formBuilder.group({
      projet:['',Validators.required],
      position:['',null]
    });
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((res:any)=>{
        this.projets=res.message
    },(error)=>{
      console.log(error);
    })
  }

  getAllModule(){
    this.projetService.getProjetModule(this.idModule).subscribe((res:any)=>{
       this.modules = res.message;
    },(error)=>{
      console.log(error);
    })
  }

  onFileSelected(event){
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    //this.updateFile(this.file);
  }

  addModule(){
    const formData:FormData=new FormData();
    formData.append("uploadfile", this.file);
    formData.append("projet", this.moduleForm.get('projet').value);
    formData.append("position", this.moduleForm.get('position').value);

    if (this.moduleForm.valid){
      return this.http.post(`${environment.BASE_API_URL}/projet/module/${this.idModule}`,formData,{
        reportProgress:true,
        observe:'events'
      })
      .pipe(
        map((event:any)=>{
          if (event.type === HttpEventType.UploadProgress){
            this.progress = Math.round((100/event.total)*event.loaded);
          }else if(event.type==HttpEventType.Response){
            //this.boxService.listDossier.next({nom:this.fileName});
            this.progress=null;
            this.getAllModule();
            this.fileName="";
            this.file="";
            this.moduleForm.reset();
          }
        }),
        catchError((err:any)=>{
          this.progress=null;
          this.error=err.message;
          return throwError(err.message);
        })
      ).toPromise();
      /*this.projetService.affectModule(formData,this.idModule).subscribe((res:any)=>{
        console.log("message",res);
        this.getAllModule();
        this.fileName="";
        this.moduleForm.reset();
      },(error)=>{
        console.log(error);
      })*/
    }
  }

  /*deleteModule(id){
    this.projetService.deleteProjetModule(id).subscribe((res:any)=>{
      console.log("message",res);
      this.getAllModule();
    },(error)=>{
      console.log(error);
    })
  }*/

  openDialogDelete(id){
    const dialogRef = this.dialog.open(DeleteModuleProjetComponent,{
      width:'30%',
      data:{id:id}});
      const instance = dialogRef.componentInstance;
      instance.close.subscribe(()=> dialogRef.close());
      instance.confirm.subscribe(()=>{
        dialogRef.close();
        this.getAllModule();
      })
  }

  openDialogFile(chemin, extension){
    const dialogRef = this.dialog.open(ViewerStandarComponent,{
      maxWidth:'100vw',
      maxHeight:'100vh',
      width:'100%',
      height:'100%',
      panelClass:'full-screen-modal',
      data:{chemin:chemin,extension:extension}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllModule;
       }
    })
  }

}
