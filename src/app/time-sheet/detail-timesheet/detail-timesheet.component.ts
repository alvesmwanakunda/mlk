import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from '../../shared/services/auth.service';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { MatDialog } from '@angular/material/dialog';



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
isPresent:boolean=true;
isDeplacement:boolean=true
filterForm: FormGroup;
months:any=[];

constructor(
  private matPaginatorIntl:MatPaginatorIntl,
  private router: Router,
  private authService: AuthService,
  private route: ActivatedRoute,
  private timesheetService: TimesheetService,
  private formBuilder: FormBuilder,
  private countrieService: CountriesService,
  private _snackBar:MatSnackBar,
  public dialog: MatDialog,
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
  this.getMonth();

  this.filterForm = new FormGroup({
    startDate: new FormControl("",[Validators.required]),
    endDate: new FormControl("",[Validators.required]),
  })

  this.matPaginatorIntl.itemsPerPageLabel="Feuille de temps par page";
  this.timesheetForm = new FormGroup({
    createdAt:new FormControl("",[Validators.required]),
    tache:new FormControl("",null),
    heure:new FormControl("",null),
    //user: new FormControl(this.idUser,null),
    motifs:new FormControl("", null),
    types_deplacement:new FormControl("", null),
    presence:new FormControl("", null),
    projet: new FormControl("", null),
    deplacement: new FormControl("", null),
  })
}

getMonth(){
  this.countrieService.getMonth().subscribe(
    (data)=>{
      this.months = data;
    },
    (error)=>{
      console.log(error);
    }
  )
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
    this.timesheetService.addTimeSheet(this.timesheetForm.value, this.idUser).subscribe((res:any)=>{
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

  downloadFile(){
    if(this.filterForm.valid){
      //console.log("Valeur", this.filterForm.value.startDate);
      let month = this.filterForm.value.startDate;
      let year = this.filterForm.value.endDate;
      this.timesheetService.getTimeSheetDonwload(this.filterForm.value.startDate,this.filterForm.value.endDate).subscribe((res:any)=>{
        console.log("Data", res);
        console.log(this.user);
        
        // this.excelService.generateExcelTimeSheet(res.message,month,year);
      },(error) => {
      console.log("Erreur lors de la récupération des données", error);
      })
    }
  }

  openApercuView(){
    this.downloadFile();
    if(this.filterForm.valid){
      this.router.navigate(['/timesheet', this.idUser,"apercu" ,this.filterForm.value.startDate, this.filterForm.value.endDate])
      // const dialogRef = this.dialog.open(ApercuTimesheetComponent,{width:'80%', data: {user: this.user, month: this.filterForm.value.startDate, year: this.filterForm.value.endDate }});
    }
  }

}
export interface TimeSheet{
  month: string;
  year: string;
}
