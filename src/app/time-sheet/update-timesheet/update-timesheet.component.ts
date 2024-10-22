import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteTimesheetComponent } from '../delete-timesheet/delete-timesheet.component';
import { MatDialog } from '@angular/material/dialog';
import { MonthService } from 'src/app/shared/services/month.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TimeSheet } from 'src/app/shared/interfaces/timeSheet.model';




@Component({
  selector: 'app-update-timesheet',
  templateUrl: './update-timesheet.component.html',
  styleUrls: ['./update-timesheet.component.scss']
})
export class UpdateTimesheetComponent implements OnInit, AfterViewInit {

user:any;
month:any;
monthL:any;
year:any;
timesheetForm: FormGroup;
filterForm: FormGroup;
updatetimesheetForm: FormGroup;
message:any;
idUser:any;
timesheet:any=[];
timesheets:any=[];
filteredTimes:any = [];
timesheetsControl;
fixedDate:any; 
selected = 'jour';
isFilter:boolean=false;
isPresent:boolean=true;
isDeplacement:boolean=true;
displayedColumns:string[]=['date','task','project','deplacement','user'];
dataSource =new MatTableDataSource<TimeSheet>();
@ViewChild(MatPaginator) paginator: MatPaginator;
isUpdate:boolean=false;

constructor(
  private router: Router,
  private authService: AuthService,
  private route: ActivatedRoute,
  private timesheetService: TimesheetService,
  private _snackBar:MatSnackBar,
  private formBuilder: FormBuilder,
  public dialog: MatDialog,
  private monthService: MonthService,
  private matPaginatorIntl:MatPaginatorIntl,
){
  this.route.params.subscribe((data:any)=>{
    this.idUser = data?.id;
    this.month = data?.month;
    this.year = data?.year;
    this.monthL = this.monthService.getMonthName(data?.month);
    const numberMonth = parseInt(data?.month)-1;
    console.log("Month", numberMonth);
    this.fixedDate = new Date(data?.year, numberMonth, 1); // Juin 2024

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

  this.matPaginatorIntl.itemsPerPageLabel="TimeSheet par page";
  this.getAllTimeSheet();
  this.getAllTimeSheets();
  this.getUser();
  this.timesheetForm = new FormGroup({
    createdAt:new FormControl("",[Validators.required]),
    tache:new FormControl("",null),
    heure:new FormControl("",[Validators.required]),
    projet: new FormControl("",null),
    motifs:new FormControl("", null),
    types_deplacement:new FormControl("", null),
    presence:new FormControl("", null),
    deplacement: new FormControl('',null),
  });
  this.filterForm = new FormGroup({
    startDate: new FormControl("",[Validators.required]),
    endDate: new FormControl("",null),
  })
  
}

ngAfterViewInit(){
  this.dataSource.paginator=this.paginator;
}

getUser(){
  this.authService.getEmploye(this.idUser).subscribe((res:any)=>{
     this.user = res?.message;
  },(error) => {
    console.log("Erreur lors de la récupération des données", error);
   })
}

getAllTimeSheets(){
  this.timesheetService.getTimeSheetUserByDate(this.idUser,this.month,this.year).subscribe((res:any)=>{
    this.timesheets = res.message;
    this.dataSource.data = this.timesheets.map((data)=>({
      id:data._id,
      date: new Date(data?.createdAt).toISOString().split('T')[0],
      task:data?.tache,
      hour:data?.heure,
      projet:data?.projet,
      createdAt:data?.createdAt,
      motifs:data?.motifs,
      types_deplacement:data?.types_deplacement,
      presence:data?.presence,
      deplacement:data?.deplacement,
      responsable: data?.responsable,
     })) as TimeSheet[]

    console.log("Fichiers", this.dataSource.data);

  },(error)=>{
    console.log("Erreur lors de la récupération des données", error);
  })
}

getAllTimeSheet(){
     this.timesheetService.getTimeSheetUserByDate(this.idUser,this.month,this.year).subscribe((res:any)=>{
       this.timesheet = res?.message.map((data)=>({
        id:data._id,
        date: new Date(data?.createdAt).toISOString().split('T')[0],
        task:data?.tache,
        hour:data?.heure,
        projet:data?.projet,
        createdAt:data?.createdAt,
        motifs:data?.motifs,
        types_deplacement:data?.types_deplacement,
        presence:data?.presence,
        deplacement:data?.deplacement
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
        projet: new FormControl(data[i]?.projet, [Validators.required]),
        deplacement:new FormControl(data[i]?.deplacement, null),
        motifs:new FormControl(data[i]?.motifs, null),
        types_deplacement:new FormControl(data[i]?.types_deplacement, null),
        presence:new FormControl(data[i]?.presence, null),
      })
    )
   })
}

afterSaveTimesheet(data){
  this.timesheetService.getTimeSheetUserByDate(this.idUser,this.month,this.year).subscribe((res:any)=>{
    this.timesheet = res?.message.map((data)=>({
     id:data._id,
     date: new Date(data?.createdAt).toISOString().split('T')[0],
     task:data?.tache,
     hour:data?.heure,
     projet:data?.projet,
     createdAt:data?.createdAt,
     deplacement:data?.deplacement,
     motifs:data?.motifs,
     types_deplacement:data?.types_deplacement,
     presence:data?.presence,
    }));
    const controlArray = this.updatetimesheetForm.get('formArrayName') as FormArray;
    controlArray.push(
      this.formBuilder.group({
        createdAt:new FormControl(data?.createdAt,[Validators.required]),
        tache:new FormControl(data?.tache,[Validators.required]),
        heure:new FormControl(data?.heure,[Validators.required]),
        projet: new FormControl(data?.projet, [Validators.required]),
        deplacement: new FormControl(data?.deplacement, null),
        motifs:new FormControl(data?.motifs, null),
        types_deplacement:new FormControl(data?.types_deplacement, null),
        presence:new FormControl(data?.presence, null),
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
     task:data?.tache,
     hour:data?.heure,
     projet:data?.projet,
     createdAt:data?.createdAt,
     deplacement:data?.deplacement,
     motifs:data?.motifs,
     types_deplacement:data?.types_deplacement,
     presence:data?.presence,
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
      this.getAllTimeSheets();
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
       this.openSnackBar(this.message);
       console.log(error);
    })
  }
}

saveTime(){
  if (this.timesheetForm.valid){
    this.timesheetService.addTimeSheet(this.timesheetForm.value, this.idUser).subscribe((res:any)=>{
      this.message='Feuille de temps ajoutée avec succès.';
      this.openSnackBar(this.message);
      this.afterSaveTimesheet(res?.message);
      this.getAllTimeSheets();
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
       this.openSnackBar(this.message);
       console.log(error);
    })
  }
}

filterTime(){
  if (this.filterForm.valid){
    const startDate = new Date(this.filterForm.get('startDate').value);
    const endDate = this.filterForm.get('endDate').value ? new Date(this.filterForm.get('endDate').value) : null;
    this.isFilter = true;
    this.filteredTimes = this.timesheet.filter(time => {
      const createdAt = new Date(time.createdAt);
      if (endDate) {
        return createdAt >= startDate && createdAt <= endDate;
      } else {
        return createdAt >= startDate;
      }
    });
    console.log("Times", this.filteredTimes);
  }
}

isCheckAllTime(){
  if(this.isFilter){
    this.isFilter=false,
    this.getAllTimeSheet();
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

doSomething(event:any){
  console.log("Presence", event?.value);
  if(event?.value=='Présent'){
   this.isPresent=true;
  }else{
   this.isPresent=false;
  }
 }
 doSomethingDeplacement(event:any){
   console.log("Deplacement", event?.value);
   if(event?.value=='Non'){
     this.isDeplacement=true;
    }else{
     this.isDeplacement=false;
    }
 }

 isCheckingUpdate(){
  if(this.isUpdate){
      this.isUpdate=false
  }else{
      this.isUpdate=true
  }
 }


}
