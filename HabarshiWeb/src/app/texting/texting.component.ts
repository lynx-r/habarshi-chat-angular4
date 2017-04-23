import {Component, OnInit} from '@angular/core';
import {TextingService} from "../service/texting.service";
import {User} from "../model/user.model";

@Component({
  selector: 'app-texting',
  templateUrl: './texting.component.html',
  styleUrls: ['./texting.component.css'],
  providers: [TextingService]
})
export class TextingComponent implements OnInit {

  messages: string[] = [];
  errorMessage: string;
  user: User;

  constructor(private textingService: TextingService) {
  }

  ngOnInit() {
    this.getMessages();
  }

  auth(username: string, passwd: string) {
    this.textingService.auth(username, passwd)
      .subscribe(user => this.user = user,
        error => this.errorMessage = error);
  }

  getMessages() {
    if (this.user == null) {
      return;
    }
    this.textingService.getMessages(this.user.session)
      .subscribe(
        messages => this.messages = messages,
        error => this.errorMessage = error);
  }

  onSendMessage(messageInput: HTMLInputElement) {
    if (!messageInput.value) {
      return;
    }
    let message = messageInput.value;
    this.textingService.sendMessage(this.user.session, message)
      .subscribe(
        message => {
          this.messages.push(message);
          messageInput.value = '';
        },
        error => this.errorMessage = error
      );
  }

}
