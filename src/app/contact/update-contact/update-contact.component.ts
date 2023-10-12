import { Component,OnInit } from '@angular/core';
import { startWith, map, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { Contacts } from 'src/app/shared/interfaces/contacts.model';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.scss']
})
export class UpdateContactComponent implements OnInit {

  indicatifControl = new FormControl();
  contactFormGroup:FormGroup;
  contactFormError:any;
  onLoadForm:boolean=false;
  countries: any=[];
  codeFiltres:Observable<any[]>;
  entreprises:any;
  projets:any;
  contact:Contacts;
  message:any;
  idContact:any;
  user:any;

  constructor(
    private _formBuilder:FormBuilder,
    private countryService:CountriesService,
    private router: Router,
    private _snackBar:MatSnackBar,
    private projetService:ProjetsService,
    private entrepriseService:EntreprisesService,
    private contactService: ContactsService,
    private route: ActivatedRoute
  ){
    this.route.params.subscribe((data:any)=>{
      this.idContact = data.id
     });

    this.contactFormError={
      nom:{},
    };
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  champ_validation={
    nom:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
  }

  ngOnInit(){
    this.getContact();
    this.getAllEntreprises();
    this.getAllProjet();
    this.getContry();
  }

  getContact(){
    this.contactService.getContact(this.idContact).subscribe((data:any)=>{
      this.contact=data.message;
      if(this.contact){

        this.contactFormGroup=this._formBuilder.group({
          nom:[this.contact.nom,Validators.required],
          prenom:[this.contact.prenom,null],
          email:[this.contact.email,null],
          phone:[this.contact.phone,null],
          indicatif:[this.contact.indicatif,null],
          projet:[this.contact.projet,null],
          entreprise:[this.contact.entreprise,null],
          poste:[this.contact.poste, null],
        });
        this.codeFiltres = this.contactFormGroup.get('indicatif').valueChanges.pipe(
          startWith(''),
          map((val) => this.filterCode(val))
        );

      }
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    )
  }


  filterCode(value:string){
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.dial_code.toLocaleLowerCase().includes(filtre));
  }

  getAllEntreprises(){
    this.entrepriseService.getAllEntreprise().subscribe((res:any)=>{
      try {
           this.entreprises=res.message;
      } catch (error) {
         console.log("Erreur entreprise", error);
      }
    })
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((data:any)=>{
       this.projets = data.message;
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  getContry(){
    this.countryService.getCountries().subscribe(
      (data)=>{
        this.countries = data;
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  updateContact():void{
    this.onLoadForm=true;
    if(this.contactFormGroup.valid){
       this.contactService.updateContact(this.idContact,this.contact).subscribe((res:any)=>{
         this.onLoadForm=false;
         this.message='Contact a été modifié avec succès';
         this.openSnackBar(this.message);
         this.router.navigate(["contact"]);
       },(error)=>{
         this.onLoadForm=false;
         this.message="Une erreur s'est produite veuillez réessayer.";
         this.openSnackBar(this.message);
         console.log(error);
       })
    }

   }

}
