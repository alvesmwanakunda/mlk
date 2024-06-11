import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Contacts } from '../shared/interfaces/contacts.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from '../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['nom','email','status','action'];
  dataSource =new MatTableDataSource<Contacts>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user:any;
  message:any;

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    private authService: AuthService,
    private _snackBar:MatSnackBar,
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.getAllEmployes();
    this.matPaginatorIntl.itemsPerPageLabel="Employées par page";
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
  }

  getAllEmployes(){
       this.authService.listEmployes().subscribe((res:any)=>{
        this.dataSource.data = res?.message.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          prenom:data?.prenom,
          email:data?.email,
          valid:data?.valid
         })) as Contacts[]

       },(error) => {
        console.log("Erreur lors de la récupération des données", error);
       })
  }

  activeEmploye(id){
    this.authService.activeEmploye(id).subscribe((res:any)=>{
       this.getAllEmployes();
       this.message='Employé a été activé avec succès';
       this.openSnackBar(this.message);
     },(error) => {
      this.message="Une erreur s'est produite veuillez réessayer.";
      console.log("Erreur lors de la récupération des données", error);
     })
  }

  dissableEmploye(id){
    this.authService.dissableEmploye(id).subscribe((res:any)=>{
       this.getAllEmployes();
       this.message='Employé a été désactivé avec succès';
       this.openSnackBar(this.message);
     },(error) => {
      this.message="Une erreur s'est produite veuillez réessayer.";
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

}
