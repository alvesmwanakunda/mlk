import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

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

    const googleIdentity = (window as any).google?.accounts?.id;
    if (environment.GOOGLE_CLIENT_ID && googleIdentity) {
      googleIdentity.initialize({
        client_id: environment.GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
        // use_fedcm_for_button: true,
        ux_mode: "popup",
      });
      googleIdentity.renderButton(
        document.getElementById("google-button"),
        { theme: "outline", size: "large", width: "100%", type:"icon", shape: "circle",         // ou "rectangular", "circle"
          logo_alignment: "center",
          locale: "fr"        }
      );
      googleIdentity.prompt((notification: any) => {});
    }
  }

  handleCredentialResponse(response: any) {
    this.onLoadForm=true;
    this.authService.googleLogin(response.credential).subscribe((res:any)=>{
      if(!res.success){
        this.openSnackBarError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      }else{
        this.handleRedirectAndUserSet(res.message);
      }
      this.onLoadForm=false;
    },(err)=>{
      this.onLoadForm=false;
      if(err.status==404){
        this.openSnackBar("Vous n'avez pas de compte chez MLKA avec cette adresse e-mail.");
      }else{
        this.openSnackBarError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      }
      console.log("Erreur Google login", err);
    });
  }

  signInWithLinkedin() {
    localStorage.setItem("btn", "linkedin");
    const clientId = environment.LINKEDIN_CLIENT_ID;
    const redirectUri = `${environment.BASE_URL}/login`;
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
        this.openSnackBarError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      }else{
        this.handleRedirectAndUserSet(res.message);
      }
      this.onLoadForm=false;
    },(err)=>{
      this.onLoadForm=false;
      if(err.status==404){
        this.openSnackBar("Vous n'avez pas de compte chez MLKA avec cette adresse e-mail.");
      }else{
        this.openSnackBarError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      }
      console.log("Erreur LinkedIn login", err);
    });
  }


  //redirect
  handleRedirectAndUserSet(userInfos: any){
    if (userInfos.user.twoFactorEnabled){
      localStorage.setItem("verification", "true");//pour le guard de la page verification
      this.router.navigate(["verification", userInfos.user._id], {queryParams: {type: userInfos.user.twoFactorType}});
    }else{
      this.authService.setUser(userInfos);
      if(userInfos.user.role!="user"){
        this.router.navigate(["dashboard"]);
      }else{
        this.router.navigate(["modulaires"]);
      }
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
      //console.log("res", res);
      if(!res.success){
          this.loginFormErrors["email"].notfound=true;
      }else{
        this.handleRedirectAndUserSet(res.message);
      }
      this.onLoadForm=false;
    }).catch((err)=>{
      this.onLoadForm=false;
      console.log("Erreur login", err);
    })
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
