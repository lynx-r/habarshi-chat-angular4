import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TextingService} from "../service/texting.service";
import {UserService} from "../service/user.service";
import {Message} from "../model/message.model";
import {GUID} from "../util/guid";
import {RosterService} from "../service/roster.service";
import {Observable} from "rxjs/Observable";
import {ConstantsService} from "../shared/constants.service";
import "rxjs/add/observable/timer";
import {Roster} from "../model/roster.model";
import {FileItem, FileUploader, ParsedResponseHeaders} from "ng2-file-upload";
import {Store} from "../util/store";
import {HabarshiText} from "../model/habarshi-text.model";
import {Utils} from "../util/util";

@Component({
  selector: 'app-texting',
  templateUrl: './texting.component.html',
  styleUrls: ['./texting.component.css'],
  providers: [TextingService]
})
export class TextingComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesRef') messagesRef: ElementRef;
  @ViewChild('messageRef') messageRef: ElementRef;

  messages: Message[] = [];
  newMessage: boolean;
  initScroll: boolean = true;
  errorMessage: string;
  roster: Roster[];
  private latestMessages: Message[] = [];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;

  constructor(private textingService: TextingService,
              private userService: UserService,
              private rosterService: RosterService,
              private constants: ConstantsService) {
  }

  ngOnInit() {
    this.userService.userLoggedInEvent.subscribe(() => {
      // after login we have upload_url in store
      this.uploader = new FileUploader({
        url: Store.get(this.constants.SERVER_UPLOAD_URL),
        autoUpload: true
      });
      this.uploader.onAfterAddingFile = (file) => {
        file.withCredentials = false;
      };
      this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        const body = JSON.parse(response);
        if (!body.ok) {
          Utils.handleError(body.comment);
          return;
        }

        const selectedUser = this.rosterService.selectedUser;
        const user = this.userService.user;
        const id: string = new GUID().toString();
        const habarshiText: HabarshiText = new HabarshiText(item.file.name, body.full_url, body.preview_url);
        const message = new Message(user.jid, id, user.jid, new Date().getTime(), habarshiText.toString(),
          new Date(), selectedUser.jid);
        this.textingService.sendMessage(message).subscribe((data)=>{
          this.messageSent(data, message);
        });
      };
      Observable.timer(1000, this.constants.REFRESH_MESSAGES_MILLISEC)
        .subscribe(() => this.refreshMessages());
      Observable.timer(0, this.constants.REFRESH_ROSTER_MILLISEC)
        .subscribe(() => {
          this.rosterService.getRoster()
            .subscribe((roster) => {
              this.roster = roster;
              this.getMessages();
              this.userService.user = this.rosterService.users[this.userService.user.username];
            });
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
          this.messages = messages;
          this.errorMessage = '';
          this.latestMessages = messages.slice();
        }, error => this.errorMessage = error
      );
  }

  refreshMessages() {
    if (this.messages.length == 0) {
      return;
    }
    const after = this.messages[this.messages.length - 1].id;
    this.textingService.getMessages(after).subscribe((latest) => {
      if (latest.length != 0) {
        this.messages = this.messages.concat(latest);
        this.newMessage = true;
      }
    });
    this.textingService.updateMessageStatuses(this.latestMessages, this.messages).subscribe((messages) => {
      this.latestMessages = messages;
    });
  }

  private
  scrollBottom() {
    let nativeElement = this.messagesRef.nativeElement;
    if (this.newMessage || this.initScroll) {
      nativeElement.scrollTop = nativeElement.scrollTop +
        nativeElement.scrollHeight * 2;
      this.newMessage = false;
      if (nativeElement.scrollTop > 0) {
        this.initScroll = false;
      }
    }
  }

  onSendMessage() {
    if (!this.messageRef.nativeElement.value) {
      return;
    }
    const text = this.messageRef.nativeElement.value;
    const selectedUser = this.rosterService.selectedUser;
    const user = this.userService.user;
    const id: string = new GUID().toString();
    const message = new Message(user.jid, id, user.jid, new Date().getTime(), text, new Date(), selectedUser.jid);
    this.textingService.sendMessage(message)
      .subscribe(
        data => {
          this.messageSent(data, message);
        },
        error => this.errorMessage = error
      );
  }

  private messageSent(data, message: Message) {
    if (data.ok) {
      this.messages.push(message);
      this.latestMessages.push(message);
      this.messageRef.nativeElement.value = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = data.comment;
    }
    this.newMessage = true;
  }

  onFileOver(e: any) {
    this.hasBaseDropZoneOver = e;
  }

}
