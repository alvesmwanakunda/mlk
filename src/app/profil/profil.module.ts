import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from './profil.component';
import { ProfilRoutingModule } from './profil-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';


@NgModule({
  declarations: [ProfilComponent],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    SharedModule,
    NavbarModule,
    NavbarUserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[AuthService]
})
export class ProfilModule { }
