import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteTimesheetComponent } from '../delete-timesheet/delete-timesheet.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-update-timesheet',
  templateUrl: './update-timesheet.component.html',
  styleUrls: ['./update-timesheet.component.scss']
})
export class UpdateTimesheetComponent implements OnInit {

user:any;
month:any;
year:any;
timesheetForm: FormGroup;
updatetimesheetForm: FormGroup;
message:any;
idUser:any;
timesheet:any=[];
timesheetsControl
constructor(
  private router: Router,
  private authService: AuthService,
  private route: ActivatedRoute,
  private timesheetService: TimesheetService,
  private _snackBar:MatSnackBar,
  private formBuilder: FormBuilder,
  public dialog: MatDialog,
){
  this.route.params.subscribe((data:any)=>{
    this.idUser = data?.id;
    this.month = data?.month;
    this.year = data?.year;
  });
  this.updatetimesheetForm = new FormGroup({
    formArrayName: this.formBuilder.array([])
 })
  
}

champ_validation={
  input:[
    {
      type:"required",
      message:"Ce champ est obligatoire"
    }
  ]
}

ngOnInit(): void {
  
  this.getAllTimeSheet();
  this.getUser();
  this.timesheetForm = new FormGroup({
    createdAt:new FormControl("",[Validators.required]),
    tache:new FormControl("",[Validators.required]),
    heure:new FormControl("",[Validators.required]),
    user: new FormControl(this.idUser,null),
  });
  
}

getUser(){
  this.authService.getEmploye(this.idUser).subscribe((res:any)=>{
     this.user = res?.message;
  },(error) => {
    console.log("Erreur lors de la récupération des données", error);
   })
}

getAllTimeSheet(){
     this.timesheetService.getTimeSheetUserByDate(this.idUser,this.month,this.year).subscribe((res:any)=>{
       this.timesheet = res?.message.map((data)=>({
        id:data._id,
        date: new Date(data?.createdAt).toISOString().split('T')[0],
        task:data?.task,
        hour:data?.heure,
       }));
       this.buildForm(res?.message);        
     },(error) => {
      console.log("Erreur lors de la récupération des données", error);
     })
}

buildForm(data){
   const controlArray = this.updatetimesheetForm.get('formArrayName') as FormArray;
   console.log("ArrayName", controlArray.controls);
   Object.keys(data).forEach((i)=>{
    controlArray.push(
      this.formBuilder.group({
        createdAt:new FormControl(data[i].createdAt,[Validators.required]),
        tache:new FormControl(data[i].tache,[Validators.required]),
        heure:new FormControl(data[i].heure,[Validators.required]),
      })
    )
   })
}

afterSaveTimesheet(data){
  this.timesheetService.getTimeSheetUserByDate(this.idUser,this.month,this.year).subscribe((res:any)=>{
    this.timesheet = res?.message.map((data)=>({
     id:data._id,
     date: new Date(data?.createdAt).toISOString().split('T')[0],
     task:data?.task,
     hour:data?.heure,
    }));
    const controlArray = this.updatetimesheetForm.get('formArrayName') as FormArray;
    controlArray.push(
      this.formBuilder.group({
        createdAt:new FormControl(data.createdAt,[Validators.required]),
        tache:new FormControl(data.tache,[Validators.required]),
        heure:new FormControl(data.heure,[Validators.required]),
      })
    );  
    //console.log("ArrayName", controlArray);        
  },(error) => {
   console.log("Erreur lors de la récupération des données", error);
  })
}

afterDeleteTimesheet(index){
  this.timesheetService.getTimeSheetUserByDate(this.idUser,this.month,this.year).subscribe((res:any)=>{
    this.timesheet = res?.message.map((data)=>({
     id:data._id,
     date: new Date(data?.createdAt).toISOString().split('T')[0],
     task:data?.task,
     hour:data?.heure,
    }));
    const controlArray = this.updatetimesheetForm.get('formArrayName') as FormArray;
    controlArray.removeAt(index);
    //console.log("ArrayName", controlArray);        
  },(error) => {
   console.log("Erreur lors de la récupération des données", error);
  })
}

onSubmit(data, idTimesheet) {
  if(this.updatetimesheetForm.invalid){
    this.message='Veuillez remplir les champs obligatoire.';
    this.openSnackBar(this.message);
  }else{
    this.timesheetService.updateTimeSheet(this.updatetimesheetForm.value.formArrayName[data],idTimesheet).subscribe((res:any)=>{
      this.message='Feuille de temps modifée avec succès.';
      this.openSnackBar(this.message);
      this.getAllTimeSheet();
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
       this.openSnackBar(this.message);
       console.log(error);
    })
  }
}

saveTime(){
  if (this.timesheetForm.valid){
    this.timesheetService.addTimeSheet(this.timesheetForm.value).subscribe((res:any)=>{
      this.message='Feuille de temps ajoutée avec succès.';
      this.openSnackBar(this.message);
      this.afterSaveTimesheet(res?.message);
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

openDialogDelete(idTime,index){
  console.log("Index", index);
  const dialogRef = this.dialog.open(DeleteTimesheetComponent,{width:'30%',data:{id:idTime}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      //this.router.navigate(['dashboard']);
      this.afterDeleteTimesheet(index);
     }
  })
}


}
