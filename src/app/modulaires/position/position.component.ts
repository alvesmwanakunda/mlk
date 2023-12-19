import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModulairesComponent } from '../modulaires.component';


@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

  constructor(
    public dialogRef:MatDialogRef<ModulairesComponent>,
  ){

  }

  ngOnInit(): void {

  }

}
