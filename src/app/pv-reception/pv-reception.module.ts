import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PvReceptionRoutingModule } from './pv-reception-routing.module';
import { PvReceptionComponent } from './pv-reception.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DetailPvModule } from './detail-pv/detail-pv.module';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { DeletePvModule } from './delete-pv/delete-pv.module';



@NgModule({
  declarations: [PvReceptionComponent],
  imports: [
    CommonModule,
    PvReceptionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DetailPvModule,
    ViewerStandarModule,
    DeletePvModule
  ],
  exports:[PvReceptionComponent]
})
export class PvReceptionModule { }
