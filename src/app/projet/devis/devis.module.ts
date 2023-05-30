import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevisRoutingModule } from './devis-routing.module';
import { DevisComponent } from './devis.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';


@NgModule({
  declarations: [DevisComponent],
  imports: [
    CommonModule,
    DevisRoutingModule,
    SharedModule,
    NavbarModule
  ]
})
export class DevisModule { }
