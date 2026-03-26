import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PvReceptionRoutingModule } from './pv-reception-routing.module';
import { PvReceptionComponent } from './pv-reception.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DetailPvModule } from './detail-pv/detail-pv.module';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { DeletePvModule } from './delete-pv/delete-pv.module';
import { ImageAnnotationModule } from '../note-module/image-annotation/image-annotation.module';
import { LeveeReserveModule } from './levee-reserve/levee-reserve.module';
import { AddReceptionModule } from './add-reception/add-reception.module';
import { DownloadPvComponent } from './download-pv/download-pv.component';




@NgModule({
  declarations: [PvReceptionComponent, DownloadPvComponent],
  imports: [
    CommonModule,
    PvReceptionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DetailPvModule,
    ViewerStandarModule,
    DeletePvModule,
    ImageAnnotationModule,
    LeveeReserveModule,
    AddReceptionModule
  ],
  exports:[PvReceptionComponent]
})
export class PvReceptionModule { }
