import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { PrestationComponent } from '../prestation.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-update-prestation',
  templateUrl: './update-prestation.component.html',
  styleUrls: ['./update-prestation.component.scss']
})
export class UpdatePrestationComponent implements OnInit {

  message:any;
  categorieFormGroup:FormGroup;
  prestation:any;
  champ_validation={
    type:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
  }


  constructor(
    public dialogRef:MatDialogRef<PrestationComponent>,
    private _snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private projetService: ProjetsService
  ){}

  ngOnInit() {
   this.getPrestation();
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  getPrestation(){
    this.projetService.getPrestation(this.data.id).subscribe((res:any)=>{
        this.prestation = res?.message;
        if(this.prestation){
          this.categorieFormGroup=new FormGroup({
            nom:new FormControl(this.prestation?.nom,[Validators.required]),
            reference:new FormControl(this.prestation?.reference,[Validators.required]),
          });
        }

    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
      console.log(error);
    })
  }

  updateCategorie():void{
    if(!this.categorieFormGroup.invalid){
         this.projetService.updatePrestation(this.data.id,this.categorieFormGroup.value).subscribe((res:any)=>{
           this.message='Catégorie a été modifié avec succès';
           this.openSnackBar(this.message);
           this.dialogRef.close(res)
         },(error)=>{
           this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
           console.log(error);
         })
    }
   }


}
