import { Component,Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { UpdateTimesheetComponent } from '../update-timesheet/update-timesheet.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-delete-timesheet',
  templateUrl: './delete-timesheet.component.html',
  styleUrls: ['./delete-timesheet.component.scss']
})
export class DeleteTimesheetComponent implements OnInit {

  message:any;

  constructor(
    public dialogRef:MatDialogRef<UpdateTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _snackBar:MatSnackBar,
    private timesheetService:TimesheetService
  ){}

  ngOnInit() {
  }

  deleteTime(){
    this.timesheetService.deleteTimeSheet(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='Feuille de temps a été supprimé avec succès';
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
