import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from '../../shared/services/auth.service';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';

@Component({
  selector: 'app-agent-timesheet',
  templateUrl: './agent-timesheet.component.html',
  styleUrls: ['./agent-timesheet.component.scss']
})
export class AgentTimesheetComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['month','year','action'];
  dataSource =new MatTableDataSource<TimeSheet>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user:any;

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private timesheetService: TimesheetService,
  ){}

  ngOnInit(): void {
    this.getAllTimeSheet();
    this.matPaginatorIntl.itemsPerPageLabel="Feuille de temps par page";
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
  }

  getAllTimeSheet(){
    this.timesheetService.getTimeSheetByAgent().subscribe((res:any)=>{
     this.dataSource.data = res?.message.map((data)=>({
       month:data?.month,
       year:data?.year,
       monthInt:data?.monthChiffre,
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

  getTimesheet(month,year){
    this.router.navigate(['/agent/timesheet', month, year])
  }

}
export interface TimeSheet{
  month: string;
  year: string;
}
