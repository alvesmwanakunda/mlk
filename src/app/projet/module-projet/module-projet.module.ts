import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { ModuleProjetComponent } from './module-projet.component';



@NgModule({
  declarations: [ModuleProjetComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[ModuleProjetComponent],
  providers:[ProjetsService]
})
export class ModuleProjetModule { }
