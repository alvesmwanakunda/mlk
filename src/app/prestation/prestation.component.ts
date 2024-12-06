import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from '../shared/services/projets.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPrestationComponent } from './add-prestation/add-prestation.component';
import { UpdatePrestationComponent } from './update-prestation/update-prestation.component';
import { DeletePrestationComponent } from './delete-prestation/delete-prestation.component';


@Component({
  selector: 'app-prestation',
  templateUrl: './prestation.component.html',
  styleUrls: ['./prestation.component.scss']
})
export class PrestationComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['reference','nom','action'];
  dataSource =new MatTableDataSource<Prestations>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user:any;
  message:any;

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    private _snackBar:MatSnackBar,
    private projetService: ProjetsService,
    public dialog: MatDialog
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.getAllPrestations();
    this.matPaginatorIntl.itemsPerPageLabel="Catégorie par page";
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
  }

  getAllPrestations(){
       this.projetService.getAllPrestations().subscribe((res:any)=>{
        this.dataSource.data = res?.message.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          reference:data?.reference,
         })) as Prestations[]

       },(error) => {
        console.log("Erreur lors de la récupération des données", error);
       })
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}

getProduit(id){
  this.router.navigate(['/prestations/produit', id])
}

openDialogAdd(){
  const dialogRef = this.dialog.open(AddPrestationComponent,{width:'50%'});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllPrestations();
     }
  })
}

openDialogAupdate(id){
  const dialogRef = this.dialog.open(UpdatePrestationComponent,{width:'50%',data:{id:id}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllPrestations();
     }
  })
}

openDialogDelete(id){
  const dialogRef = this.dialog.open(DeletePrestationComponent,{width:'30%',data:{id:id}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllPrestations();
     }
  })
}

}

export interface Prestations {
  _id:string;
  nom:string;
  reference:string;
}
