import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../shared/services/auth.service';
import { A2fQrcodeComponent } from './a2f-qrcode/a2f-qrcode.component';
import { MatDialog } from '@angular/material/dialog';

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
  isA2FChecked:boolean=false;
  a2fType:string="";

  authFrom: FormGroup;

  constructor(
    private _snackBar:MatSnackBar,
    private _formBuilder:FormBuilder,
    private authService:AuthService,
    public dialog: MatDialog,
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

    this.isA2FChecked=this.user?.twoFactorEnabled  || false;
    this.a2fType=this.user?.twoFactorType || "";
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  openSnackBarError(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
      panelClass:['error-snackbar']
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

  showSaveButton(){
    var checked = this.user?.twoFactorEnabled || false;
    var type = this.user?.twoFactorType || "";
    if(checked != this.isA2FChecked || type != this.a2fType){
      return true;
    }
    return false;
  }

  updateA2FAuthentication(){
    if (this.isA2FChecked && this.a2fType == ""){
      this.openSnackBarError("Veuillez selectionner un type d'authentification");
    }else{
      this.onLoadForm=true;
      
      this.authService.updateProfilA2FAuthentication({
        twoFactorEnabled: this.isA2FChecked,
        twoFactorType: this.a2fType
      }).subscribe((res:any)=>{
        this.onLoadForm=false;
        if(res.success){
          // Remettre à jour le user dans le localStorage
          this.user = res.message.user;
          this.userInfo.user = this.user;
          localStorage.setItem('user', JSON.stringify(this.userInfo));
          
          // Mettre à jour les variables pour le toggle et type A2F
          this.isA2FChecked = this.user?.twoFactorEnabled || false;
          this.a2fType = this.user?.twoFactorType || "";

          if(this.a2fType == "application"){
            const dialogRef = this.dialog.open(A2fQrcodeComponent,{data: res.message.qrCode, width:'450px', disableClose: true});
          }else{
            this.openSnackBar("Votre authentification à deux facteurs a été modifiée avec succès");
          }
        }else{
          this.openSnackBarError("Une erreur s'est produite veuillez réessayer.");
        }

      },(error)=>{
        this.onLoadForm=false;
        this.openSnackBarError("Une erreur s'est produite veuillez réessayer.");
        console.log(error);
      })
    }
  }


  
}
