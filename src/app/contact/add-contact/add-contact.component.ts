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
import { AuthService } from 'src/app/shared/services/auth.service';




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
  entreprises:any=[];
  projets:any;
  contact:Contacts;
  message:any;
  user:any;
  emailExists: boolean;
  entrepriseFiltres:Observable<any[]>;
  entreprise:any;


  constructor(
    private _formBuilder:FormBuilder,
    private countryService:CountriesService,
    private router: Router,
    private _snackBar:MatSnackBar,
    private entrepriseService:EntreprisesService,
    private contactService: ContactsService,
    private authService: AuthService,
  ){
    this.contactFormError={
      nom:{},
    };
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  champ_validation={
    email:[
      {
        type: "required",
        message: "Adresse E-mail est obligatoire",
      },{
        type:"pattern",
        message: "Veuillez respecter le format email.",
      }
    ],
    type:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
    phone:[
      {
        type:"required",
        message:"Veuillez indiquer votre téléphone"
      },
      {
        type:"pattern",
        message:"Numéro de téléphone incorrect"
      }
    ],
  }

  ngOnInit(){
    this.getAllEntreprises();
    this.getContry();

    this.contactFormGroup=new FormGroup({
      nom:new FormControl("",[Validators.required]),
      prenom:new FormControl("",[Validators.required]),
      genre:new FormControl("",[Validators.required]),
      email:new FormControl("",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      phone:new FormControl("",[Validators.required,Validators.pattern("[0-9 ]{9}")]),
      indicatif:new FormControl("",[Validators.required]),
      entreprise:new FormControl("",[Validators.required]),
      poste:new FormControl("",null),
    });
    this.codeFiltres = this.contactFormGroup.get('indicatif').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterCode(val))
    );
    this.entrepriseFiltres = this.contactFormGroup.get('entreprise').valueChanges.pipe(
      startWith(''),
      map((val)=> this.filterEntreprise(val))
    );
    
  }

  filterCode(value:string){
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.dial_code.toLocaleLowerCase().includes(filtre));
  }

  filterEntreprise(value:string){
    const filtre = value ? value.toLowerCase() : '';
    return this.entreprises.filter(option => {
      //console.log("Option entre", option);
      return option && option.societe && option.societe.toLowerCase().includes(filtre);
    });
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

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  checkEmail(){
    const email = this.contactFormGroup.get('email').value;
    this.authService.checkEmail(email).subscribe((response:{exists:boolean})=>{
      this.emailExists = response.exists;
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
   if(!this.contactFormGroup.invalid){
      this.contactFormGroup.get('entreprise').setValue(this.entreprise._id);
      this.contact = this.contactFormGroup.value;
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
   }
    else{
      console.log("Erreur validation",  this.contactFormGroup.value);
    }
  }

  onOptionClientSelected(event) {
    const selectedName = event.option.value;
    if(selectedName){
      this.entreprise = this.entreprises.filter(item=> item.societe==selectedName)[0];
      //console.log("Entreprise", this.entreprise);
      //this.contactFormGroup.get('entreprise').setValue(this.entreprise._id);
    }
  }
}
