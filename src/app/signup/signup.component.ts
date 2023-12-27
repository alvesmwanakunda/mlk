import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from "ng2-validation";
import { startWith, map, Observable } from 'rxjs';
import { CountriesService } from 'src/app/shared/services/countries.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  hideP = true;
  hidePassword = true;
  cgu:boolean=false;
  onLoadForm:boolean=false;
  isForm:boolean=false;
  signupForm: FormGroup;
  submitted = false;
  signupFormErrors:any;
  errorMessage: string="";
  user:any;
  emailExists: boolean;
  indicatifControl = new FormControl();
  codeFiltres:Observable<any[]>;
  paysFiltres:Observable<any[]>;
  countries:any=[];
  indicatifs:any=[];
  isEntr:boolean=false;
  message:any;
  pays="France";
  code="+33"


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private countryService: CountriesService,
  ) {
    this.signupFormErrors={
      nom:{},
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
    confirmpassword: [
      { type: "required", message: "Vous devez confirmer le mot de passe" },
      { type: "minlength", message: "Mot de passe incorrect." },
    ],
    password: [
      { type: "required", message: "Le mot de passe est obligatoire"},
      { type: "minlength", message: "Mot de passe incorrect."},
      {
        type: "pattern",
        message:
          "Votre mot de passe doit contenir 8 caractères minimum",
      },
    ],
    terms: [
      {
        type: "pattern",
        message: "Lire et accepter la déclaration de confidentialité. .",
      },
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

  ngOnInit(): void {

    this.isForm = false;
    this.errorMessage="";
    this.getContry();

    let password = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?![#?!@$%^&*-]).{8,}$"
      ),
    ]);
    let confirmpassword = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.equalTo(password),
    ]);

    this.signupForm = new FormGroup({
      email: new FormControl("",[
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),
      nom:new FormControl("",[Validators.required]),
      societe:new FormControl("",[Validators.required]),
      company:new FormControl("",[Validators.required]),
      prenom:new FormControl("",[Validators.required]),
      genre:new FormControl("",[Validators.required]),
      siret:new FormControl("",null),
      rue:new FormControl("",[Validators.required]),
      adresse:new FormControl("",[Validators.required]),
      postal:new FormControl("",[Validators.required]),
      numero:new FormControl("",null),
      pays:new FormControl("",[Validators.required]),
      indicatif:new FormControl("",[Validators.required]),
      telephone:new FormControl("",[Validators.required, Validators.pattern("[0-9 ]{9}")]),
      //password:password,
      //confirmpassword: confirmpassword,
      cgu: new FormControl("", [CustomValidators.equal(true)])
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
    const filtre = value.toLowerCase();
    return this.countries.filter(option=> option.name.toLocaleLowerCase().includes(filtre));
  }

  checkEmail(){
    const email = this.signupForm.get('email').value;
    this.authService.checkEmail(email).subscribe((response:{exists:boolean})=>{
      this.emailExists = response.exists;
    })
  }


  onRegisterUser():void{
    this.onLoadForm = true;
    this.submitted = true;
    this.user = {};
    let login= {};
    console.log("Form", this.signupForm);
    if(!this.signupForm.invalid){
        Object.assign(this.user, this.signupForm.value);
        /*login={
              email:this.signupForm.get("email").value,
              password:this.signupForm.get("password").value
        }*/
        this.authService.signup(this.user).subscribe((res:any)=>{
        console.log("Response", res);
        if(!res.success){
          this.signupFormErrors["email"].found = true;

        }else{
            this.isForm=true;
            let login={
              email : res?.message?.email,
              password : res?.signature,
            };
            this.onLogin(login);
        }
        this.onLoadForm = false;
      });
    }else{
      this.onLoadForm=false;
    }
  }

  onLogin(login):void{

    this.authService.signin(login).then((res:any)=>{
      this.authService.setUser(res.message)
      if(res){
        this.router.navigate(["mlka"]);
      }
    }).catch((err)=>{
      console.log("Erreur login", err);
    })
  }

  getContry(){
    this.countryService.getCountries().subscribe(
      (data)=>{
        this.countries = data;
        this.indicatifs = data;
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  isEntreprise() {
    if (!this.isEntr) {
      const nomenControl = this.signupForm.get('nomen');
      const emailenControl = this.signupForm.get('emailen');
      const representantControl = this.signupForm.get('representant');
      const activiteControl = this.signupForm.get('activite');
      const indicatifControl = this.signupForm.get('indicatif');
      const telephoneControl = this.signupForm.get('telephone');

      if (
        nomenControl.invalid ||
        emailenControl.invalid ||
        representantControl.invalid ||
        activiteControl.invalid ||
        indicatifControl.invalid ||
        telephoneControl.invalid
      ) {
        this.message = "Veuillez remplir tous les champs obligatoires";
      } else {
        this.isEntr = true;
        this.message = "";
      }
    } else {
      this.isEntr = false;
      this.message = "";
    }
  }


}
