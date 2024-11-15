import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { DialogUpdateTimesheetComponent } from './dialog-update-timesheet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [DialogUpdateTimesheetComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[TimesheetService]
})
export class DialogUpdateTimesheetModule { }
