import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { Router } from '@angular/router';
import { startWith, map, Observable } from 'rxjs';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';

@Component({
  selector: 'app-add-projet',
  templateUrl: './add-projet.component.html',
  styleUrls: ['./add-projet.component.scss']
})
export class AddProjetComponent implements OnInit {

  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;
  threeFormGroup:FormGroup;
  myPaysControl = new FormControl();
  filteredOptions:string[]=[];
  fileName:any;
  file:File;
  projetFormError:any;
  onLoadForm:boolean=false;
  form1:any;
  form2:any;
  form3:any;
  message:any;
  countries: any=[];
  devis:any=[];
  entreprises:any=[]
  selectedImage: string;
  paysFiltres:Observable<any[]>;
  devisFiltres:Observable<any[]>


  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private router :Router,
    private countryService:CountriesService,
    private projetService:ProjetsService,
    private entrepriseService:EntreprisesService
  ) {
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

    this.getAllEntreprises();

    this.firstFormGroup=this._formBuilder.group({
      projet:['',Validators.required],
      entreprise:['',Validators.required],
      nom:['',null],
      prenom:['',null],
      genre:['',null],
      plan:['',null]
    });
    this.secondFormGroup=this._formBuilder.group({
      pays:[''],
      adresse:[''],
      ville:[''],
      rue:[''],
      postal:[''],
      numero:['']
    });
    this.threeFormGroup=this._formBuilder.group({
      budget:[''],
      devise:[''],
      site_offre:[''],
      date_limite:[''],
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

    this.getContry();
    this.getDevis();
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

  addProjet():void{

    this.onLoadForm=true;

     this.form1={};
     this.form2={};
     this.form3={};
     const formData:FormData=new FormData();
     Object.assign(this.form1, this.firstFormGroup.value);
     Object.assign(this.form2, this.secondFormGroup.value);
     Object.assign(this.form3, this.threeFormGroup.value)

     formData.append("uploadfile", this.file);
     formData.append("projet", this.form1.projet);
     formData.append("genre", this.form1.genre);
     formData.append("nom", this.form1.nom);
     formData.append("prenom", this.form1.prenom);
     formData.append("entreprise", this.form1.entreprise);
     formData.append("etat", this.form1.etat);
     formData.append("responsable", this.form1.responsable);
     formData.append("pays", this.form2.pays);
     formData.append("adresse", this.form2.adresse);
     formData.append("ville", this.form2.ville);
     formData.append("rue", this.form2.rue);
     formData.append("postal", this.form2.postal);
     formData.append("budget", this.form3.budget);
     formData.append("devise", this.form3.devise);
     formData.append("site_offre", this.form3.site_offre);
     formData.append("numero_offre", this.form3.numero_offre);
     formData.append("date_limite", this.form3.date_limite);

     this.projetService.addProjet(formData).subscribe((res:any)=>{

       try {
            this.onLoadForm=false;
            this.message='Projet a été ajouté avec succès';
            this.openSnackBar(this.message);
            this.router.navigate(["projet",res.message._id]);
       } catch (error) {
           this.onLoadForm=false;
           this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
       }

     })
 }

}
