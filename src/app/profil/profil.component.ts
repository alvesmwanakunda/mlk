import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  user:any;
  userInfo:any;
  userFormGroup:FormGroup;
  message:any;
  onLoadForm:boolean=false;
  isEditer:boolean=false;


  constructor(
    private _snackBar:MatSnackBar,
    private _formBuilder:FormBuilder,
    private authService:AuthService
  ){
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.user = this.userInfo.user;
  }
  ngOnInit(): void {

     this.userFormGroup = this._formBuilder.group({
      nom:[this.user?.nom],
      prenom:[this.user?.nom,null],
      adresse:[this.user?.adresse,null],
      phone:[this.user?.phone,null],
      genre:[this.user?.genre,null],
     })
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  updateContact():void{
       this.onLoadForm=true;
       this.authService.updateProfil(this.userFormGroup.value).subscribe((res:any)=>{
         this.onLoadForm=false;
         this.isEditer=false;
         this.user=res.message;
         this.message='Votre profile a été modifié avec succès';
         this.openSnackBar(this.message);
       },(error)=>{
         this.onLoadForm=false;
         this.isEditer=false;
         this.message="Une erreur s'est produite veuillez réessayer.";
         this.openSnackBar(this.message);
         console.log(error);
       })
   }

   editProfil(){
    if(this.isEditer){
       this.isEditer=false;
    }else{
       this.isEditer=true;
    }
   }

}
