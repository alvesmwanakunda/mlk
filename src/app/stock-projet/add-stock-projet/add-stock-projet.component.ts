import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment} from 'src/environments/environment';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModuleProjetComponent } from '../../projet/module-projet/module-projet.component';

@Component({
  selector: 'app-add-stock-projet',
  templateUrl: './add-stock-projet.component.html',
  styleUrls: ['./add-stock-projet.component.scss']
})
export class AddStockProjetComponent implements OnInit {

  projets:any=[];
  entreprises:any=[];
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
  croppedImage:any;
  imageChangedEvent:any;
  isSize:any;
  user:any;
  company:any;


  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private entrepriseService: EntreprisesService,
    private http: HttpClient,
    private route:Router,
    public dialogRef:MatDialogRef<ModuleProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
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

  ngOnInit(): void {
    this.getAllProjet();
    this.getAllEntreprise();
    this.getEntrepriseId();
    this.moduleForm=this._formBuilder.group({
      nom:['',Validators.required],
      entreprise:['',null],
      position:['',null],
      module_type:['',null],
      categorie:['',Validators.required],
      largeur:['',null],
      hauteur:['',null],
      longueur:['',null],
      marque:['',null],
      dateFabrication:['',null]
    });
  }

  getEntrepriseId(){
    this.entrepriseService.getEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
       this.company = res.message
    },(error)=>{
        console.log("Une erreur", error);
    })
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

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  addModule(){

     this.onLoadForm=true;
     this.form={};


     const formData:FormData=new FormData();
     Object.assign(this.form, this.moduleForm.value);
     formData.append("planFile", this.file);
     formData.append("imageFile", this.image);
     formData.append("nom", this.form.nom);
     formData.append("position", this.form.position);
     formData.append("marque", this.form.marque);
     formData.append("categorie", this.form.categorie);
     formData.append("hauteur", this.form.hauteur);
     formData.append("largeur", this.form.largeur);
     formData.append("longueur", this.form.longueur);
     formData.append("dateFabrication",this.form.dateFabrication)
     formData.append("module_type", this.form.module_type)
     if(this.user?.user?.role=="user"){
      formData.append("entreprise",this.user?.user?.entreprise)
     }else{
      formData.append("entreprise",this.form.entreprise)
     }
    

     return this.http.post(`${environment.BASE_API_URL}/affecte/module/${this.data.id}`,formData,{
      reportProgress:true,
      observe:'events'
    })
    .pipe(
      map((event:any)=>{
        if(this.file || this.image){
          this.progress=1;
          if (event.type === HttpEventType.UploadProgress){
            this.progress = Math.round((75/event.total)*event.loaded);
          }else if(event.type==HttpEventType.Response){
            this.message='Module a été ajouté avec succès';
            this.openSnackBar(this.message)
            this.dialogRef.close("response");
            this.progress = 100;
          }
        }else{
          if(event.type==HttpEventType.Response){
            this.message='Module a été ajouté avec succès';
            this.openSnackBar(this.message)
          }
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


}
