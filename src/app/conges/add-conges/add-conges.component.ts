import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-add-conges',
  templateUrl: './add-conges.component.html',
  styleUrls: ['./add-conges.component.scss']
})
export class AddCongesComponent implements OnInit {

  congeForm: FormGroup;
  signaturePad: SignaturePad;
  isSigne:boolean=false;
  @ViewChild("canvas",{static:true}) canvas: ElementRef;
  message:any;
  isSave:boolean=false;
  fileName:any;
  file:File;
  form:any;

  constructor(
    private _formBuilder :FormBuilder,
    private entrepriseService: EntreprisesService,
    private _snackBar:MatSnackBar,
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
    this.congeForm = new FormGroup({
      debut:new FormControl("",[Validators.required]),
      fin:new FormControl("",[Validators.required]),
      jours:new FormControl("",[Validators.required]),
      types:new FormControl("",[Validators.required]),
      status: new FormControl("En attente de validation",null),
      heure_debut:new FormControl("",null),
      heure_fin:new FormControl("",null),
      signature_user:new FormControl("",null),
      raison:new FormControl("",null)
    })
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
  }

  clear(){
    this.isSigne=false;
    this.signaturePad.clear();
  }

  saveSignature(){
      if(!this.signaturePad.isEmpty()){
        console.log("image", this.signaturePad.toDataURL());
        this.congeForm.controls['signature_user'].setValue(this.signaturePad.toDataURL());
        this.isSigne=true;
      }
  }

  onFileSelected(event){
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  saveConge(){

    this.form ={};
    const formData:FormData=new FormData();
    Object.assign(this.form, this.congeForm.value);

    formData.append("uploadfile", this.file);
    formData.append("debut", this.form.debut);
    formData.append("fin", this.form.fin);
    formData.append("jours", this.form.jours);
    formData.append("types", this.form.types);
    formData.append("status", this.form.status);
    formData.append("heure_debut", this.form.heure_debut);
    formData.append("heure_fin", this.form.heure_fin);
    formData.append("signature_user", this.form.signature_user);
    formData.append("raison", this.form.raison);

    if (this.congeForm.valid){
      this.entrepriseService.addConge(formData).subscribe((res:any)=>{
        this.message='Demande de congé envoyée avec succès.';
         this.openSnackBar(this.message);
         this.isSave=true;
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
         this.openSnackBar(this.message);
         console.log(error);
      })
    }
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

}
