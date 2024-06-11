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

  saveConge(){
    if (this.congeForm.valid){
      this.entrepriseService.addConge(this.congeForm.value).subscribe((res:any)=>{
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
