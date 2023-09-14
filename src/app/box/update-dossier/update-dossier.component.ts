import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxComponent } from '../box.component';
import { BoxService } from 'src/app/shared/services/box.service';


@Component({
  selector: 'app-update-dossier',
  templateUrl: './update-dossier.component.html',
  styleUrls: ['./update-dossier.component.scss']
})
export class UpdateDossierComponent implements OnInit {

  boxFormGroup:FormGroup;
  message:any;
  folder:any;

  constructor(
    private  _formBuilder:FormBuilder,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<BoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private boxService : BoxService
  ){}

  ngOnInit() {
    this.getFolder();
  }

  getFolder(){
    this.boxService.getFolderId(this.data.id).subscribe((data:any)=>{
      this.folder = data.message;
      this.boxFormGroup=this._formBuilder.group({
        nom:[data.message.nom,Validators.required],
      });
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  updateBox():void{
    this.boxService.updateFolder(this.data.id,this.boxFormGroup.value).subscribe((res:any)=>{
      this.message='Dossier a été modifié avec succès';
      this.openSnackBar(this.message);
      this.dialogRef.close(res)
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
      console.log(error);
    })
}

openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
}



}
