import { Component,Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { ContactComponent } from '../contact.component';

@Component({
  selector: 'app-delete-contact',
  templateUrl: './delete-contact.component.html',
  styleUrls: ['./delete-contact.component.scss']
})
export class DeleteContactComponent implements OnInit {

  message:any;

  constructor(
    public dialogRef:MatDialogRef<ContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _snackBar:MatSnackBar,
    private contactService: ContactsService
  ){}

  ngOnInit() {
  }

  deleteContact(){
    this.contactService.deleteContact(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='Contact a été supprimé avec succès';
        this.openSnackBar(this.message);
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }



}
