import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetailLotComponent } from '../detail-lot/detail-lot.component';

@Component({
  selector: 'app-add-lot',
  templateUrl: './add-lot.component.html',
  styleUrls: ['./add-lot.component.scss']
})
export class AddLotComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DetailLotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

  }

  ngOnInit(){
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
