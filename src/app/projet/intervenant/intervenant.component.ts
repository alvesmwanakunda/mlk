import { Component,OnInit,ViewEncapsulation,Input } from '@angular/core';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { Router, ActivatedRoute } from '@angular/router';


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
  id:any;

  constructor(
    private contactService :ContactsService,
    public router :Router,
    public route:ActivatedRoute
  ){
    this.route.params.subscribe((data:any)=>{
      this.id = data.id
     })
  }

  ngOnInit(){

    console.log("Type", this.type);
    if(this.type=="projet"){
      this.getAllContactProjet();
    }else{
      this.getAllContactEntreprise();
    }
  }

  getAllContactEntreprise(){
    this.contactService.getContactAllEntreprise(this.id).subscribe((data:any)=>{
      this.contacts = data.message;
   },
   (error) => {
     console.log("Erreur lors de la récupération des données", error);
   }
   );
  }

  getAllContactProjet(){
    this.contactService.getContactAllProjet(this.id).subscribe((data:any)=>{
      this.contacts = data.message;
   },
   (error) => {
     console.log("Erreur lors de la récupération des données", error);
   }
   );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
      if (filterValue === '') {
        if(this.type=="projet"){
          this.getAllContactProjet();
        }else{
          this.getAllContactEntreprise();
        }
      }else{
        this.contacts = this.contacts.filter(projet => {
          return (
            projet.nom.toLowerCase().includes(filterValue)
          );
        });
      }
  }

}
