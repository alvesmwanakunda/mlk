import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from "ng2-validation";
import { startWith, map, Observable } from 'rxjs';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { SearchEntrepriseComponent } from '../search-entreprise/search-entreprise.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-entreprise',
  templateUrl: './add-entreprise.component.html',
  styleUrls: ['./add-entreprise.component.scss'],
})
export class AddEntrepriseComponent implements OnInit {

  onLoadForm:boolean=false;
  isForm:boolean=false;
  signupForm: FormGroup;
  submitted = false;
  signupFormErrors:any;
  errorMessage: string="";
  user:any;
  societeExists: boolean;
  indicatifControl = new FormControl();
  codeFiltres:Observable<any[]>;
  paysFiltres:Observable<any[]>;
  countries:any=[];
  indicatifs:any=[];
  isEntr:boolean=false;
  message:any;
  pays="France";
  code="+33"
  searchObject={
    societe:"",
    siret:"",
    siren:"",
    rue:"",
    postal:"",
    numero:""
  }


  constructor(
    private _formBuilder:FormBuilder,
    private _snackBar:MatSnackBar,
    private countryService:CountriesService,
    private router: Router,
    private authService: AuthService,
    private entrepriseService: EntreprisesService,
    public dialog: MatDialog
  ){
    this.signupFormErrors={
      email:{},
    };
  }

  account_validation={
    email:[
      {
        type: "required",
        message: "Adresse E-mail est obligatoire",
      },{
        type:"pattern",
        message: "Veuillez respecter le format email.",
      }
    ],
    input:[
      {
        type:"required",
        message:"Veuillez indiquer ce champ"
      }
    ],
    telephone:[
      {
        type:"required",
        message:"Veuillez indiquer votre téléphone"
      },
      {
        type:"pattern",
        message:"Numéro de téléphone incorrect"
      }
    ],
  };

  onFormValuesChanged(){
    for (const field in this.signupFormErrors){
      if(!this.signupFormErrors.hasOwnProperty(field)){
        continue;
      }
      this.signupFormErrors[field]={};
      const control = this.signupForm.get(field);
      if(control && control.dirty && !control.valid){
        this.signupForm[field] = control.errors;
      }
    }
  }

  ngOnInit(){
    this.isForm = false;
    this.errorMessage="";
    this.getContry();

    this.signupForm = new FormGroup({

      /*email: new FormControl("",[Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),*/
      email:new FormControl("",null),
      societe:new FormControl("",[Validators.required]),
      company:new FormControl("",[Validators.required]),
      siret:new FormControl("",null),
      siren:new FormControl("",null),
      type_entreprise:new FormControl("",null),
      source:new FormControl("",null),
      categorie_societe:new FormControl("",null),
      rue:new FormControl("",[Validators.required]),
      postal:new FormControl("",[Validators.required]),
      numero:new FormControl("",null),
      pays:new FormControl("",[Validators.required]),
      indicatif:new FormControl("",[Validators.required]),
      telephone:new FormControl("",null),
      //telephone:new FormControl("",[Validators.required, Validators.pattern("[0-9 ]{9}")]),

    });
    this.codeFiltres = this.signupForm.get('indicatif').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterCode(val))
    );
    this.paysFiltres = this.signupForm.get('pays').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterPays(val))
    );
  }

  filterCode(value:string){
    const filtre = value.toLowerCase();
    return this.indicatifs.filter(option=> option.dial_code.toLocaleLowerCase().includes(filtre));
  }

  filterPays(value:string){
    let filterPays = this.countries.find(element => element.name == value);
    if(filterPays != undefined){
       console.log("pays filter", filterPays);
       this.code=filterPays.dial_code;
    }
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.name.toLocaleLowerCase().includes(filtre));
  }


  checkSociete(){
    const societe = this.signupForm.get('societe').value;
    this.entrepriseService.checkSociete(societe).subscribe((response:{exists:boolean})=>{
      this.societeExists = response.exists;
    })
  }

  openDialogSearch(){
    const dialogRef = this.dialog.open(SearchEntrepriseComponent,{width:'60%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.searchObject = result;
        if(this.searchObject){
          this.entrepriseService.checkSociete(this.searchObject?.societe).subscribe((response:{exists:boolean})=>{
            this.societeExists = response.exists;
          })
        }
        //console.log("searchObject",this.searchObject);
       }
    })
  }

  addEntreprise():void{
    this.onLoadForm = true;
    this.submitted = true;
    this.user = {};
    let login= {};
    console.log("Form", this.signupForm);
    if(!this.signupForm.invalid){
        Object.assign(this.user, this.signupForm.value);
        this.entrepriseService.newAddEntreprise(this.user).subscribe((res:any)=>{
        console.log("Response", res);
        if(!res.success){
          this.signupFormErrors["email"].found = true;
          this.message="Une erreur s'est produite veuillez réessayer.";
          this.openSnackBar(this.message);
        }else{
            this.isForm=true;
            this.message='Entreprise a été ajouté avec succès';
            this.openSnackBar(this.message);
            this.router.navigate(["detail/entreprise",res.entreprise._id]);
        }
        this.onLoadForm = false;
      });
    }else{
      this.onLoadForm=false;
    }
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
        this.indicatifs = data;
        console.log("countries", this.countries);
      },
      (error)=>{
        console.log(error);
      }
    )
  }

}
