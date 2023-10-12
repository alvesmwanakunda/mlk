import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  changepasswordForm: FormGroup;
  submitted = false;
  isMailLoading=false;
  formErrors: any;
  hide = true;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.formErrors={
      password:{}
    };
  }
  code: string;
  email:string;
  changepassword = false;
  passwordchanged = false;
  passwordchangederror = false;

  validation = {
    confirmpassword: [
      { type: "required", message: "Vous devez confirmer le mot de passe" },
      { type: "minlength", message: "Mot de passe incorrect." }
    ],
    password: [
      { type: "required", message: "Le mot de passe est obligatoire" },
      { type: "minlength", message: "Mot de passe incorrect. " },
      {
        type: "pattern",
        message:
          "Le mot de passe doit comporter au moins 8 caracteres et doit comporter au moins une lettre majuscule, une lettre minuscule et un chiffre"
      }
    ]
  };

  onFormValuesChanged() {
    for (const field in this.formErrors) {
      // console.log(field);
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.formErrors[field] = {};

      // Get the contro
      const control = this.changepasswordForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.changepasswordForm[field] = control.errors;
      }
    }
  }


  ngOnInit(): void {

    this.code = this.route.snapshot.queryParams.token;
    this.email = this.route.snapshot.queryParams.email;

    console.log("Code", this.code);
    console.log("Email", this.email);

    let password = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?![#?!@$%^&*-]).{8,}$")
    ]);
    let confirmpassword = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.equalTo(password)
    ]);

    this.changepasswordForm = this.formBuilder.group({
      password: password,
      confirmpassword: confirmpassword
    });

  }

  onChangePassword(){
    this.submitted = true;
    this.isMailLoading = true;
    let query = {code:this.code,email:this.email};
    Object.assign(query, this.changepasswordForm.value);

    this.authService.resetPassword(query)
        .then(res => {
          console.log("Res", res);
          if(!res.success){
            this.passwordchangederror = true;
            this.isMailLoading = false;
          }else{
            this.passwordchanged = true;
            this.isMailLoading = false;
          }
        })
        .catch(err =>{
          console.log("Erreur", err);
        });
  }

}
