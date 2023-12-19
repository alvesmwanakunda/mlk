import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Devis } from '../shared/interfaces/devis.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AddDevisComponent } from './add-devis/add-devis.component';
import { ViewerStandarComponent } from '../viewer-standar/viewer-standar.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDevisComponent } from './update-devis/update-devis.component';
import { DeleteDevisComponent } from './delete-devis/delete-devis.component';




@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.scss']
})
export class DevisComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['nom','numero','projet','date','action'];
  dataSource =new MatTableDataSource<Devis>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  devis:any=[];
  user:any;


  constructor(
    private projectService :ProjetsService,
    private matPaginatorIntl:MatPaginatorIntl,
    public dialog: MatDialog
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }


  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Devis par page";
  }

  ngAfterViewInit() {
    this,this.getAllDevis();
    this.dataSource.paginator=this.paginator;
  }

  getAllDevis(){
    if(this.user?.user?.role=='user'){
      this.projectService.getAllDevisEntreprise(this.user?.user?.entreprise).subscribe((data:any)=>{
        this.dataSource.data = data.message.map((data)=>({
        id:data?._id,
        nom:data?.nom,
        projet:data?.projet?.projet,
        numero:data?.numero,
        date:data?.dateLastUpdate,
        })) as Devis[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    });

    }else{
      this.projectService.getAllDevis().subscribe((data:any)=>{
          this.dataSource.data = data.message.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          projet:data?.projet?.projet,
          numero:data?.numero,
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

openDialog(){
  const dialogRef = this.dialog.open(AddDevisComponent,{width:'50%'});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllDevis();
     }
  })
}

openDialogDelete(id){
  const dialogRef = this.dialog.open(DeleteDevisComponent,{width:'30%',data:{id:id}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllDevis();
     }
  })
}

openDialogUpdate(id){
  const dialogRef = this.dialog.open(UpdateDevisComponent,{width:'50%',data:{id:id}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllDevis();
     }
  })
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
      this.getAllDevis();
     }
  })
}

}
