import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';

@Component({
  selector: 'app-mlka-innov',
  standalone: true,
  imports: [CommonModule, NavbarUserModule],
  templateUrl: './mlka-innov.component.html',
  styleUrls: ['./mlka-innov.component.scss']
})
export class MlkaInnovComponent {

}
