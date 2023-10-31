import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddModuleComponent } from './add-module.component';
import { AddModuleRoutingModule } from './add-module-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [AddModuleComponent],
  imports: [
    CommonModule,
    AddModuleRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class AddModuleModule { }
