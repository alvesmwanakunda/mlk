import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadChatComponent } from './read-chat.component';
import { ReadChatRoutingModule } from './read-chat-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ChatService } from '../../shared/services/chat.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/read/discussion/:id/:numero`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [ReadChatComponent],
  imports: [
    CommonModule,
    ReadChatRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers: [AuthGuardService,ChatService]
})
export class ReadChatModule { }
