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
import {FileItem, FileUploader, FileUploaderOptions} from "ng2-file-upload";
import {Store} from "../util/store";
import {HabarshiFile} from "../model/habarshi-file.model";
import {Utils} from "../util/util";
import {AudioService} from "../service/audio.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-texting',
  templateUrl: './texting.component.html',
  styleUrls: ['./texting.component.css'],
  providers: [AudioService, TextingService]
})
export class TextingComponent implements OnInit, AfterViewChecked {

  private blinkTitle: boolean;
  private blinkSubscription: Subscription;
  private latestMessages: Message[] = [];
  refreshMessageSubscribtion: Subscription;
  private beforeDays: number = 1;
  private getForPeriod: boolean;

  @ViewChild('messageRef') messageRef: ElementRef;
  @ViewChild('messagesRef') messagesRef: ElementRef;
  @ViewChild('uploadFileRef') uploadFileRef: ElementRef;

  messages: Message[] = [];
  newMessage: boolean;
  initScroll: boolean = true;
  errorMessage: string;
  roster: Roster[];
  private statusMessages: Message[] = [];
  uploader: FileUploader;
  private fileUploaderOptions: FileUploaderOptions;
  hasBaseDropZoneOver: boolean = false;
  private toggleRed: boolean;
  private toggleRedSubscription: Subscription;

  refreshRosterSubscription: Subscription;

  constructor(private textingService: TextingService,
              private userService: UserService,
              private rosterService: RosterService,
              private audioService: AudioService,
              private constants: ConstantsService) {
  }

  ngOnInit() {
    this.userService.userLoggedInEvent.subscribe(() => {
      // after login we have upload_url in store
      this.initFileUploader();
      this.refreshMessageSubscribtion = Observable.timer(1000, this.constants.REFRESH_MESSAGES_MILLISEC)
        .subscribe(() => this.refreshMessages());
      this.refreshRosterSubscription = Observable.timer(0, this.constants.REFRESH_ROSTER_MILLISEC)
        .subscribe(() => {
          this.rosterService.getRoster()
            .subscribe((roster) => {
              this.roster = roster;
              if (this.initScroll) {
                this.getMessages();
              }
              this.userService.user = this.rosterService.users[this.userService.user.username];
            });
        });
      this.onBlur();
      this.userService.userLoggedOutEvent.subscribe(() => {
        this.refreshMessageSubscribtion.unsubscribe();
        this.refreshRosterSubscription.unsubscribe();
        this.messages = [];
      })
    });
    this.messageRef.nativeElement.innerText = '';
  }

  onBlur() {
    this.blinkSubscription = Observable.timer(0, 1000).subscribe(() => {
      if (this.newMessage) {
        if (this.blinkTitle) {
          document.title = this.constants.TITLE_NEW_MESSAGE;
          this.blinkTitle = false;
        } else {
          document.title = this.constants.TITLE;
          this.blinkTitle = true;
        }
      }
    });
  }

  onFocus() {
    document.title = this.constants.TITLE;
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
      this.textingService.markMessages(this.latestMessages, this.constants.ACKNOWLEDGED);
    }
  }

  private initFileUploader() {
    this.fileUploaderOptions = {
      url: this.userService.user.uploads,
      autoUpload: true
    };
    this.uploader = new FileUploader(this.fileUploaderOptions);
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item: FileItem, response: string) => {
      const body = JSON.parse(response);
      if (!body.ok) {
        Utils.handleError(body.comment);
        return;
      }
      const message = this.createHabarshiMessage(item, body);
      this.textingService.sendMessage(message).subscribe((data) => {
        this.messageSent(data, message);
      });
    };
  }

  private createHabarshiMessage(item: FileItem, body: any) {
    const selectedUser = this.rosterService.selectedUser;
    const user = this.userService.user;
    const id: string = new GUID().toString();
    const habarshiText: HabarshiFile = new HabarshiFile(item.file.name, body.full_url, body.preview_url);
    return new Message(user.jid, id, user.jid, new Date().getTime(), habarshiText.toString(),
      new Date(), selectedUser.jid);
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
          this.statusMessages = messages.slice();
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
        this.latestMessages = latest;
        this.newMessage = true;
        this.textingService.markMessages(latest, this.constants.RECEIVED);
      }
    });
    this.textingService.updateMessageStatuses(this.statusMessages, this.messages).subscribe((messages) => {
      this.statusMessages = messages;
    });
  }

  private
  scrollBottom() {
    if (this.messagesRef == null) {
      return;
    }
    let nativeElement = this.messagesRef.nativeElement;
    if (this.newMessage || this.initScroll) {
      nativeElement.scrollTop = nativeElement.scrollTop +
        nativeElement.scrollHeight;
      if (document.hasFocus()) {
        this.newMessage = false;
      }
      if (nativeElement.scrollTop > 0) {
        Observable.timer(2000).subscribe(() => {
          this.initScroll = false;
        });
      }
    }
    if (nativeElement.scrollTop < nativeElement.scrollHeight / 2 && this.messages.length > 0 && !this.getForPeriod) {
      const before = this.messages[0].id;
      this.textingService.getMessagesForPeriod(before, this.beforeDays).subscribe((beforeMessages)=>{
        if (beforeMessages.length == 0) {
          this.beforeDays = 0;
          return;
        }
        this.messages = beforeMessages.concat(this.messages);
        this.getForPeriod = false;
        // nativeElement.scrollTop = nativeElement.scrollHeight / 2;
      });
      this.getForPeriod = true;
      this.beforeDays++;
    }
  }

  onSendMessage(event: KeyboardEvent) {
    const text = this.messageRef.nativeElement.innerHTML;
    if (!text || event != null && (event.keyCode != 13 || event.keyCode == 13 && event.shiftKey)) {
      return;
    }
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

  onSelectFile() {
    this.uploadFileRef.nativeElement.click();
  }

  onChangeFileUpload() {
    let file = this.uploadFileRef.nativeElement.files[0];
    if (file == null) {
      return;
    }
    this.uploader.addToQueue([file]);
    this.uploader.uploadAll();
  }

  private messageSent(data, message: Message) {
    if (data.ok) {
      this.messages.push(message);
      this.statusMessages.push(message);
      this.messageRef.nativeElement.innerText = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = data.comment;
    }
    this.newMessage = true;
  }

  onFileOver(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  onSendAudioMessage() {
    if (!AudioService.isSupportRecording()) {
      Utils.handleError('Запись аудио не поддерживается');
      return;
    }
    this.audioService.toggle().then((file) => {
      if (!file) { // start
        let timer = Observable.timer(0, 1000);
        this.toggleRedSubscription = timer.subscribe(() => {
          this.toggleRed = !this.toggleRed;
        });
        return;
      }
      // got file
      this.toggleRed = false;
      this.toggleRedSubscription.unsubscribe();
      this.uploader.addToQueue([file]);
      this.uploader.uploadAll();
    });
  }

  getRed() {
    if (this.toggleRed) {
      return 'red';
    }
    return '';
  }

  isLoggedIn() {
    return this.userService.loggedIn;
  }

}
