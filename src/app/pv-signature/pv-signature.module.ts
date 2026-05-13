import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { SharedModule } from '../shared/shared.module';
import { PvSignatureComponent } from './pv-signature.component';
import { PvSignatureThankYouComponent } from './pv-signature-thank-you/pv-signature-thank-you.component';

const routes: Routes = [
  {
    path: ':id',
    component: PvSignatureComponent,
  },
  {
    path: ':id/merci',
    component: PvSignatureThankYouComponent,
  },
];


@NgModule({
  declarations: [PvSignatureComponent, PvSignatureThankYouComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    NavbarUserModule
  ],
  exports: [
    PvSignatureComponent,
    PvSignatureThankYouComponent
  ]
})
export class PvSignatureModule { }
