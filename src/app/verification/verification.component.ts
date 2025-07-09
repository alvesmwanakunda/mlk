import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  onLoad: boolean = false;
  otpForm: FormGroup;
  errorMessage: string = '';
  otpControls = Array(6).fill(0);
  type: string;
  user_id: string;
  
  @ViewChildren('otpInput') otpInputs: QueryList<ElementRef>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.otpForm = this.fb.group({
      otp0: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });
    this.type = this.route.snapshot.queryParamMap.get('type');
    this.user_id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    localStorage.removeItem("verification");
    setTimeout(() => {
      if (this.otpInputs && this.otpInputs.first) {
        this.otpInputs.first.nativeElement.focus();
      }
    }, 0);
  }

  autoFocusNext(event: any, index: number) {
    const value = event.target.value;
    if (value.length === 1 && index < 5) {
      const next = this.otpInputs.toArray()[index + 1];
      if (next) {
        next.nativeElement.focus();
      }
    } else if (value.length === 0 && index > 0 && event.inputType === 'deleteContentBackward') {
      const prev = this.otpInputs.toArray()[index - 1];
      if (prev) {
        prev.nativeElement.focus();
      }
    }
  }

  handleRedirectAndUserSet(userInfos: any){
    this.authService.setUser(userInfos);
    if(userInfos.user.role!="user"){
      this.router.navigate(["dashboard"]);
    }else{
      this.router.navigate(["modulaires"]);
    }
  }

  onSubmit() {
    if (this.otpForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
    this.errorMessage = '';
    this.onLoad = true;
    const otpCode = Object.values(this.otpForm.value).join('');
    this.authService.verifyA2FAuthentication({user_id: this.user_id, code: otpCode, type: this.type}).subscribe((res: any) => {
      this.onLoad = false;
      if(res.success){
        this.handleRedirectAndUserSet(res.message);
      }else{
        this.errorMessage = 'Code incorrect. Veuillez réessayer.';
      }
    }, (error: any) => {
      this.onLoad = false;
      console.log(error);
      this.errorMessage = 'Code incorrect. Veuillez réessayer.';
    });
    
  }

  resendCode(event: Event) {
    event.preventDefault();
    this.authService.resendAuthenticationCode(this.user_id).subscribe((res: any) => {
      if(res.success){
        this.openSnackBar("Un nouveau code de vérification vous a été envoyé par mail.");
      }else{
        this.openSnackBarError("Une erreur est survenue lors de l'envoi du code de vérification.");
      }
    }, (error: any) => {
      console.log(error);
      this.openSnackBarError("Une erreur est survenue lors de l'envoi du code de vérification.");
    });
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
