import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { A2fQrcodeComponent } from './a2f-qrcode/a2f-qrcode.component';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent implements OnInit{

  user:any;
  userInfo:any;
  onLoadForm:boolean=false;
  isA2FChecked:boolean=false;
  a2fType:string="";

  constructor(
    private _snackBar:MatSnackBar,
    private authService:AuthService,
    public dialog: MatDialog,
  ){
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.user = this.userInfo.user;
  }

  ngOnInit(): void {
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
            this.openSnackBar("Vos paramètres de sécurité ont été mise à jour avec succès");
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
