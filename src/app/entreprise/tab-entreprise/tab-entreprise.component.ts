import { Component,OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { Entreprises } from 'src/app/shared/interfaces/entreprises.model';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';


@Component({
  selector: 'app-tab-entreprise',
  templateUrl: './tab-entreprise.component.html',
  styleUrls: ['./tab-entreprise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host:{class:'app-tab-entreprise'}
})
export class TabEntrepriseComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['nom','phone','adresse','action'];
  dataSource =new MatTableDataSource<Entreprises>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  entreprises:any=[];


  constructor(
    private entrepriseService : EntreprisesService,
    private router: Router,
    private matPaginatorIntl:MatPaginatorIntl,
  ) { }

  ngAfterViewInit() {
    this.getAllEntreprise();
    this.dataSource.paginator=this.paginator;
  }
  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Entreprise par page";
  }

  getAllEntreprise(){
    this.entrepriseService.getAllEntreprise().subscribe((data:any)=>{
       this.dataSource.data = data.message.map((data)=>({
        id:data._id,
        nom:data.societe,
        //commercial:data.commercial,
        phone:data.telephone,
        indicatif:data.indicatif,
        rue:data.rue,
        ville:data.ville,
        postal:data.postal,
       })) as Entreprises[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );
  }

  getEntreprise(idEntreprise){
    this.router.navigate(['detail/entreprise',idEntreprise]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("Event", filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
