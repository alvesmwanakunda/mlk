import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from '../../shared/services/auth.service';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-detail-timesheet',
  templateUrl: './detail-timesheet.component.html',
  styleUrls: ['./detail-timesheet.component.scss']
})
export class DetailTimesheetComponent implements OnInit, AfterViewInit {

idUser:any;
displayedColumns:string[]=['month','year','action'];
dataSource =new MatTableDataSource<TimeSheet>();
@ViewChild(MatPaginator) paginator: MatPaginator;
user:any;
timesheetForm: FormGroup;
message:any;

constructor(
  private matPaginatorIntl:MatPaginatorIntl,
  private router: Router,
  private authService: AuthService,
  private route: ActivatedRoute,
  private timesheetService: TimesheetService,
  private _snackBar:MatSnackBar,
){
  this.route.params.subscribe((data:any)=>{
    this.idUser = data?.id
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
  this.matPaginatorIntl.itemsPerPageLabel="Feuille de temps par page";
  this.timesheetForm = new FormGroup({
    createdAt:new FormControl("",[Validators.required]),
    tache:new FormControl("",[Validators.required]),
    heure:new FormControl("",[Validators.required]),
    user: new FormControl(this.idUser,null),
    projet: new FormControl("", [Validators.required]),
    deplacement: new FormControl("", null),
  })
}

ngAfterViewInit(): void {
  this.dataSource.paginator=this.paginator;
}

getUser(){
  this.authService.getEmploye(this.idUser).subscribe((res:any)=>{
     this.user = res?.message;
  },(error) => {
    console.log("Erreur lors de la récupération des données", error);
   })
}

getAllTimeSheet(){
     this.timesheetService.getTimeSheetByUser(this.idUser).subscribe((res:any)=>{
      this.dataSource.data = res?.message.map((data)=>({
        month:data?.month,
        year:data?.year,
        monthInt:data?.monthChiffre,
        projet:data?.projet,
        deplacement:data?.deplacement
       })) as TimeSheet[]

     },(error) => {
      console.log("Erreur lors de la récupération des données", error);
     })
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

getTimesheet(id,month,year){
this.router.navigate(['/timesheet', id, month, year])
}

saveTime(){
  if (this.timesheetForm.valid){
    this.timesheetService.addTimeSheet(this.timesheetForm.value).subscribe((res:any)=>{
      this.message='Feuille de temps ajoutée avec succès.';
      this.openSnackBar(this.message);
      this.getAllTimeSheet();
      //this.timesheetForm.reset();
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
export interface TimeSheet{
  month: string;
  year: string;
}
