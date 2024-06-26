import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Contacts } from '../shared/interfaces/contacts.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from '../shared/services/auth.service';

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

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    private authService: AuthService,
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.getAllEmployes();
    this.matPaginatorIntl.itemsPerPageLabel="Employées par page";
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
  }

  getAllEmployes(){
       this.authService.listEmployes().subscribe((res:any)=>{
        this.dataSource.data = res?.message.map((data)=>({
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

getTimesheet(id){
  this.router.navigate(['/timesheet', id])
}

}
