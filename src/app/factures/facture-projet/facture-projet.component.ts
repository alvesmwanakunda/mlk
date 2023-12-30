import { Component,OnInit,AfterViewInit,ViewChild, ViewEncapsulation } from '@angular/core';
import { ProjetsService } from '../../shared/services/projets.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Devis } from 'src/app/shared/interfaces/devis.model';

@Component({
  selector: 'app-facture-projet',
  templateUrl: './facture-projet.component.html',
  styleUrls: ['./facture-projet.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-facture-projet'}
})
export class FactureProjetComponent implements OnInit, AfterViewInit {

  idProjet:any;
  displayedColumns:string[]=['numero','date','total'];
  dataSource =new MatTableDataSource<Devis>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  factures:any=[];

  constructor(
    private projectService :ProjetsService,
    private matPaginatorIntl:MatPaginatorIntl,
    public router :Router,
    public route:ActivatedRoute,
    public dialog: MatDialog
  ){
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })
  }

  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Facture par page";
  }

  ngAfterViewInit() {
    this.getAllFactureProjet();
    this.dataSource.paginator=this.paginator;
  }

  getAllFactureProjet(){
    this.projectService.getAllFactureProjet(this.idProjet).subscribe((data:any)=>{
        this.dataSource.data = data.message.map((data)=>({
        id:data?._id,
        projet:data?.projet?.projet,
        numero:data?.numero,
        total:data?.total,
        date:data?.dateLastUpdate,
        })) as Devis[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
