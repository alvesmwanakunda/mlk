import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProduitPrestationComponent } from '../produit-prestation.component';

@Component({
  selector: 'app-update-produit-presta',
  templateUrl: './update-produit-presta.component.html',
  styleUrls: ['./update-produit-presta.component.scss']
})
export class UpdateProduitPrestaComponent implements OnInit {

  message:any;
  categorieFormGroup:FormGroup;
  produit:any;
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
    this.getProduit();
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  getProduit(){
    this.projetService.getProduitPrestation(this.data.id).subscribe((res:any)=>{
        this.produit = res?.message;
        if(this.produit){
          this.categorieFormGroup=new FormGroup({
            nom:new FormControl(this.produit?.nom,[Validators.required]),
            reference:new FormControl(this.produit?.reference,[Validators.required]),
            prix:new FormControl(this.produit?.prix,[Validators.required]),
            unite:new FormControl(this.produit?.unite,[Validators.required]),
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
         this.projetService.updateProduitPrestation(this.data.id,this.categorieFormGroup.value).subscribe((res:any)=>{
           this.message='Produit a été modifié avec succès';
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

