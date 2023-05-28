import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppartementRoutingModule } from './appartement-routing.module';
import { AppartementComponent } from './appartement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';


@NgModule({
  declarations: [AppartementComponent],
  imports: [
    CommonModule,
    AppartementRoutingModule,
    SharedModule,
    NavbarModule
  ]
})
export class AppartementModule { }
