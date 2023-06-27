import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateProjetRoutingModule } from './update-projet-routing.module';
import { UpdateProjetComponent } from './update-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';


@NgModule({
  declarations: [UpdateProjetComponent],
  imports: [
    CommonModule,
    UpdateProjetRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers:[
    ProjetsService,
    CountriesService,
    EntreprisesService,
    {
      provide : STEPPER_GLOBAL_OPTIONS,
      useValue:{showError:true},
    }
  ],
})
export class UpdateProjetModule { }
