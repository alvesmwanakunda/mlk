import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheet } from 'src/app/shared/interfaces/timeSheet.model';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';






@Component({
  selector: 'app-dialog-update-timesheet',
  templateUrl: './dialog-update-timesheet.component.html',
  styleUrls: ['./dialog-update-timesheet.component.scss']
})
export class DialogUpdateTimesheetComponent implements OnInit {

  timesheetForm: FormGroup;
  timeSheet:TimeSheet;
  filterForm: FormGroup;
  filteredTimes:any = [];
  createdAt:any;
  message:any;
  


  constructor(
    private timesheetService: TimesheetService,
    private _snackBar:MatSnackBar,
    private formBuilder: FormBuilder,
    public dialogRef:MatDialogRef<DialogUpdateTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){

  }
  ngOnInit(){
     this.getTimeSheet();
     this.filterForm = new FormGroup({
      startDate: new FormControl("",[Validators.required]),
      endDate: new FormControl("",null),
    })
  }

  getTimeSheet(){
    this.timesheetService.getTimeSheet(this.data.id).subscribe((res:any)=>{
           //console.log("TimeSheet", res);
           this.timeSheet = res.message;
           this.createdAt = new Date(res.message?.createdAt).toISOString().split('T')[0]
           if(this.timeSheet){
            this.timesheetForm = new FormGroup({
              createdAt:new FormControl("",[Validators.required]),
              tache:new FormControl(this.timeSheet.tache,null),
              heure:new FormControl(this.timeSheet.heure,null),
              projet: new FormControl(this.timeSheet.projet,null),
              motifs:new FormControl(this.timeSheet.motifs, null),
              types_deplacement:new FormControl(this.timeSheet.types_deplacement, null),
              presence:new FormControl(this.timeSheet.presence, null),
              deplacement: new FormControl(this.timeSheet.deplacement,null),
              heureDebut:  new FormControl(this.timeSheet.heureDebut,null),
              heureFin:  new FormControl(this.timeSheet.heureFin,null),
              pause:  new FormControl(this.timeSheet.pause,null),
            });
           }
    },(error) => {
     console.log("Erreur lors de la récupération des données", error);
    })
}

onSubmit() {
  if(this.timesheetForm.invalid){
    this.message='Veuillez remplir les champs obligatoire.';
    this.openSnackBar(this.message);
  }else{
    this.timesheetService.updateTimeSheet(this.timesheetForm.value,this.data.id).subscribe((res:any)=>{
      this.dialogRef.close(res)
      this.message='Feuille de temps modifée avec succès.';
      this.openSnackBar(this.message);
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
       this.openSnackBar(this.message);
       console.log(error);
    })
  }
}

openSnackBar(message){
  this._snackBar.open(message, 'Fermer',{
    duration:6000,
  })
}



  


}
