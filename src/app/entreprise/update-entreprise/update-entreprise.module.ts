import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateEntrepriseRoutingModule } from './update-entreprise-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
import { UpdateEntrepriseComponent } from './update-entreprise.component';
import { EntreprisesService } from '../../shared/services/entreprises.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NavbarUserModule } from 'src/app/navbar-user/navbar-user.module';


@NgModule({
  declarations: [UpdateEntrepriseComponent],
  imports: [
    CommonModule,
    UpdateEntrepriseRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarUserModule
  ],
  providers:[
    EntreprisesService,
    CountriesService,
    {
      provide : STEPPER_GLOBAL_OPTIONS,
      useValue:{showError:true},
    }
  ]
})
export class UpdateEntrepriseModule { }
