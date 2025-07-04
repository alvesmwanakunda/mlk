import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  onLoadForm:boolean=false;
  testValidation:boolean=false;
  loginForm:FormGroup;
  loginFormErrors:any;
  hideP:boolean=true;

  password=new FormControl("",[Validators.required, Validators.minLength(10)]);
  email=new FormControl("",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);

  account_validation_messages={
    email:[
      {
        type:"required",
        message:"Email est obligatoire."
      },
      {
       type:"pattern",
       message:"Email est incorrect. Veuillez ressayer à nouveau."
      }
    ]
  }


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ){
    this.loginFormErrors={
      email:{},
      password:{}
     };
  }

  ngOnInit() {

    this.loginForm=this.formBuilder.group({
      email:this.email,
      password:this.password
    });
    this.loginForm.valueChanges.subscribe(()=>{
       this.onLoginFormValuesChanged();
    })

    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    var btn = localStorage.getItem("btn");
    if(code && state && state == "mlka-2025" && btn == "linkedin"){
      localStorage.removeItem("btn");
      this.handleLinkedInLogin(code);
    }

    // @ts-ignore
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
      // use_fedcm_for_button: true,
      ux_mode: "popup",
    });
    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById("google-button"),
      { theme: "outline", size: "large", width: "100%", type:"icon", shape: "circle",         // ou "rectangular", "circle"
        logo_alignment: "center",
        locale: "fr"        }
    );
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {});
  }
  
  handleCredentialResponse(response: any) {
    this.onLoadForm=true;
    this.authService.googleLogin(response.credential).subscribe((res:any)=>{
      if(!res.success){
        this.snackBar.open("Une erreur est survenue lors de la connexion. Veuillez réessayer.", "Fermer", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
      }else{
        this.handleRedirectOnLogin(res.message);
        this.authService.setUser(res.message)
      }
      this.onLoadForm=false;
    },(err)=>{
      this.onLoadForm=false;
      if(err.status==404){  
        this.snackBar.open("Vous n'avez pas de compte chez MLKA avec cette adresse e-mail.", "Fermer", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
      }else{
        this.snackBar.open("Une erreur est survenue lors de la connexion. Veuillez réessayer.", "Fermer", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
      }
      console.log("Erreur Google login", err);
    });
  }

  signInWithLinkedin() {
    localStorage.setItem("btn", "linkedin");
    const clientId = environment.LINKEDIN_CLIENT_ID;
    const redirectUri = 'http://localhost:4200/login';
    const state = 'mlka-2025'; // Pour sécurité CSRF
    const scope = 'openid profile email';

    // const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    const authUrl = encodeURI(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`);

    window.location.href = authUrl;
  }


  handleLinkedInLogin(code:string){
    this.onLoadForm=true;
    this.authService.linkedInLogin(code).subscribe((res:any)=>{
      console.log("res", res);
      if(!res.success){
        this.snackBar.open("Une erreur est survenue lors de la connexion. Veuillez réessayer.", "Fermer", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
      }else{
        this.handleRedirectOnLogin(res.message);
        this.authService.setUser(res.message)
      }
      this.onLoadForm=false;
    },(err)=>{
      this.onLoadForm=false;
      if(err.status==404){  
        this.snackBar.open("Vous n'avez pas de compte chez MLKA avec cette adresse e-mail.", "Fermer", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
      }else{
        this.snackBar.open("Une erreur est survenue lors de la connexion. Veuillez réessayer.", "Fermer", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
      }
      console.log("Erreur LinkedIn login", err);
    });
  }

  
  //redirect
  handleRedirectOnLogin(user){
    if(user.user.role!="user"){
      this.router.navigate(["dashboard"]);
    }else{
      this.router.navigate(["modulaires"]);
    }
  }

  onLoginFormValuesChanged() {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }
      // Clear previous errors
      this.loginFormErrors[field] = {};
      // Get the contro
      const control = this.loginForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }

  onLogin():void{
    this.onLoadForm=true;
    if(this.password.value=="" || this.email.value==""){
      this.testValidation=true;
      this.onLoadForm=false;
      return;
    }
    this.testValidation=false;
    this.loginFormErrors["email"].notfound=false;
    this.authService.signin(this.loginForm.value).then((res:any)=>{
      if(!res.success){
          this.loginFormErrors["email"].notfound=true;
      }else{
         console.log("User", res);
         this.handleRedirectOnLogin(res.message);
         this.authService.setUser(res.message)
      }
      this.onLoadForm=false;
    }).catch((err)=>{
      this.onLoadForm=false;
      console.log("Erreur login", err);
    })
  }

  
}

