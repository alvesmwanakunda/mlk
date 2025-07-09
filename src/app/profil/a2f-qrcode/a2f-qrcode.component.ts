import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProfilComponent } from '../profil.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-a2f-qrcode',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './a2f-qrcode.component.html',
  styleUrls: ['./a2f-qrcode.component.scss']
})
export class A2fQrcodeComponent implements OnInit{
  data = inject(MAT_DIALOG_DATA);
  
  constructor(
    public dialogRef:MatDialogRef<ProfilComponent>,
  ){}

  ngOnInit(): void {
    console.log("A2fQrcodeComponent");
  }

}
