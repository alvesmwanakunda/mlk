import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError, startWith } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { environment} from 'src/environments/environment';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent implements OnInit {

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
  entrepriseFiltres:Observable<any[]>;



  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private entrepriseService: EntreprisesService,
    private http: HttpClient,
    private route:Router
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
    //console.log("User", this.user);
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
      type:['',Validators.required],
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

    this.entrepriseFiltres = this.moduleForm.get('entreprise').valueChanges.pipe(
      startWith(''),
      map((val)=> this.filterEntreprise(val))
    );
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

  filterEntreprise(value:string){
    const filtre = value ? value.toLowerCase() : '';
    return this.entreprises.filter(option => {
      //console.log("Option entre", option);
      return option && option.societe && option.societe.toLowerCase().includes(filtre);
    });
  }

  onFileSelectedImage(event){
    //this.imageChangedEvent = event;
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

  /*imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log("cropped", event);
    // La variable 'croppedImage' contient l'image redimensionnée en base64
  }*/

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
     formData.append("type", this.form.type);
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
    

     return this.http.post(`${environment.BASE_API_URL}/module`,formData,{
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
            //this.progress=null;
            this.progress = 100;
            this.route.navigate(["modulaires"]);
          }
        }else{
          if(event.type==HttpEventType.Response){
            this.message='Module a été ajouté avec succès';
            this.openSnackBar(this.message)
            this.route.navigate(["modulaires"]);
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
