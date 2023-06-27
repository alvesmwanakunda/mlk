import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrepriseRoutingModule } from './entreprise-routing.module';
import { EntrepriseComponent } from './entreprise.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { TabEntrepriseModule } from './tab-entreprise/tab-entreprise.module';



@NgModule({
  declarations: [EntrepriseComponent],
  imports: [
    CommonModule,
    EntrepriseRoutingModule,
    SharedModule,
    NavbarModule,
    TabEntrepriseModule
  ],
  providers:[EntreprisesService]
})
export class EntrepriseModule { }
