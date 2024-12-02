import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-update-users',
  templateUrl: './update-users.component.html',
  styleUrls: ['./update-users.component.scss']
})
export class UpdateUsersComponent implements OnInit {

  emailExists: boolean;
  userFormGroup:FormGroup;
  userFormError:any;
  onLoadForm:boolean=false;
  message:any;
  employe:any;
  id:any;

  constructor(
    private router: Router,
    private _snackBar:MatSnackBar,
    private authService: AuthService,
    private route:ActivatedRoute
  ){
    this.userFormError={
      nom:{},
    };
    this.route.params.subscribe((data:any)=>{
      this.id = data?.id
    })
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
    this.getEmploye();
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

  getEmploye(){
    this.authService.getEmploye(this.id).subscribe((res:any)=>{
       this.employe = res.message;
       if(this.employe){
        this.userFormGroup=new FormGroup({
          nom:new FormControl(this.employe?.nom,[Validators.required]),
          type_contrat:new FormControl(this.employe?.type_contrat,null),
          heure:new FormControl(this.employe?.heure,null),
          prenom:new FormControl(this.employe?.prenom,[Validators.required]),
          email:new FormControl(this.employe?.email,[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        });
       }
    },(error)=>{
      console.log(error);
    })
  }

  updateUser():void{
    this.onLoadForm=true;
    if(!this.userFormGroup.invalid){
         this.authService.updateEmploye(this.userFormGroup.value, this.id).subscribe((res:any)=>{
           this.onLoadForm=false;
           this.message='Employé a été modifié avec succès';
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
