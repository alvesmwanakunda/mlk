import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';



@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  emailExists: boolean;
  userFormGroup:FormGroup;
  userFormError:any;
  onLoadForm:boolean=false;
  message:any;

  constructor(
    private router: Router,
    private _snackBar:MatSnackBar,
    private authService: AuthService,
  ){
    this.userFormError={
      nom:{},
    };
  }
 
  champ_validation={
    email:[
      {
        type: "required",
        message: "Adresse E-mail est obligatoire",
      },{
        type:"pattern",
        message: "Veuillez respecter le format email.",
      }
    ],
    type:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
    phone:[
      {
        type:"required",
        message:"Veuillez indiquer votre téléphone"
      },
      {
        type:"pattern",
        message:"Numéro de téléphone incorrect"
      }
    ],
  }

  ngOnInit(): void {

    this.userFormGroup=new FormGroup({
      nom:new FormControl("",[Validators.required]),
      prenom:new FormControl("",[Validators.required]),
      email:new FormControl("",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    });

  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  checkEmail(){
    const email = this.userFormGroup.get('email').value;
    this.authService.checkEmail(email).subscribe((response:{exists:boolean})=>{
      this.emailExists = response.exists;
    })
  }

  addUser():void{
    this.onLoadForm=true;
    if(!this.userFormGroup.invalid){
         this.authService.addEmploye( this.userFormGroup.value).subscribe((res:any)=>{
           this.onLoadForm=false;
           this.message='Employé a été ajouté avec succès';
           this.openSnackBar(this.message);
           this.router.navigate(["users"]);
         },(error)=>{
           this.onLoadForm=false;
           this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
           console.log(error);
         })
    }
     else{
       console.log("Erreur validation",  this.userFormGroup.value);
     }
   }

  


}
