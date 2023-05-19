import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetreRoutingModule } from './metre-routing.module';
import { MetreComponent } from './metre.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { LotsModule } from './lots/lots.module';
import { BatimentModule } from './batiment/batiment.module';


@NgModule({
  declarations: [MetreComponent],
  imports: [
    CommonModule,
    MetreRoutingModule,
    SharedModule,
    NavbarModule,
    LotsModule,
    BatimentModule
  ]
})
export class MetreModule { }
