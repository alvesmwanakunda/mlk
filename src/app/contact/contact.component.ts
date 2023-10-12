import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ContactsService } from '../shared/services/contacts.service';
import { Contacts } from '../shared/interfaces/contacts.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteContactComponent } from './delete-contact/delete-contact.component';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit,AfterViewInit {

  displayedColumns:string[]=['nom','poste','email','phone','action'];
  dataSource =new MatTableDataSource<Contacts>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  contacts:any=[];
  isListe:boolean=false;
  user:any;

  constructor(
    private contactService :ContactsService,
    public router:Router,
    private matPaginatorIntl:MatPaginatorIntl,
    public dialog: MatDialog
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){
    this.matPaginatorIntl.itemsPerPageLabel="Contact par page";
  }

  ngAfterViewInit() {
    this.allContact();
    this.dataSource.paginator=this.paginator;

  }

  allContact(){
    if(this.user.user.role=="admin"){
      this.getAllContact();
    }else{
      this.getAllContactByEntreprise();
    }
  }

  getAllContact(){
    this.contactService.getAllContact().subscribe((data:any)=>{
       this.contacts = data.message;
       this.dataSource.data = data.message.map((data)=>({
        id:data._id,
        nom:data.nom,
        prenom:data.prenom,
        email:data.email,
        indicatif:data.indicatif,
        phone:data.phone,
        poste:data.poste,
       })) as Contacts[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );
  }

  getAllContactByEntreprise(){

    this.contactService.getContactAllEntreprise(this.user?.user?.entreprise).subscribe((data:any)=>{
      this.contacts = data.message;
      this.dataSource.data = data.message.map((data)=>({
       id:data._id,
       nom:data.nom,
       prenom:data.prenom,
       email:data.email,
       indicatif:data.indicatif,
       phone:data.phone,
       poste:data.poste,
      })) as Contacts[]
   },
   (error) => {
     console.log("Erreur lors de la récupération des données", error);
   }
   );

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(!this.isListe){
      if (filterValue === '') {
        this.getAllContact();
      }else{
        this.contacts = this.contacts.filter(contact => {
            return (
              contact.nom.toLowerCase().includes(filterValue) ||
              contact.prenom.toLowerCase().includes(filterValue) ||
              contact.email.toLowerCase().includes(filterValue) ||
              contact.phone.includes(filterValue) // Je suppose que phone est une chaîne de caractères
            );
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

  getContact(idContact){
    this.router.navigate(['update/contact', idContact])
  }

  openDialogDelete(idContact){
    const dialogRef = this.dialog.open(DeleteContactComponent,{width:'30%',data:{id:idContact}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllContact();
       }
    })
  }


}
