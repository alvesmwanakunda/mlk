import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';

@Component({
  selector: 'app-mlka-location',
  standalone: true,
  imports: [CommonModule, NavbarUserModule],
  templateUrl: './mlka-location.component.html',
  styleUrls: ['./mlka-location.component.scss']
})
export class MlkaLocationComponent {

}
