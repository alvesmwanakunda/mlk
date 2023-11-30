import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Facture } from '../shared/interfaces/facture.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ViewerStandarComponent } from '../viewer-standar/viewer-standar.component';
import { MatDialog } from '@angular/material/dialog';
import { AddFactureComponent } from './add-facture/add-facture.component';
import { UpdateFactureComponent } from './update-facture/update-facture.component';
import { DeleteFactureComponent } from './delete-facture/delete-facture.component';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['nom','numero','facture','projet','date','action'];
  dataSource =new MatTableDataSource<Facture>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  factures:any=[];

  constructor(
    private projectService :ProjetsService,
    private matPaginatorIntl:MatPaginatorIntl,
    public dialog: MatDialog
  ){}


  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Factures par page";
  }

  ngAfterViewInit() {
    this.getAllFactures();
    this.dataSource.paginator=this.paginator;
  }

  getAllFactures(){
    this.projectService.getAllFacture().subscribe((data:any)=>{
      console.log("data",data);
       this.dataSource.data = data.message.map((data)=>({
        id:data?._id,
        nom:data?.nom,
        projet:data?.projet?.projet,
        numero:data?.numero,
        facture:data?.facture,
        date:data?.dateLastUpdate,
        extension:data?.extension,
        chemin:data?.chemin
       })) as Facture[]
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
        this.getAllFactures();
       }
    })
  }

  openDialog(){
    const dialogRef = this.dialog.open(AddFactureComponent,{width:'50%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFactures();
       }
    })
  }

  openDialogUpdate(id){
    const dialogRef = this.dialog.open(UpdateFactureComponent,{width:'50%',data:{id:id}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFactures();
       }
    })
  }

  openDialogDelete(id){
    const dialogRef = this.dialog.open(DeleteFactureComponent,{width:'30%',data:{id:id}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFactures();
       }
    })
  }

}
