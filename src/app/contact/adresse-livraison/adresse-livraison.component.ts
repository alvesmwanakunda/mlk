import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adresse-livraison',
  templateUrl: './adresse-livraison.component.html',
  styleUrls: ['./adresse-livraison.component.scss']
})
export class AdresseLivraisonComponent implements OnInit {


  contactFormGroup:FormGroup;
  contactFormError:any;
  onLoadForm:boolean=false;
  adresse:any;
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
    this.contactService.getContactLivraison(this.idContact).subscribe((data:any)=>{
      this.adresse=data?.message;
      if(this.adresse){
        this.contactFormGroup=new FormGroup({
          rue:new FormControl(this.adresse.rue,[Validators.required]),
          numero:new FormControl(this.adresse.numero,[Validators.required]),
          postal:new FormControl(this.adresse.postal,[Validators.required]),
        });
      }else{
        this.contactFormGroup=new FormGroup({
          rue:new FormControl('',[Validators.required]),
          numero:new FormControl('',[Validators.required]),
          postal:new FormControl('',[Validators.required]),
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
       this.contactService.updateContactLivraison(this.adresse, this.adresse?._id).subscribe((res:any)=>{
         this.onLoadForm=false;
         this.message='Adresse de livraison a été modifié avec succès';
         this.openSnackBar(this.message);
       },(error)=>{
         this.onLoadForm=false;
         this.message="Une erreur s'est produite veuillez réessayer.";
         this.openSnackBar(this.message);
         console.log(error);
       })
    }

   }

   addContact():void{
    this.onLoadForm=true;
    if(this.contactFormGroup.valid){
       this.contactService.addContactLivraison(this.contactFormGroup.value, this.idContact).subscribe((res:any)=>{
         this.onLoadForm=false;
         this.message='Adresse de livraison  a été ajouteé avec succès';
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
