import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteTimesheetComponent } from './delete-timesheet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';



@NgModule({
  declarations: [DeleteTimesheetComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [TimesheetService],
})
export class DeleteTimesheetModule { }
