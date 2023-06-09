import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EntreprisesService } from '../../shared/services/entreprises.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { Router } from '@angular/router';
import { startWith, map, Observable } from 'rxjs';

@Component({
  selector: 'app-add-entreprise',
  templateUrl: './add-entreprise.component.html',
  styleUrls: ['./add-entreprise.component.scss'],
})
export class AddEntrepriseComponent implements OnInit {

  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;
  threeFormGroup:FormGroup;
  myPaysControl = new FormControl();
  indicatifControl = new FormControl();
  filteredOptions:string[]=[];
  fileName:any;
  file:File;
  entrepriseFormError:any;
  onLoadForm:boolean=false;
  form1:any;
  form2:any;
  form3:any;
  message:any;
  countries: any=[];
  selectedImage: string;
  codeFiltres:Observable<any[]>;
  paysFiltres:Observable<any[]>


  constructor(
    private _formBuilder:FormBuilder,
    private entrepriseService:EntreprisesService,
    private _snackBar:MatSnackBar,
    private countryService:CountriesService,
    private router: Router,
  ){
    this.entrepriseFormError={
      nom:{},
      email:{},
      telephone:{},
      indicatif:{},
    };
  }
  champ_validation={
    nom:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
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
    representant:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
  }
  ngOnInit(){
    this.firstFormGroup=this._formBuilder.group({
      nom:['',Validators.required],
      commercial:[''],
      siren:[''],
      juridique:[''],
      siret:[''],
      tva:[''],
      activite:['']
    });
    this.secondFormGroup=this._formBuilder.group({
      pays:[''],
      adresse:[''],
      ville:[''],
      rue:[''],
      postal:[''],
      site:[''],
      email:['',Validators.required],
      indicatif:['',Validators.required],
      telephone:['',Validators.required],
      representant:['',Validators.required]
    });
    this.threeFormGroup=this._formBuilder.group({
      corps_act:[''],
      corps_etat:[''],
      fournisseur:['']
    });
    this.codeFiltres = this.secondFormGroup.get('indicatif').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterCode(val))
    );
    this.paysFiltres = this.secondFormGroup.get('pays').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterPays(val))
    );
    this.getContry();
  }

  filterCode(value:string){
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.dial_code.toLocaleLowerCase().includes(filtre));
  }

  filterPays(value:string){
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.name.toLocaleLowerCase().includes(filtre));
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

  addEntreprise():void{

     this.onLoadForm=true;

      this.form1={};
      this.form2={};
      this.form3={};
      const formData:FormData=new FormData();
      Object.assign(this.form1, this.firstFormGroup.value);
      Object.assign(this.form2, this.secondFormGroup.value);
      Object.assign(this.form3, this.threeFormGroup.value)

      formData.append("uploadfile", this.file);
      formData.append("nom", this.form1.nom);
      formData.append("commercial", this.form1.commercial);
      formData.append("siren", this.form1.siren);
      formData.append("siret", this.form1.siret);
      formData.append("juridique", this.form1.juridique);
      formData.append("tva", this.form1.tva);
      formData.append("activite", this.form1.activite);
      formData.append("pays", this.form2.pays);
      formData.append("adresse", this.form2.adresse);
      formData.append("ville", this.form2.ville);
      formData.append("rue", this.form2.rue);
      formData.append("postal", this.form2.postal);
      formData.append("site", this.form2.site);
      formData.append("email", this.form2.email);
      formData.append("indicatif", this.form2.indicatif);
      formData.append("telephone", this.form2.telephone);
      formData.append("representant", this.form2.representant);
      formData.append("corps_act", this.form3.corps_act);
      formData.append("corps_etat", this.form3.corps_etat);
      formData.append("fournisseur", this.form3.fournisseur);

      this.entrepriseService.addEntreprise(formData).subscribe((res:any)=>{

        try {
             this.onLoadForm=false;
             this.message='Entreprise a été ajouté avec succès';
             this.openSnackBar(this.message);
             this.router.navigate(["detail/entreprise",res.message._id]);
        } catch (error) {
            this.onLoadForm=false;
            this.message="Une erreur s'est produite veuillez réessayer.";
            this.openSnackBar(this.message);
        }

      })
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
