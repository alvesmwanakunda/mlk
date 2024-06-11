import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Conges } from '../shared/interfaces/conges.model';
import { EntreprisesService } from '../shared/services/entreprises.service';

@Component({
  selector: 'app-conges',
  templateUrl: './conges.component.html',
  styleUrls: ['./conges.component.scss']
})
export class CongesComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['user','debut','fin','type','status','action'];
  dataSource =new MatTableDataSource<Conges>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user:any;

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    private entreprisesService: EntreprisesService
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.getAllConges();
    this.matPaginatorIntl.itemsPerPageLabel="Conge par page";
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
  }

  getAllConges(){
    if(this.user?.user?.role=='admin'){
       this.entreprisesService.listConges().subscribe((res:any)=>{
        this.dataSource.data = res?.message.map((data)=>({
          id:data?._id,
          user:data?.user,
          debut:data?.debut,
          fin:data?.fin,
          type:data?.types,
          status:data?.status,
         })) as Conges[]

       },(error) => {
        console.log("Erreur lors de la récupération des données", error);
       })

    }else{
      this.entreprisesService.listCongesUser().subscribe((res:any)=>{
        this.dataSource.data = res?.message.map((data)=>({
          id:data?._id,
          user:data?.user,
          debut:data?.debut,
          fin:data?.fin,
          type:data?.type,
          status:data?.status,
         })) as Conges[]

       },(error) => {
        console.log("Erreur lors de la récupération des données", error);
       })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}

getConge(id){
  this.router.navigate(['conge', id])
}


}


