import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment} from 'src/environments/environment';
import { Modules } from 'src/app/shared/interfaces/modules.model';
import { Router,ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewerStandarComponent } from 'src/app/viewer-standar/viewer-standar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { DeleteModuleComponent } from '../delete-module/delete-module.component';
import { PositionComponent } from '../position/position.component';




@Component({
  selector: 'app-update-module',
  templateUrl: './update-module.component.html',
  styleUrls: ['./update-module.component.scss']
})
export class UpdateModuleComponent implements OnInit {

  projets:any=[];
  moduleForm : FormGroup;
  image:File;
  imageName:any;
  fileName:any;
  file:File;
  selectedImage:string;
  onLoadForm:boolean=false;
  form:any;
  progress:number;
  message:any;
  isSize:any;
  idModule:any;
  module:Modules;
  projet:any;
  src:any;
  entreprises:any=[];
  entreprise:any;
  user:any;
  url:any;
  urlMessage:any;


  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router:Router,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private entrepriseService: EntreprisesService,

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

  ngOnInit(): void {
    this.getModule();
    this.getAllProjet();
    this.getAllEntreprise();
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((res:any)=>{
        this.projets=res.message
    },(error)=>{
      console.log(error);
    })
  }

  getAllEntreprise(){
    this.entrepriseService.getAllEntreprise().subscribe((res:any)=>{
      this.entreprises=res.message
    },(error)=>{
      console.log(error);
    })
  }

  getModule(){
    this.projetService.getModule(this.idModule).subscribe((res:any)=>{

      this.module = res.message;
      this.projet = res.message?.project;
      console.log("Module", res);
      if(this.module.chemin){
        this.src=this.getSafeUrl(this.module.chemin);
      }
      if(this.module){
        this.moduleForm=this._formBuilder.group({
          nom:[this.module.nom,Validators.required],
          type:[this.module.type,Validators.required],
          position:[this.module.position,null],
          projet:[this.projet?._id,null],
          batiment:[this.module.batiment,null],
          largeur:[this.module.largeur,null],
          hauteur:[this.module.hauteur,null],
          longueur:[this.module.longueur,null],
          marque:[this.module.marque,null],
        });
      }
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  onFileSelectedImage(event){
    let image = event.target.files[0];
    const maxFileSize = 17 * 1024 * 1024;
    if(image.size > maxFileSize){
      this.isSize="La taille de l'image ne doit pas dépasser 17 Mo";
    }else{
      this.isSize="";
      this.image = event.target.files[0];
      this.imageName = this.image.name;
    }
  }


  onFileSelectedPlan(event){
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  onFileSelectedPlanImage(event,type){
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.updatePlanAndImage(this.file, type);
  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
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
         if(result){
          this.getModule();
         }
      })
  }

 updateModule(){

    this.onLoadForm=true;
    this.form={};
    this.progress=1;

    const formData:FormData=new FormData();
    Object.assign(this.form, this.moduleForm.value);
    formData.append("planFile", this.file);
    formData.append("imageFile", this.image);
    formData.append("nom_photo", this.imageName);
    formData.append("nom", this.form.nom);
    formData.append("position", this.form.position);
    formData.append("type", this.form.type);
    formData.append("projet", this.form.projet);
    formData.append("marque", this.form.marque);
    formData.append("hauteur", this.form.hauteur);
    formData.append("largeur", this.form.largeur);
    formData.append("longueur", this.form.longueur);
    formData.append("batiment",this.form.batiment);

    return this.http.put(`${environment.BASE_API_URL}/module/${this.idModule}`,formData,{
     reportProgress:true,
     observe:'events'
   })
   .pipe(
     map((event:any)=>{
       if (event.type === HttpEventType.UploadProgress){
         this.progress = Math.round((75/event.total)*event.loaded);
       }else if(event.type==HttpEventType.Response){
         this.message='Module a été modifié avec succès';
         this.openSnackBar(this.message)
         //this.progress=null;
         this.progress = 100;
         this.getModule();
       }
     }),
     catchError((err:any)=>{
       this.progress=null;
       this.message="Une erreur s'est produite veuillez réessayer.";
       this.openSnackBar(this.message);
       return throwError(err.message);
     })
   ).toPromise();
 }

 updatePlanAndImage(file,type){

  this.onLoadForm=true;
  this.form={};
  this.progress=1;

  if(type=="plan"){
    this.url='module/plan';
    this.urlMessage="Plan principal a été modifié avec succès"
  }else{
    this.url='module/image';
    this.urlMessage="Image principale a été modifié avec succès";
  }
  const formData:FormData=new FormData();
  formData.append("uploadfile", file);
  return this.http.put(`${environment.BASE_API_URL}/${this.url}/${this.idModule}`,formData,{
    reportProgress:true,
    observe:'events'
  })
  .pipe(
    map((event:any)=>{
      if (event.type === HttpEventType.UploadProgress){
        this.progress = Math.round((75/event.total)*event.loaded);
      }else if(event.type==HttpEventType.Response){
        this.message=this.urlMessage;
        this.openSnackBar(this.message)
        this.progress = 100;
        this.getModule();
      }
    }),
    catchError((err:any)=>{
      this.progress=null;
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
      return throwError(err.message);
    })
  ).toPromise();

 }

 getSafeUrl(url){
  return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

openDialogPosition(){
  const dialogRef = this.dialog.open(PositionComponent,{width:'50%'});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      console.log("Type", result);

     }
  })
}

}
