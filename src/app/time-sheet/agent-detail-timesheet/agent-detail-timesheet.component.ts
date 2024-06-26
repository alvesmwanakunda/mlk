import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-agent-detail-timesheet',
  templateUrl: './agent-detail-timesheet.component.html',
  styleUrls: ['./agent-detail-timesheet.component.scss']
})
export class AgentDetailTimesheetComponent implements OnInit {

  month:any;
  year:any;
  timesheet:any=[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private timesheetService: TimesheetService,
  ){
    this.route.params.subscribe((data:any)=>{
      this.month = data?.month;
      this.year = data?.year;
    });
  }

  ngOnInit(): void {
    this.getAllTimeSheet();
  }

  getAllTimeSheet(){
    this.timesheetService.getTimeSheetAgentByDate(this.month,this.year).subscribe((res:any)=>{
      this.timesheet = res?.message;
    },(error) => {
     console.log("Erreur lors de la récupération des données", error);
    })
}

}
