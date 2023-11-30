import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveFolderComponent } from './move-folder.component';
import { BoxService } from 'src/app/shared/services/box.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MoveFolderComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [BoxService]
})

export class MoveFolderModule { }
