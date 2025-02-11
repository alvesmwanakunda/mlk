import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-mlka-groupe',
  standalone: true,
  imports: [CommonModule, NavbarUserModule, RouterLinkActive, RouterLink ],
  templateUrl: './mlka-groupe.component.html',
  styleUrls: ['./mlka-groupe.component.scss',]
})
export class MlkaGroupeComponent {

}
