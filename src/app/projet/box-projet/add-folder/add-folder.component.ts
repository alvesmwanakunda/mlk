import { Component,OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from 'src/app/shared/services/box.service';
import { BoxProjetComponent } from '../box-projet.component';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {

  boxFormGroup:FormGroup;
  message:any;
  idFolder:any;
  idProjet:any;

  constructor(
    private  _formBuilder:FormBuilder,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<BoxProjetComponent>,
    private boxService : BoxService,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){
      this.idProjet = this.data.id;
      this.idFolder = this.data.idFolder;
  }

  ngOnInit(){
    this.boxFormGroup=this._formBuilder.group({
      nom:['',Validators.required],
    });
  }

  addBox():void{

    if(!this.idFolder){

      this.boxService.addFolderByProjet(this.idProjet,this.boxFormGroup.value).subscribe((res:any)=>{
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
      this.boxService.addFolderByProjet(this.idProjet,this.boxFormGroup.value).subscribe((res:any)=>{
        this.message='Dossier a été ajouté avec succès';
        this.openSnackBar(this.message);
        this.dialogRef.close(res)
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
