import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProjetRoutingModule } from './add-projet-routing.module';
import { AddProjetComponent } from './add-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';


@NgModule({
  declarations: [AddProjetComponent],
  imports: [
    CommonModule,
    AddProjetRoutingModule,
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
export class AddProjetModule { }
