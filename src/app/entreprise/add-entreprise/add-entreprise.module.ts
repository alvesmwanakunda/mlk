import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEntrepriseRoutingModule } from './add-entreprise-routing.module';
import { AddEntrepriseComponent } from './add-entreprise.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntreprisesService } from '../../shared/services/entreprises.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { SearchEntrepriseModule } from '../search-entreprise/search-entreprise.module';




@NgModule({
  declarations: [AddEntrepriseComponent],
  imports: [
    CommonModule,
    AddEntrepriseRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    SearchEntrepriseModule
  ],
  providers:[
    EntreprisesService,
    CountriesService,
    {
      provide : STEPPER_GLOBAL_OPTIONS,
      useValue:{showError:true},
    }
  ],

})
export class AddEntrepriseModule { }
