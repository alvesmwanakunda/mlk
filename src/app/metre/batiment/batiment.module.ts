import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatimentComponent } from './batiment.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [BatimentComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[BatimentComponent]
})
export class BatimentModule { }
