import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from '../../shared/services/projets.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProduitPrestaComponent } from './add-produit-presta/add-produit-presta.component';
import { UpdateProduitPrestaComponent } from './update-produit-presta/update-produit-presta.component';
import { DeleteProduitPrestaComponent } from './delete-produit-presta/delete-produit-presta.component';

@Component({
  selector: 'app-produit-prestation',
  templateUrl: './produit-prestation.component.html',
  styleUrls: ['./produit-prestation.component.scss']
})
export class ProduitPrestationComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['reference','nom','unite','prix','action'];
  dataSource =new MatTableDataSource<Prestations>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user:any;
  message:any;
  idCat:any
  categorie:any;

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar:MatSnackBar,
    private projetService: ProjetsService,
    public dialog: MatDialog
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.idCat = this.route.snapshot.params['id'];
    console.log("id", this.idCat);
  }

  ngOnInit(): void {
    this.getAllPrestations();
    this.getCategorie();
    this.matPaginatorIntl.itemsPerPageLabel="Produit par page";
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
  }

  getCategorie(){
    this.projetService.getPrestation(this.idCat).subscribe((res:any)=>{
       this.categorie = res?.message
    },(error) => {
     console.log("Erreur lors de la récupération des données", error);
    })
}

  getAllPrestations(){
       this.projetService.getAllProduitPrestationsByCat(this.idCat).subscribe((res:any)=>{
        this.dataSource.data = res?.message.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          reference:data?.reference,
          prix:data?.prix,
          unite:data?.unite,
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

getEmploye(id){
  this.router.navigate(['/users/detail', id])
}

openDialogAdd(idCat){
  const dialogRef = this.dialog.open(AddProduitPrestaComponent,{width:'50%',data:{id:idCat}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllPrestations();
     }
  })
}

openDialogAupdate(id){
  const dialogRef = this.dialog.open(UpdateProduitPrestaComponent,{width:'50%',data:{id:id}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllPrestations();
     }
  })
}

openDialogDelete(id){
  const dialogRef = this.dialog.open(DeleteProduitPrestaComponent,{width:'30%',data:{id:id}});
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
  prix:string,
  unite:string
}
