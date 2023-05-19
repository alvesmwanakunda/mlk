import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProjetRoutingModule } from './add-projet-routing.module';
import { AddProjetComponent } from './add-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';


@NgModule({
  declarations: [AddProjetComponent],
  imports: [
    CommonModule,
    AddProjetRoutingModule,
    SharedModule,
    NavbarModule
  ]
})
export class AddProjetModule { }
