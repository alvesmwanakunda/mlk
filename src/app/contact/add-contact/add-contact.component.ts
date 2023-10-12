import { Component,OnInit } from '@angular/core';
import { startWith, map, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { Contacts } from 'src/app/shared/interfaces/contacts.model';




@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

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
  user:any;

  constructor(
    private _formBuilder:FormBuilder,
    private countryService:CountriesService,
    private router: Router,
    private _snackBar:MatSnackBar,
    private projetService:ProjetsService,
    private entrepriseService:EntreprisesService,
    private contactService: ContactsService
  ){
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

    this.contactFormGroup=this._formBuilder.group({
      nom:['',Validators.required],
      prenom:[''],
      email:[''],
      phone:[''],
      indicatif:[''],
      projet:[[]],
      entreprise:[[]],
      poste:[''],
    });
    this.codeFiltres = this.contactFormGroup.get('indicatif').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterCode(val))
    );
    this.getAllEntreprises();
    this.getAllProjet();
    this.getContry();
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

  addContact():void{
   this.onLoadForm=true;

   if(this.contactFormGroup.valid){
      this.contact = this.contactFormGroup.value;
      if(this.user?.user?.role=="admin"){
        this.contactService.addContact(this.contact).subscribe((res:any)=>{
          this.onLoadForm=false;
          this.message='Contact a été ajouté avec succès';
          this.openSnackBar(this.message);
          this.router.navigate(["contact"]);
        },(error)=>{
          this.onLoadForm=false;
          this.message="Une erreur s'est produite veuillez réessayer.";
          this.openSnackBar(this.message);
          console.log(error);
        })
      }else{
        this.contactService.addContactEntreprise(this.contact, this.user?.user?.entreprise).subscribe((res:any)=>{
          this.onLoadForm=false;
          this.message='Contact a été ajouté avec succès';
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

}
