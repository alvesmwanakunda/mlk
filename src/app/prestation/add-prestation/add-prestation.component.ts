import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { PrestationComponent } from '../prestation.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';



@Component({
  selector: 'app-add-prestation',
  templateUrl: './add-prestation.component.html',
  styleUrls: ['./add-prestation.component.scss']
})
export class AddPrestationComponent implements OnInit {

  message:any;
  categorieFormGroup:FormGroup;
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
    private projetService: ProjetsService
  ){}

  ngOnInit() {
    this.categorieFormGroup=new FormGroup({
      nom:new FormControl("",[Validators.required]),
      reference:new FormControl("",[Validators.required]),
    });
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  addCategorie():void{
    if(!this.categorieFormGroup.invalid){
         this.projetService.addPrestation( this.categorieFormGroup.value).subscribe((res:any)=>{
           this.message='Catégorie a été ajouté avec succès';
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
