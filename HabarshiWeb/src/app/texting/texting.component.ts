import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TextingService} from "../service/texting.service";
import {User} from "../model/user.model";
import {UserService} from "../service/user.service";
import {Message} from "../model/message.model";
import {GUID} from "../util/guid";
import {UsersService} from "../service/users.service";
import {Observable} from "rxjs/Observable";
import {ConstantsService} from "../shared/constants.service";
import "rxjs/add/observable/timer";
import {Roster} from "../model/roster.model";

@Component({
  selector: 'app-texting',
  templateUrl: './texting.component.html',
  styleUrls: ['./texting.component.css'],
  providers: [TextingService]
})
export class TextingComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesRef') messagesRef: ElementRef;
  messages: Message[] = [];
  newMessage: boolean;
  errorMessage: string;
  roster: Roster[];

  constructor(private textingService: TextingService,
              private userService: UserService,
              private usersService: UsersService,
              private constants: ConstantsService) {
  }

  ngOnInit() {
    Observable.timer(1000, this.constants.REFRESH_MESSAGES_MILLISEC)
      .subscribe(() => this.getLatestMessages());
    Observable.timer(0, this.constants.REFRESH_ROSTER_MILLISEC)
      .subscribe(() => {
        this.usersService.getRoster()
          .subscribe((roster) => {
            this.roster = roster;
            this.getMessages();
          });
      });
  }

  ngAfterViewChecked() {
    this.scrollBottom();
  }

  getMessages() {
    this.textingService.getMessages()
      .subscribe(
        messages => {
          this.messages = messages
          this.errorMessage = ''
        }, error => this.errorMessage = error
      );
  }

  getLatestMessages() {
    console.log('sdf');
  }

  private
  scrollBottom() {
    let nativeElement = this.messagesRef.nativeElement;
    if (nativeElement.scrollTop == 0 || this.newMessage) {
      nativeElement.scrollTop = nativeElement.scrollTop +
        nativeElement.scrollHeight * 2;
      this.newMessage = false;
    }
  }

  onSendMessage(messageInput: HTMLInputElement) {
    if (!messageInput.value) {
      return;
    }
    const text = messageInput.value;
    const selectedUser = this.usersService.selectedUser;
    const user = this.userService.user;
    const id: string = new GUID().toString();
    const message = new Message(user.jid, id, user.jid, new Date().getTime(), text, new Date(), selectedUser.username);
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
          this.newMessage = true;
        },
        error => this.errorMessage = error
      );
  }

}
