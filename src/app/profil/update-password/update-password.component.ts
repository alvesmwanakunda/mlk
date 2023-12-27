import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { CustomValidators } from "ng2-validation";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  user:any;
  userInfo:any;
  userFormGroup:FormGroup;
  message:any;
  onLoadForm:boolean=false;
  hideP = true;
  hidePassword = true;
  submitted = false;


  constructor(
    private _snackBar:MatSnackBar,
    private _formBuilder:FormBuilder,
    private authService:AuthService
  ){
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.user = this.userInfo.user;
  }

  account_validation={
    confirmpassword: [
      { type: "required", message: "Vous devez confirmer le mot de passe" },
      { type: "minlength", message: "Mot de passe incorrect." },
    ],
    password: [
      { type: "required", message: "Le mot de passe est obligatoire"},
      { type: "minlength", message: "Votre mot de passe doit contenir 8 caractères minimum"},
    ],
  };

  ngOnInit() {

    let password = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]);
    let confirmpassword = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.equalTo(password),
    ]);

    this.userFormGroup = this._formBuilder.group({
        password:password,
        confirmpassword: confirmpassword,
     })
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  updateContact():void{
       this.onLoadForm=true;
       this.submitted = true;
       this.authService.updateProfilPassword(this.userFormGroup.value).subscribe((res:any)=>{
         this.onLoadForm=false;
         this.user=res.message;
         this.message='Votre mot de passe a été modifié avec succès';
         this.openSnackBar(this.message);
       },(error)=>{
         this.onLoadForm=false;
         this.message="Une erreur s'est produite veuillez réessayer.";
         this.openSnackBar(this.message);
         console.log(error);
       })
   }



}
