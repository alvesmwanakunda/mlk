import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveFolderProjetComponent } from './move-folder-projet.component';
import { BoxService } from 'src/app/shared/services/box.service';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [MoveFolderProjetComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[BoxService]
})
export class MoveFolderProjetModule { }
