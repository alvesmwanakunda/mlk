import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotesService } from 'src/app/shared/services/notes.service';
import { NoteModuleComponent } from '../note-module.component';

@Component({
  selector: 'app-updte-note-module',
  templateUrl: './updte-note-module.component.html',
  styleUrls: ['./updte-note-module.component.scss']
})
export class UpdteNoteModuleComponent implements OnInit {

    idNote:any;
    message:any
    note:any;
    text = '';

    constructor(
             private _snackBar:MatSnackBar,
             public dialogRef:MatDialogRef<NoteModuleComponent>,
             private noteService: NotesService,
             @Inject(MAT_DIALOG_DATA) public data:any,

          ){
            this.idNote = this.data.id;
    }

    ngOnInit(){
      this.getNote();
    }

    getNote(){
      this.noteService.getSingleNoteModule(this.data.id).subscribe((res:any)=>{
           this.note = res?.message;
           this.text = res?.message?.text;
          /*this.dialogRef.close(res)
          this.message='La note a été supprimé avec succès';
          this.openSnackBar(this.message);*/
      },(error)=>{
        /*this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);*/
        console.log("Erreur lors de la récupération des données", error);
      })
    }

    openSnackBar(message){
      this._snackBar.open(message, 'Fermer',{
        duration:6000,
      })
    }

    updateNote(){
      const fd = new FormData();
      fd.append('text', this.text || '');
      this.noteService.updateNoteModule(this.data.id, fd).subscribe((res:any)=>{
          this.dialogRef.close(res)
          this.message='La note a été modifié avec succès';
          this.openSnackBar(this.message);
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log("Erreur lors de la récupération des données", error);
      })
    }

}
