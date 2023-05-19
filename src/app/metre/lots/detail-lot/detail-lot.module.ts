import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailLotRoutingModule } from './detail-lot-routing.module';
import { DetailLotComponent } from './detail-lot.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';


@NgModule({
  declarations: [DetailLotComponent],
  imports: [
    CommonModule,
    DetailLotRoutingModule,
    SharedModule,
    NavbarModule
  ]
})
export class DetailLotModule { }
