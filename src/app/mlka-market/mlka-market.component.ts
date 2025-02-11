import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';

@Component({
  selector: 'app-mlka-market',
  standalone: true,
  imports: [CommonModule, NavbarUserModule],
  templateUrl: './mlka-market.component.html',
  styleUrls: ['./mlka-market.component.scss']
})
export class MlkaMarketComponent {

}
