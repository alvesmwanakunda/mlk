import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateUserProjetComponent } from './update-user-projet.component';
import { UpdateUserProjetRoutingModule } from './update-user-projet-routing.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [UpdateUserProjetComponent],
  imports: [
    CommonModule,
    UpdateUserProjetRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers:[
    ProjetsService,
    CountriesService,
    {
      provide : STEPPER_GLOBAL_OPTIONS,
      useValue:{showError:true},
    }
  ],
})
export class UpdateUserProjetModule { }
