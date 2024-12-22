import { Component, Inject, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment} from 'src/environments/environment';
import { ModuleProjetComponent } from '../module-projet.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewerStandarComponent } from 'src/app/viewer-standar/viewer-standar.component';


@Component({
  selector: 'app-update-module-projet',
  templateUrl: './update-module-projet.component.html',
  styleUrls: ['./update-module-projet.component.scss']
})
export class UpdateModuleProjetComponent implements OnInit {

  moduleForm : FormGroup;
  fileName:any;
  file:any;
  progress:number;
  error:any;
  user:any;
  message:any;
  projet:any;
  projets:any;

  constructor(
    private _formBuilder :FormBuilder,
    private projetService: ProjetsService,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<ModuleProjetComponent>,
  ){
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
    this.getProjet();
    this.getAllProjet();
    this.moduleForm=this._formBuilder.group({
      projet:['',Validators.required],
      position:['',null]
    });
  }

  getProjet(){
    this.projetService.getOneProjetModule(this.data.id).subscribe((res:any)=>{
        this.projet=res.message
    },(error)=>{
      console.log(error);
    })
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((res:any)=>{
        this.projets=res.message
    },(error)=>{
      console.log(error);
    })
  }

  onFileSelected(event){
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    //this.updateFile(this.file);
  }

  updateModule(){
    const formData:FormData=new FormData();
    formData.append("uploadfile", this.file);
    formData.append("projet", this.moduleForm.get('projet').value);
    formData.append("position", this.moduleForm.get('position').value);

    if (this.moduleForm.valid){
      return this.http.put(`${environment.BASE_API_URL}/projet/module/plan/${this.data?.id}`,formData,{
        reportProgress:true,
        observe:'events'
      })
      .pipe(
        map((event:any)=>{
          if (event.type === HttpEventType.UploadProgress){
            this.progress = Math.round((100/event.total)*event.loaded);
          }else if(event.type==HttpEventType.Response){
            this.progress=null;
            this.fileName="";
            this.file="";
            this.message='Projet a été modifié avec succès';
            this.openSnackBar(this.message);
            this.dialogRef.close("save")
          }
        }),
        catchError((err:any)=>{
          this.progress=null;
          this.error=err.message;
          this.message="Une erreur s'est produite veuillez réessayer.";
          this.openSnackBar(this.message);
          return throwError(err.message);
        })
      ).toPromise();
    }
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
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
      })
    }

}
