import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Facture } from '../shared/interfaces/facture.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Devis } from '../shared/interfaces/devis.model';



@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['numero','date','projet','total','action'];
  dataSource =new MatTableDataSource<Devis>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  factures:any=[];
  user:any;
  devis:any=[];

  constructor(
    private projectService :ProjetsService,
    private matPaginatorIntl:MatPaginatorIntl,
    public dialog: MatDialog
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }


  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Factures par page";
  }

  ngAfterViewInit() {
    this.getAllFactures();
    this.dataSource.paginator=this.paginator;
  }

  getAllFactures(){
    if(this.user?.user?.role=='user'){
      this.projectService.getAllFactureEntreprise(this.user?.user?.entreprise).subscribe((data:any)=>{
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

    }else{
      this.projectService.getAllFacture().subscribe((data:any)=>{
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
