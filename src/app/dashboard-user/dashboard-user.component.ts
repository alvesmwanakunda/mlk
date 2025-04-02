import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Projets } from '../shared/interfaces/projets.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss']
})
export class DashboardUserComponent implements OnInit, AfterViewInit {


  displayedColumns:string[]=['nom','entreprise','action'];
  dataSource =new MatTableDataSource<Projets>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  projets:any=[];
  isListe:boolean=true;
  user:any;
  company:any;
  visibleProjets: any[] = []; // Projets visibles
  itemsPerPage = 8; // Nombre d'éléments par page
  currentIndex = 0; // Index actuel de pagination

  constructor(
    private projetService: ProjetsService,
    private router: Router,
    private matPaginatorIntl:MatPaginatorIntl,
    private entrepriseService:EntreprisesService
    ) {
      this.user = JSON.parse(localStorage.getItem('user'));
      //console.log("User",this.user);

    }

  ngOnInit() {
    this.getAllProjet();
    this.getEntrepriseId();
    this.matPaginatorIntl.itemsPerPageLabel="Projet par page";
  }

  ngAfterViewInit() {
    this.dataSource.paginator=this.paginator;
  }

  getEntrepriseId(){
    this.entrepriseService.getEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
       this.company = res.message
    },(error)=>{
        console.log("Une erreur", error);
    })
  }

  getAllProjet(){
    this.projetService.getProjetEntreprise(this.user?.user?.entreprise).subscribe((data:any)=>{
       this.projets = data?.message.reverse();
       this.visibleProjets = this.projets.slice(0, this.itemsPerPage);
       this.currentIndex = this.itemsPerPage;

       this.dataSource.data = this.projets.map((data)=>({
        id:data._id,
        nom:data.projet,
        entreprise:data?.entreprise?.societe,
        etat:data.etat,
        limite:data.date_limite,
       })) as Projets[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );
  }


  loadMore() {
    const nextItems = this.projets.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    this.visibleProjets = [...this.visibleProjets, ...nextItems];
    this.currentIndex += this.itemsPerPage;
  }

  getProjet(idProjet){
    this.router.navigate(['entreprise/projet',idProjet]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(!this.isListe){
      if (filterValue === '') {
        this.getAllProjet();
      }else{
        this.projets = this.projets.filter(projet => {
          return projet.projet.trim().toLowerCase().includes(filterValue.trim().toLowerCase());
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

  addProjet(){
    this.router.navigate(['add/entreprise/projet',this.user?.user?.entreprise]);
  }

}
