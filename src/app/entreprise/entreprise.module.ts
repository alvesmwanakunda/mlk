import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrepriseRoutingModule } from './entreprise-routing.module';
import { EntrepriseComponent } from './entreprise.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';


@NgModule({
  declarations: [EntrepriseComponent],
  imports: [
    CommonModule,
    EntrepriseRoutingModule,
    SharedModule,
    NavbarModule
  ]
})
export class EntrepriseModule { }
