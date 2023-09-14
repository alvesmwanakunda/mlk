import { Component,OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxComponent } from '../box.component';
import { DetailboxComponent } from '../detailbox/detailbox.component';
import { BoxService } from 'src/app/shared/services/box.service';


@Component({
  selector: 'app-add-dossier',
  templateUrl: './add-dossier.component.html',
  styleUrls: ['./add-dossier.component.scss']
})
export class AddDossierComponent implements OnInit {

  boxFormGroup:FormGroup;
  message:any;
  idFolder:any

  constructor(
    private  _formBuilder:FormBuilder,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<BoxComponent>,
    public dialogDetailRef:MatDialogRef<DetailboxComponent>,
    private boxService : BoxService,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){
    this.idFolder = this.data?.id;
  }

  ngOnInit(){
    this.boxFormGroup=this._formBuilder.group({
      nom:['',Validators.required],
    });
  }

  addBox():void{

    if(!this.idFolder){

      this.boxService.addFolder(this.boxFormGroup.value).subscribe((res:any)=>{
        this.message='Dossier a été ajouté avec succès';
        this.openSnackBar(this.message);
        this.dialogRef.close(res)
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })

    }else{
      this.boxFormGroup?.addControl('dossierParent',new FormControl(this.idFolder,null));
      console.log("boxFormGroup", this.boxFormGroup.value);
      this.boxService.addFolder(this.boxFormGroup.value).subscribe((res:any)=>{
        this.message='Dossier a été ajouté avec succès';
        this.openSnackBar(this.message);
        this.dialogDetailRef.close(res)
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
