import { Component, Inject, OnInit } from '@angular/core';
import { TachesService } from 'src/app/shared/services/taches.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TachesComponent } from '../taches.component';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-add-taches',
  templateUrl: './add-taches.component.html',
  styleUrls: ['./add-taches.component.scss']
})
export class AddTachesComponent implements OnInit {

  taskFormGroup:FormGroup;
  message:any;
  idProjet:any;
  contacts:any

  constructor(
     private  _formBuilder:FormBuilder,
     private _snackBar:MatSnackBar,
     public dialogRef:MatDialogRef<TachesComponent>,
     private tachesService: TachesService,
     @Inject(MAT_DIALOG_DATA) public data:any,
     private authService:AuthService
  ){
    this.idProjet = this.data.id;
    console.log("projet", this.idProjet);
    console.log("projet", this.data.id);
  }

  champ_validation={
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }

  ngOnInit() {
    this.getAllEmployes();
     this.taskFormGroup=this._formBuilder.group({
      titre:['',Validators.required],
      assignes:['',null]
    });
  }

  addTask(){
      this.tachesService.addTTache(this.taskFormGroup.value, this.idProjet).subscribe((res:any)=>{
        this.message='Tâche a été ajouté avec succès';
        this.openSnackBar(this.message);
        this.dialogRef.close(res)
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
  }

   getAllEmployes(){
         this.authService.listEmployes().subscribe((res:any)=>{
           this.contacts = res?.message;
         },(error) => {
          console.log("Erreur lors de la récupération des données", error);
         })
    }

  openSnackBar(message){
      this._snackBar.open(message, 'Fermer',{
        duration:6000,
      })
  }

}
