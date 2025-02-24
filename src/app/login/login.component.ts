import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
    private authService: AuthService
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

  }

  //redirect
  handleRedirectOnLogin(user){
    if(user.user.role!="user"){
      this.router.navigate(["dashboard"]);
    }else{
      this.router.navigate(["entreprise/dashboard"]);
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
