import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { ModuleProjetComponent } from './module-projet.component';
import { StockProjetModule } from 'src/app/stock-projet/stock-projet.module';
import { AddStockProjetModule } from 'src/app/stock-projet/add-stock-projet/add-stock-projet.module';
import { DeleteModuleProjetModule } from './delete-module-projet/delete-module-projet.module';


@NgModule({
  declarations: [ModuleProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    StockProjetModule,
    AddStockProjetModule,
    DeleteModuleProjetModule
  ],
  exports:[ModuleProjetComponent],
  providers:[ProjetsService]
})
export class ModuleProjetModule { }
