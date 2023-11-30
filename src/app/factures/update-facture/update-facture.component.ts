import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FacturesComponent } from '../factures.component';
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
import { Facture } from 'src/app/shared/interfaces/facture.model';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-update-facture',
  templateUrl: './update-facture.component.html',
  styleUrls: ['./update-facture.component.scss']
})
export class UpdateFactureComponent implements OnInit {

  projets:any=[];
  factureForm : FormGroup;
  fileName:any;
  file:File;
  onLoadForm:boolean=false;
  form:any;
  progress:number;
  message:any;
  facture:Facture;
  factureProjet:any;
  src:any;


  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private http: HttpClient,
    public dialogRef:MatDialogRef<FacturesComponent>,
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
    this.getFacture();
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((res:any)=>{
        this.projets=res.message
    },(error)=>{
      console.log(error);
    })
  }

  getFacture(){
    this.projetService.getFacture(this.data.id).subscribe((res:any)=>{
        this.facture = res.message
        this.factureProjet = res.message?.projet?._id;
        if(this.facture.chemin){
          this.src=this.getSafeUrl(this.facture.chemin);
        }
        if(this.facture){
          this.factureForm=this._formBuilder.group({
            nom:[this.facture.nom,Validators.required],
            numero:[this.facture.numero,Validators.required],
            projet:[this.factureProjet,Validators.required]
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

  updateFacture(){

    this.onLoadForm=true;
    this.form={};
    this.progress=1;

    const formData:FormData=new FormData();
    Object.assign(this.form, this.factureForm.value);
    formData.append("uploadfile", this.file);
    formData.append("nom", this.form.nom);
    formData.append("projet", this.form.projet);
    formData.append("numero", this.form.numero);


    return this.http.put(`${environment.BASE_API_URL}/facture/${this.data.id}`,formData,{
     reportProgress:true,
     observe:'events'
   })
   .pipe(
     map((event:any)=>{
       if (event.type === HttpEventType.UploadProgress){
         this.progress = Math.round((75/event.total)*event.loaded);
       }else if(event.type==HttpEventType.Response){
         this.message='Facture a été modifié avec succès';
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
