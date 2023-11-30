import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { DevisComponent } from '../devis.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment} from 'src/environments/environment';
import { Devis } from 'src/app/shared/interfaces/devis.model';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-update-devis',
  templateUrl: './update-devis.component.html',
  styleUrls: ['./update-devis.component.scss']
})
export class UpdateDevisComponent implements OnInit {

  projets:any=[];
  devisForm : FormGroup;
  fileName:any;
  file:File;
  onLoadForm:boolean=false;
  form:any;
  progress:number;
  message:any;
  devis:Devis;
  devisProjet:any;
  src:any;



  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private http: HttpClient,
    public dialogRef:MatDialogRef<DevisComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private sanitizer: DomSanitizer,
  ){}

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
    this.getDevis();
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((res:any)=>{
        this.projets=res.message
    },(error)=>{
      console.log(error);
    })
  }

  getDevis(){
    this.projetService.getDevis(this.data.id).subscribe((res:any)=>{
        this.devis = res.message
        this.devisProjet = res.message?.projet?._id;
        if(this.devis.chemin){
          this.src=this.getSafeUrl(this.devis.chemin);
        }
        if(this.devis){
          this.devisForm=this._formBuilder.group({
            nom:[this.devis.nom,Validators.required],
            numero:[this.devis.numero,Validators.required],
            projet:[this.devisProjet,Validators.required]
          });
        }
    },(error)=>{
      console.log(error);
    })
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

  updateDevis(){

    this.onLoadForm=true;
    this.form={};
    this.progress=1;

    const formData:FormData=new FormData();
    Object.assign(this.form, this.devisForm.value);
    formData.append("uploadfile", this.file);
    formData.append("nom", this.form.nom);
    formData.append("projet", this.form.projet);
    formData.append("numero", this.form.numero);


    return this.http.put(`${environment.BASE_API_URL}/devis/${this.data.id}`,formData,{
     reportProgress:true,
     observe:'events'
   })
   .pipe(
     map((event:any)=>{
       if (event.type === HttpEventType.UploadProgress){
         this.progress = Math.round((75/event.total)*event.loaded);
       }else if(event.type==HttpEventType.Response){
         this.message='Devis a été modifié avec succès';
         this.openSnackBar(this.message)
         //this.progress=null;
         this.dialogRef.close(true);
         this.progress = 100;
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

}
