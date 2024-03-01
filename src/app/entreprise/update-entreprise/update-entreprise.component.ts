import { Component, OnInit } from '@angular/core';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { DomSanitizer } from '@angular/platform-browser';
import { startWith, map, Observable } from 'rxjs';



@Component({
  selector: 'app-update-entreprise',
  templateUrl: './update-entreprise.component.html',
  styleUrls: ['./update-entreprise.component.scss']
})
export class UpdateEntrepriseComponent implements OnInit {

  idEntreprise:any;
  entreprise:any;
  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;
  threeFormGroup:FormGroup;
  entrepriseFormError:any;
  onLoadForm:boolean=false;
  message:any;
  image:any;
  countries: any[];
  selectedImage: string;
  file:File;
  fileName:any;
  codeFiltres:Observable<any[]>;
  paysFiltres:Observable<any[]>;
  user:any;

  constructor(
    private entrepriseService:EntreprisesService,
    private route: ActivatedRoute,
    private router :Router,
    private _formBuilder:FormBuilder,
    private _snackBar:MatSnackBar,
    private countryService:CountriesService,
    private sanitizer :DomSanitizer
  ){
    this.route.params.subscribe((data:any)=>{
      this.idEntreprise = data.id
     });
     this.entrepriseFormError={
      societe:{},
      email:{},
      telephone:{},
      indicatif:{},
    };
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  champ_validation={
    email:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      },{
        type:"pattern",
        message:"Veuillez respecter le format email xxx@ccc.com"
      }
    ],
    telephone:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
    indicatif:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
  }
  ngOnInit(){
    this.getEntreprise();
    this.getContry();

    this.firstFormGroup=this._formBuilder.group({
      societe:['',Validators.required],
      commercial:['',null],
      siren:['',null],
      juridique:['',null],
      siret:['',null],
      tva:['',null],
      activite:['',null],
      type_entreprise:['',null],
      source:['',null],
      categorie_societe:['',null],
    });
    this.secondFormGroup=this._formBuilder.group({
      pays:['',null],
      rue:['',null],
      numero:['',null],
      postal:['',null],
      site:['',null],
      email:['',Validators.required],
      indicatif:['',Validators.required],
      telephone:['',Validators.required],
      genre:[''],
      nom:[''],
      prenom:['']
    });
    this.threeFormGroup=this._formBuilder.group({
      corps_act:['',null],
      corps_etat:['',null],
      fournisseur:['',null]
    });
    this.codeFiltres = this.secondFormGroup.get('indicatif').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterCode(val))
    );
    this.paysFiltres = this.secondFormGroup.get('pays').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterPays(val))
    );
  }

  filterCode(value:string){
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.dial_code.toLocaleLowerCase().includes(filtre));
  }

  filterPays(value:string){
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.name.toLocaleLowerCase().includes(filtre));
  }

  getEntreprise(){
    this.entrepriseService.getEntreprise(this.idEntreprise).subscribe((data:any)=>{
      this.entreprise=data.message;
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${data.message.photo}`);
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    )
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

  updateEntreprise():void{

    this.onLoadForm=true;
     const formData:FormData=new FormData();
     Object.assign(this.entreprise, this.firstFormGroup.value);
     Object.assign(this.entreprise, this.secondFormGroup.value);
     Object.assign(this.entreprise, this.threeFormGroup.value)

     formData.append("uploadfile",this.file);
     formData.append("societe", this.entreprise.societe);
     formData.append("numero", this.entreprise.numero);
     formData.append("genre", this.entreprise.genre);
     formData.append("nom", this.entreprise.nom);
     formData.append("type_entreprise", this.entreprise.type_entreprise);
     formData.append("source", this.entreprise.source);
     formData.append("categorie_societe", this.entreprise.categorie_societe);
     formData.append("prenom", this.entreprise.prenom);
     formData.append("commercial", this.entreprise.commercial);
     formData.append("siren", this.entreprise.siren);
     formData.append("siret", this.entreprise.siret);
     formData.append("juridique", this.entreprise.juridique);
     formData.append("tva", this.entreprise.tva);
     formData.append("activite", this.entreprise.activite);
     formData.append("pays", this.entreprise.pays);
     formData.append("adresse", this.entreprise.adresse);
     formData.append("ville",this.entreprise.ville);
     formData.append("rue", this.entreprise.rue);
     formData.append("postal", this.entreprise.postal);
     formData.append("site", this.entreprise.site);
     formData.append("email",this.entreprise.email);
     formData.append("indicatif", this.entreprise.indicatif);
     formData.append("telephone", this.entreprise.telephone);
     formData.append("representant",this.entreprise.representant);
     formData.append("corps_act", this.entreprise.corps_act);
     formData.append("corps_etat", this.entreprise.corps_etat);
     formData.append("fournisseur", this.entreprise.fournisseur);

     console.log("Entreprise", this.entreprise);
     console.log("formData", formData);

     this.entrepriseService.updateEntreprise(this.idEntreprise,formData).subscribe((res:any)=>{

       try {
            this.onLoadForm=false;
            this.message='Entreprise a été modifié avec succès';
            this.openSnackBar(this.message);
            this.router.navigate(["detail/entreprise",res.message._id]);
       } catch (error) {
           this.onLoadForm=false;
           this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
       }

     })
 }

  getDetail(idEntreprise){
    this.router.navigate(['detail/entreprise',idEntreprise]);
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

}
