import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteModuleComponent } from '../note-module.component';
import { NotesService } from 'src/app/shared/services/notes.service';

@Component({
  selector: 'app-delete-note-module',
  templateUrl: './delete-note-module.component.html',
  styleUrls: ['./delete-note-module.component.scss']
})
export class DeleteNoteModuleComponent implements OnInit {

  idNote:any;
  message:any

  constructor(
           private _snackBar:MatSnackBar,
           public dialogRef:MatDialogRef<NoteModuleComponent>,
           private noteService: NotesService,
           @Inject(MAT_DIALOG_DATA) public data:any,

        ){
          this.idNote = this.data.id;
  }

  ngOnInit(){}

  deleteTache(){
    this.noteService.deleteNoteModule(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='La note a été supprimé avec succès';
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
