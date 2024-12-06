import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProduitPrestationComponent } from '../produit-prestation.component';

@Component({
  selector: 'app-add-produit-presta',
  templateUrl: './add-produit-presta.component.html',
  styleUrls: ['./add-produit-presta.component.scss']
})
export class AddProduitPrestaComponent implements OnInit {

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
    public dialogRef:MatDialogRef<ProduitPrestationComponent>,
    private _snackBar:MatSnackBar,
    private projetService: ProjetsService,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}

  ngOnInit() {
    this.categorieFormGroup=new FormGroup({
      nom:new FormControl("",[Validators.required]),
      reference:new FormControl("",[Validators.required]),
      prix:new FormControl("",[Validators.required]),
      unite:new FormControl("",[Validators.required]),
    });
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  addCategorie():void{
    if(!this.categorieFormGroup.invalid){
         this.projetService.addProduitPrestation(this.data.id,this.categorieFormGroup.value).subscribe((res:any)=>{
           this.message='Produit a été ajouté avec succès';
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
