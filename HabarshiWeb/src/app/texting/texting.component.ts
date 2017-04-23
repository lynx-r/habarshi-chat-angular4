import {Component, OnInit} from '@angular/core';
import {TextingService} from "../service/texting.service";
import {User} from "../model/user.model";
import {UserService} from "../service/user.service";

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

  constructor(private textingService: TextingService, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.userLoggedInEvent.subscribe((user) => {
      this.getMessages();
      this.user = user;
    })
  }

  public getMessages() {
    this.textingService.getMessages()
      .subscribe(
        messages => {
          this.messages = messages
          this.errorMessage = ''
        }, error => this.errorMessage = error
      );
  }

  onSendMessage(messageInput: HTMLInputElement) {
    if (!messageInput.value) {
      return;
    }
    const message = messageInput.value;
    this.textingService.sendMessage(message)
      .subscribe(
        data => {
          if (data.ok) {
            this.messages.push(message);
            messageInput.value = '';
            this.errorMessage = '';
          } else {
            this.errorMessage = data.comment;
          }
        },
        error => this.errorMessage = error
      );
  }

}
