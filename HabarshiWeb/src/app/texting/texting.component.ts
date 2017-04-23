import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TextingService} from "../service/texting.service";
import {User} from "../model/user.model";
import {UserService} from "../service/user.service";
import {Message} from "../model/message.model";
import {GUID} from "../util/guid";
import {UsersService} from "../service/users.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-texting',
  templateUrl: './texting.component.html',
  styleUrls: ['./texting.component.css'],
  providers: [TextingService]
})
export class TextingComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesRef') messagesRef: ElementRef;
  messages: Message[] = [];
  errorMessage: string;
  user: User;

  constructor(private textingService: TextingService,
              private userService: UserService,
              private usersService: UsersService) {
  }

  ngOnInit() {
    this.userService.userLoggedInEvent.subscribe((user) => {
      this.getMessages();
      this.user = user;
    })
  }

  ngAfterViewChecked() {
    this.scrollBottom();
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

  private scrollBottom() {
    let nativeElement = this.messagesRef.nativeElement;
    nativeElement.scrollTop = nativeElement.scrollTop +
      nativeElement.scrollHeight * 2;
  }

  onSendMessage(messageInput: HTMLInputElement) {
    if (!messageInput.value) {
      return;
    }
    const text = messageInput.value;
    const user = this.userService.user;
    const selectedUser = this.usersService.selectedUser;
    const id: string = new GUID().toString();
    const message = new Message(user.username, id, user.jid, new Date().getTime(), text, new Date(), selectedUser.username);
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
