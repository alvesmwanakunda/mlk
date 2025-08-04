import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TachesRoutingModule } from './taches-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TachesService } from '../shared/services/taches.service';
import { TachesComponent } from './taches.component';
import { AddTachesModule } from './add-taches/add-taches.module';
import { UpdateTachesModule } from './update-taches/update-taches.module';



@NgModule({
  declarations: [TachesComponent],
  imports: [
    CommonModule,
    TachesRoutingModule,
    SharedModule,
    AddTachesModule,
    UpdateTachesModule
  ],
  providers: [TachesService],
  exports: [TachesComponent]
})
export class TachesModule { }
