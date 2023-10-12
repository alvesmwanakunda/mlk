import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  lostpasswordForm: FormGroup;
  submitted=false;
  formErrors:any;
  isMailLoading:boolean=false;
  passwordchangedok:boolean=false;
  accountnotfound:boolean=false;
  signupFormErrors:any;
  onLoadForm:boolean=false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.signupFormErrors={
      email:{},
    }
  }

  validation={
    email:[
      {
        type:"required",
        message:"Champ E-mail est obligatoire"
      },
      {
        type:"pattern",
        message:"Veuillez respecter le format email"
      }
    ]
  };

  onFormValuesChanged(){
    for (const field in this.signupFormErrors){
      if(!this.signupFormErrors.hasOwnProperty(field)){
        continue;
      }
      this.signupFormErrors[field]={};
      const control = this.lostpasswordForm.get(field);
      if(control && control.dirty && !control.valid){
        this.lostpasswordForm[field] = control.errors;
      }
    }
  }


  ngOnInit(): void {

    this.lostpasswordForm = new FormGroup({
      email: new FormControl("",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    });
  }

  onLostPassword(){

    this.isMailLoading = true;
    this.submitted=true;
    this.onLoadForm=true;
    this.authService.lostPassword(this.lostpasswordForm.value)
         .then(res => {
           console.log("Response ", res);
           if(!res.success){
            this.isMailLoading = false;
            this.accountnotfound = true;
            this.onLoadForm=false;
           } else{
             let emailregex = RegExp(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
             );
             let email = this.lostpasswordForm.get("email").value;
             if(!emailregex.test(email)){
                this.isMailLoading = false;
                this.accountnotfound = false;
                this.onLoadForm=false;
             }else{
               this.isMailLoading = false;
               this.passwordchangedok = true;
               this.accountnotfound = false;
               this.onLoadForm=false;
             }
           }
         })
         .catch(err=>{
           console.log("Error", err);
         })
  }

}
