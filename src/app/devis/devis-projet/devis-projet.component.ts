import { Component,OnInit,AfterViewInit,ViewChild, ViewEncapsulation } from '@angular/core';
import { ProjetsService } from '../../shared/services/projets.service';
import { Devis } from '../../shared/interfaces/devis.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ViewerStandarComponent } from '../../viewer-standar/viewer-standar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-devis-projet',
  templateUrl: './devis-projet.component.html',
  styleUrls: ['./devis-projet.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-devis-projet'}
})
export class DevisProjetComponent implements OnInit, AfterViewInit {

  idProjet:any;
  displayedColumns:string[]=['nom','numero','date','action'];
  dataSource =new MatTableDataSource<Devis>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  devis:any=[];

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
    this.matPaginatorIntl.itemsPerPageLabel="Devis par page";
  }

  ngAfterViewInit() {
    this.getAllDevisProjet();
    this.dataSource.paginator=this.paginator;
  }

  getAllDevisProjet(){
    this.projectService.getAllDevisProjet(this.idProjet).subscribe((data:any)=>{
      console.log("data",data);
       this.dataSource.data = data.message.map((data)=>({
        id:data?._id,
        nom:data?.nom,
        projet:data?.projet?.projet,
        numero:data?.numero,
        devis:data?.devis,
        date:data?.dateLastUpdate,
        extension:data?.extension,
        chemin:data?.chemin
       })) as Devis[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogFile(chemin, extension){
    const dialogRef = this.dialog.open(ViewerStandarComponent,{
      maxWidth:'100vw',
      maxHeight:'100vh',
      width:'100%',
      height:'100%',
      panelClass:'full-screen-modal',
      data:{chemin:chemin,extension:extension}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllDevisProjet();
       }
    })
  }

  openDevis(id){
    this.router.navigate(['devis',id])
  }



}
