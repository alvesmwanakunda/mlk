import { Component,OnInit,ViewEncapsulation,Input } from '@angular/core';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjetsService } from 'src/app/shared/services/projets.service';


@Component({
  selector: 'app-intervenant',
  templateUrl: './intervenant.component.html',
  styleUrls: ['./intervenant.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host:{class:'app-intervenant'}
})
export class IntervenantComponent implements OnInit {

  @Input() type:any

  contacts:any=[];
  //id:any;
  project:any;
  @Input() idProjet?:any;
  @Input() idEntreprise?:any;

  constructor(
    private contactService :ContactsService,
    public router :Router,
    public route:ActivatedRoute,
    private projetService:ProjetsService
  ){}

  ngOnInit(){

    if(this.idProjet){
      this.getProjet(this.idProjet);
    }else{
        this.getAllContactEntreprise(this.idEntreprise)
    }
  }

  getProjet(idProjet){
    this.projetService.getProjet(idProjet).subscribe((data:any)=>{
       this.project=data.message;
       this.getAllContactEntreprise(this.project?.entreprise);
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getAllContactEntreprise(idEntreprise){
    this.contactService.getContactAllEntreprise(idEntreprise).subscribe((data:any)=>{
      this.contacts = data.message;
      console.log("Projet E", data);
   },
   (error) => {
     console.log("Erreur lors de la récupération des données", error);
   }
   );
  }

  getAllContactProjet(idProjet){
    this.contactService.getContactAllProjet(idProjet).subscribe((data:any)=>{
      this.contacts = data.message;
      console.log("Projet P", data);
   },
   (error) => {
     console.log("Erreur lors de la récupération des données", error);
   }
   );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
      if (filterValue === '') {
        /*if(this.type=="projet"){
          this.getAllContactProjet(this.project._id);
        }else{
          this.getAllContactEntreprise(this.project.entreprise);
        }*/
        this.getAllContactEntreprise(this.project.entreprise);
      }else{
        this.contacts = this.contacts.filter(contact => {
          return (
              contact.nom.toLowerCase().includes(filterValue) ||
              contact.prenom.toLowerCase().includes(filterValue) ||
              contact.email.toLowerCase().includes(filterValue) ||
              contact.phone.includes(filterValue)
          );
        });
      }
  }

  addContact(){
    this.router.navigate(['add/contact']);
  }

}
