import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from "ng2-validation";
import { startWith, map, Observable } from 'rxjs';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';



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
  emailExists: boolean = false;
  societeExists: boolean;
  indicatifControl = new FormControl();
  codeFiltres:Observable<any[]>;
  paysFiltres:Observable<any[]>;
  countries:any=[];
  indicatifs:any=[];
  isEntr:boolean=false;
  message:any;
  pays="France";
  code="+33";

  isEnterprise = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private countryService: CountriesService,
    private entrepriseService: EntreprisesService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
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
          "Votre mot de passe doit contenir 8 caractères minimum : une majuscule, une miniscule, un chiffre",
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
    if(this.route.snapshot.queryParamMap.get('error')){
      this.router.navigate(["/signup"]);
    }
    // LinkedIn
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    var btn = localStorage.getItem("btnSignup");
    if(code && state && state == "mlka-2025" && btn == "linkedin"){
      localStorage.removeItem("btnSignup");
      this.handleLinkedInSignup(code);
    }

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
      // company:new FormControl("",[Validators.required]),
      prenom:new FormControl("",[Validators.required]),
      genre:new FormControl("",[Validators.required]),
      siret:new FormControl("",null),
      rue:new FormControl("",[Validators.required]),
      //adresse:new FormControl("",[Validators.required]),
      postal:new FormControl("",[Validators.required]),
      numero:new FormControl("",null),
      pays:new FormControl("",[Validators.required]),
      indicatif:new FormControl("",[Validators.required]),
      telephone:new FormControl("",[Validators.required, Validators.pattern("[0-9 ]{9}")]),
      password:password,
      confirmpassword: confirmpassword,
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

    document.getElementsByName("typeCompte").forEach(input => {
      input.addEventListener('click',(e)=>{

        if(input.getAttribute("value")=="entreprise"){
          this.isEnterprise = true;
          this.resetFormCommonField();
          this.signupForm.get("societe").setValidators(Validators.required);
          this.signupForm.get("societe").updateValueAndValidity();
        }else{
          // @ts-ignore
          google.accounts.id.initialize({
            client_id: environment.GOOGLE_CLIENT_ID,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
            ux_mode: "popup",
            context:"signup",
            // login_uri: environment.BASE_URL + "/signup"

          });
          // @ts-ignore
          google.accounts.id.renderButton(
            document.getElementById("google-button-signup"),
            { theme: "outline", size: "large", width: "100%", type:"icon", shape: "circle",         // ou "rectangular", "circle"
              logo_alignment: "center",
              locale: "fr" }
          );
          // @ts-ignore
          google.accounts.id.prompt((notification: PromptMomentNotification) => {});

          this.isEnterprise = false;
          this.resetFormCommonField();
          this.signupForm.get("societe").setValidators([]);
          this.signupForm.get("societe").updateValueAndValidity();
        }
      });
    });

  }

  handleCredentialResponse(response: any) {
    this.onLoadForm=true;
    if(!this.isEnterprise){
      this.authService.googleSignupParticulier(response.credential).subscribe((res:any)=>{
        if(!res.success){
          if(res.message !="already exists"){
            this.openSnackBarError("Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.");
          }else{

            this.openSnackBar("Vous avez déjà un compte avec cette adresse e-mail. Veuillez vous connecter.");

          }
        }else{
          localStorage.setItem("newParticulier","1");
          this.router.navigate(["mlka-home"]);
        }
        this.onLoadForm = false;
      },(err)=>{
        this.onLoadForm=false;
        this.openSnackBarError("Une erreur est survenue. Veuillez réessayer.");
        console.log("Erreur signup", err);
      });
    }
  }

  signUpWithLinkedin() {
    localStorage.setItem("btnSignup", "linkedin");
    const clientId = environment.LINKEDIN_CLIENT_ID;
    const redirectUri = 'http://localhost:4200/signup';
    const state = 'mlka-2025'; // Pour sécurité CSRF
    const scope = 'openid profile email';

    const authUrl = encodeURI(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`);

    window.location.href = authUrl;
  }

  handleLinkedInSignup(code:string) {
    this.onLoadForm=true;
    this.authService.linkedInSignupParticulier(code).subscribe((res:any)=>{
      this.onLoadForm = false;
      if(!res.success){
        if(res.message !="already exists"){
          this.openSnackBarError("Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.");
        }else{

          this.openSnackBar("Vous avez déjà un compte avec cette adresse e-mail. Veuillez vous connecter.")
        }
      }else{
        localStorage.setItem("newParticulier","1");
        this.router.navigate(["mlka-home"]);
      }
    },(err)=>{
      this.onLoadForm=false;
      this.openSnackBarError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      console.log("Erreur signup", err);
    });
  }

  resetFormCommonField(){
    this.signupForm.get("email").reset();
    this.signupForm.get("nom").reset();
    this.signupForm.get("societe").reset();
    this.signupForm.get("prenom").reset();
    this.signupForm.get("genre").reset();
    this.signupForm.get("siret").reset();
    this.signupForm.get("rue").reset();
    this.signupForm.get("postal").reset();
    this.signupForm.get("numero").reset();
    this.signupForm.get("telephone").reset();
    this.signupForm.get("password").reset();
    this.signupForm.get("confirmpassword").reset();
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

  checkSociete(){
    const societe = this.signupForm.get('societe').value;
    this.entrepriseService.checkSociete(societe).subscribe((response:{exists:boolean})=>{
      this.societeExists = response.exists;
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
      if(this.isEnterprise){
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
        this.authService.signupParticulier(this.user).subscribe((res:any)=>{
          console.log("Response", res);
          if(!res.success){
            this.signupFormErrors["email"].found = true;
          }else{
            this.isForm=true;
            localStorage.setItem("newParticulier","1");
            this.router.navigate(["mlka-home"]);
          }
          this.onLoadForm = false;
        });
      }
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

    openSnackBar(message){
    this.snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  openSnackBarError(message){
    this.snackBar.open(message, 'Fermer',{
      duration:6000,
      panelClass:['error-snackbar']
    })
  }




}
