import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEntrepriseRoutingModule } from './add-entreprise-routing.module';
import { AddEntrepriseComponent } from './add-entreprise.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';


@NgModule({
  declarations: [AddEntrepriseComponent],
  imports: [
    CommonModule,
    AddEntrepriseRoutingModule,
    SharedModule,
    NavbarModule
  ]
})
export class AddEntrepriseModule { }
