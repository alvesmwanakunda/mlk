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

@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.scss']
})
export class AddFactureComponent implements OnInit {

  projets:any=[];
  factureForm : FormGroup;
  fileName:any;
  file:File;
  onLoadForm:boolean=false;
  form:any;
  progress:number;
  message:any;

  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private http: HttpClient,
    public dialogRef:MatDialogRef<FacturesComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
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
    this.factureForm=this._formBuilder.group({
      nom:['',Validators.required],
      numero:['',Validators.required],
      projet:['',Validators.required]
    });
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((res:any)=>{
        this.projets=res.message
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

  addFacture(){

    this.onLoadForm=true;
    this.form={};
    this.progress=1;

    const formData:FormData=new FormData();
    Object.assign(this.form, this.factureForm.value);
    formData.append("uploadfile", this.file);
    formData.append("nom", this.form.nom);
    formData.append("projet", this.form.projet);
    formData.append("numero", this.form.numero);


    return this.http.post(`${environment.BASE_API_URL}/facture`,formData,{
     reportProgress:true,
     observe:'events'
   })
   .pipe(
     map((event:any)=>{
       if (event.type === HttpEventType.UploadProgress){
         this.progress = Math.round((75/event.total)*event.loaded);
       }else if(event.type==HttpEventType.Response){
         this.message='Facture a été ajouté avec succès';
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

}
