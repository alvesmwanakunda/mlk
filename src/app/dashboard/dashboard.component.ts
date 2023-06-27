import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Projets } from '../shared/interfaces/projets.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['nom','entreprise','etat','limite','action'];
  dataSource =new MatTableDataSource<Projets>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  projets:any=[];
  isListe:boolean=false;

  constructor(
    private projetService: ProjetsService,
    private router: Router,
    private matPaginatorIntl:MatPaginatorIntl
    ) {}

  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Projet par page";
  }

  ngAfterViewInit() {
    this.getAllProjet();
    this.dataSource.paginator=this.paginator;
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((data:any)=>{
       this.projets = data.message;
       this.dataSource.data = data.message.map((data)=>({
        id:data._id,
        nom:data.nom,
        entreprise:data?.entreprise?.nom,
        etat:data.etat,
        limite:data.date_limite,
       })) as Projets[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );
  }

  getProjet(idProjet){
    this.router.navigate(['projet',idProjet]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(!this.isListe){
      if (filterValue === '') {
        this.getAllProjet();
      }else{
        this.projets = this.projets.filter(projet => {
          return (
            projet.nom.toLowerCase().includes(filterValue)
          );
        });
      }

    }else{
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  getList(){
    if(!this.isListe){
      this.isListe=true;
    }else{
      this.isListe=false;
    }
  }

}
