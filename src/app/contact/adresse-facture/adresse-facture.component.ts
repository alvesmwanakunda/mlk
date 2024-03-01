import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Contacts } from 'src/app/shared/interfaces/contacts.model';

@Component({
  selector: 'app-adresse-facture',
  templateUrl: './adresse-facture.component.html',
  styleUrls: ['./adresse-facture.component.scss']
})
export class AdresseFactureComponent implements OnInit {

  contactFormGroup:FormGroup;
  contactFormError:any;
  onLoadForm:boolean=false;
  contact:Contacts;
  message:any;
  idContact:any;

  constructor(
    private countryService:CountriesService,
    private router: Router,
    private _snackBar:MatSnackBar,
    private contactService: ContactsService,
    private route: ActivatedRoute,
  ){
    this.route.params.subscribe((data:any)=>{
      this.idContact = data.id
     });

    this.contactFormError={
      nom:{},
    };
  }

  champ_validation={
    type:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }

  ngOnInit() {
    this.getContact();
  }

  getContact(){
    this.contactService.getContact(this.idContact).subscribe((data:any)=>{
      this.contact=data.message;
      if(this.contact){

        this.contactFormGroup=new FormGroup({
          rue:new FormControl(this.contact.rue,[Validators.required]),
          numero:new FormControl(this.contact.numero,[Validators.required]),
          postal:new FormControl(this.contact.postal,[Validators.required]),
        });

      }
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    )
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  updateContact():void{
    this.onLoadForm=true;
    if(this.contactFormGroup.valid){
       this.contactService.updateContactFacture(this.idContact,this.contact).subscribe((res:any)=>{
         this.onLoadForm=false;
         this.message='Contact a été modifié avec succès';
         this.openSnackBar(this.message);
       },(error)=>{
         this.onLoadForm=false;
         this.message="Une erreur s'est produite veuillez réessayer.";
         this.openSnackBar(this.message);
         console.log(error);
       })
    }

   }

}
