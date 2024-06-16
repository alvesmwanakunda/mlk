import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, map, Observable } from 'rxjs';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ContactsService } from 'src/app/shared/services/contacts.service';


@Component({
  selector: 'app-update-projet',
  templateUrl: './update-projet.component.html',
  styleUrls: ['./update-projet.component.scss']
})
export class UpdateProjetComponent implements OnInit {


  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;
  threeFormGroup:FormGroup;
  myPaysControl = new FormControl();
  filteredOptions:string[]=[];
  fileName:any;
  file:File;
  projetFormError:any;
  onLoadForm:boolean=false;
  projet:any;
  idProjet:any;
  message:any;
  countries: any=[];
  entreprises:any=[]
  selectedImage: string;
  paysFiltres:Observable<any[]>;
  image:any;
  jours:any;
  fin:any;
  devis:any=[];
  devisFiltres:Observable<any[]>;
  contacts:any;



  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private router :Router,
    private countryService:CountriesService,
    private projetService:ProjetsService,
    private entrepriseService:EntreprisesService,
    private route: ActivatedRoute,
    private sanitizer :DomSanitizer,
    private contactService:ContactsService
  ) {
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     });
    this.projetFormError={
      nom:{},
      entreprise:{},
      service:{},
      etat:{},
      responsable:{},
    };
  }

  champ_validation={
    nom:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
    entreprise:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
    service:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
  }

  ngOnInit(){

    this.getProjet();
    this.getAllEntreprises();
    this.getContry();
    this.getDevis();

    this.firstFormGroup=this._formBuilder.group({
      projet:['',Validators.required],
      entreprise:['',Validators.required],
      etat:['',null],
      genre:['',null],
      nom:['',null],
      prenom:['',null],
      plan:['',null],
      contact:['',null]
    });
    this.secondFormGroup=this._formBuilder.group({
      pays:[''],
      adresse:[''],
      ville:[''],
      rue:[''],
      postal:[''],
    });
    this.threeFormGroup=this._formBuilder.group({
      budget:[''],
      devise:[''],
      site_offre:[''],
      date_limite:[''],
      date_fin_contrat:[''],
      numero_offre:[''],
    });

    this.paysFiltres = this.secondFormGroup.get('pays').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterPays(val))
    );

    this.devisFiltres = this.threeFormGroup.get('devise').valueChanges.pipe(
      startWith(''),
      map((val)=> this.filterDevis(val))
    )
  }

  getProjet(){
    this.projetService.getProjet(this.idProjet).subscribe((res:any)=>{
      this.projet = res.message;
      if(this.projet){
        this.getContact(this.projet.entreprise);
      }
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${res.message.photo}`);
      this.jours = new Date(res.message.date_limite).toISOString().split('T')[0];
      this.fin = new Date(res.message.date_fin_contrat).toISOString().split('T')[0];
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  filterPays(value:string){
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.name.toLocaleLowerCase().includes(filtre));
  }

  filterDevis(value:string){
    const filtre = value.toLowerCase();
    return this.devis.filter(option=> option.nom.toLocaleLowerCase().includes(filtre));
  }

  onFileSelected(event){
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    const reader = new FileReader();
    reader.onload=()=>{
      this.selectedImage = reader.result as string;
    };
    reader.readAsDataURL(this.file);

  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
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
  getDevis(){
    this.countryService.getDevises().subscribe(
      (data)=>{
       this.devis = data;
       //console.log("devis", this.devis);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  getAllEntreprises(){
    this.entrepriseService.getAllEntreprise().subscribe((res:any)=>{
        this.entreprises = res.message;
    },(error)=>{
      console.log(error);
    })
  }

  updateProjet():void{

    this.onLoadForm=true;
     const formData:FormData=new FormData();
     Object.assign(this.projet, this.firstFormGroup.value);
     Object.assign(this.projet, this.secondFormGroup.value);
     Object.assign(this.projet, this.threeFormGroup.value)

     formData.append("uploadfile", this.file);
     formData.append("nom", this.projet.nom);
     formData.append("prenom", this.projet.prenom);
     formData.append("contact", this.projet.contact);
     formData.append("genre", this.projet.genre);
     formData.append("projet", this.projet.projet);
     formData.append("entreprise", this.projet.entreprise);
     formData.append("etat", this.projet.etat);
     formData.append("plan", this.projet.plan);
     formData.append("responsable", this.projet.responsable);
     formData.append("pays", this.projet.pays);
     formData.append("adresse", this.projet.adresse);
     formData.append("ville", this.projet.ville);
     formData.append("rue", this.projet.rue);
     formData.append("postal", this.projet.postal);
     formData.append("budget", this.projet.budget);
     formData.append("devise", this.projet.devise);
     formData.append("site_offre", this.projet.site_offre);
     formData.append("numero_offre", this.projet.numero_offre);
     formData.append("date_limite", this.projet.date_limite);
     formData.append("date_fin_contrat", this.projet.date_fin_contrat);


     this.projetService.updateProjet(this.idProjet,formData).subscribe((res:any)=>{

       try {
            this.onLoadForm=false;
            this.message='Projet a été modifié avec succès';
            this.openSnackBar(this.message);
            this.router.navigate(["projet",res.message._id]);
       } catch (error) {
           this.onLoadForm=false;
           this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
       }

     })
 }

doSomething(event:any){
  this.getContact(event?.value);
}
getContact(idEntreprise){
  this.contactService.getContactAllEntreprise(idEntreprise).subscribe((res:any)=>{
     this.contacts=res?.message;
  },(error)=>{
   console.log(error);
 })
}

}
