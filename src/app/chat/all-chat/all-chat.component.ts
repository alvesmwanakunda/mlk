import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-chat',
  templateUrl: './all-chat.component.html',
  styleUrls: ['./all-chat.component.scss']
})
export class AllChatComponent implements OnInit {

  messages:any=[];

  constructor(
    private chatService: ChatService,
    private router: Router
  ){}

  ngOnInit() {
    this.getMessages();
  }

  getMessages(){
    this.chatService.listMessageClientAdmin().subscribe((res:any)=>{
      this.messages = res.message;
      console.log("messages", res);
    },(error)=>{
      console.log("error", error);
    })
  }

  getMessage(id, numero){
    this.router.navigate(['read/discussion',id, numero])
  }

}
