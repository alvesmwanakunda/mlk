import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Contacts } from '../shared/interfaces/contacts.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { CountriesService } from '../shared/services/countries.service';
import { ExcelService } from '../shared/services/excel.service';
import { TimesheetService } from '../shared/services/timesheet.service';


@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss']
})
export class TimeSheetComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['nom','email','action'];
  dataSource =new MatTableDataSource<Contacts>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user:any;
  filterForm: FormGroup;
  months:any=[];
  employes:any=[];


  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private countrieService: CountriesService,
    private excelService: ExcelService,
    private timesheetService: TimesheetService
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
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
    this.getAllEmployes();
    this.matPaginatorIntl.itemsPerPageLabel="Employées par page";
    this.getMonth();

    this.filterForm = new FormGroup({
      startDate: new FormControl("",[Validators.required]),
      endDate: new FormControl("",[Validators.required]),
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
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

  getAllEmployes(){
       this.authService.listEmployes().subscribe((res:any)=>{
        this.employes = res?.message.filter(item => item.valid==true);
        this.dataSource.data = this.employes.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          prenom:data?.prenom,
          email:data?.email,
         })) as Contacts[]

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

downloadFile(){
  if(this.filterForm.valid){
    //console.log("Valeur", this.filterForm.value.startDate);
    let month = this.filterForm.value.startDate;
    let year = this.filterForm.value.endDate;
    this.timesheetService.getTimeSheetDonwload(this.filterForm.value.startDate,this.filterForm.value.endDate).subscribe((res:any)=>{
      console.log("Data", res);
      this.excelService.generateExcelTimeSheet(res.message,month,year);
    },(error) => {
     console.log("Erreur lors de la récupération des données", error);
    })
  }
}

getTimesheet(id){
  this.router.navigate(['/timesheet', id])
}

}
