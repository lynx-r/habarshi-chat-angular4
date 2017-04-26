import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Message} from "../model/message.model";
import {ConstantsService} from "../shared/constants.service";
import {Utils} from "../util/util";
import {UserService} from "./user.service";
import {ServerStatus} from "../model/server-status.enum";
import {RosterService} from "./roster.service";
import {EmptyObservable} from "rxjs/observable/EmptyObservable";
import {QueryParamsService} from "./query-params.service";
import {MessageType} from "../model/message-type.enum";

@Injectable()
export class TextingService {

  constructor(private http: Http,
              private userService: UserService,
              private rosterService: RosterService,
              private query: QueryParamsService,
              private constants: ConstantsService) {
  }

  sendMessage(message: Message): Observable<ServerStatus> {
    const session = this.userService.getSession();
    let params: string = [
      `session=${session}`,
      `text=${message.text}`,
      `id=${message.id}`,
      `to=${message.to}`
    ].join('&');
    let queryUrl = `${this.query.getServerUrl()}/v1/chat/send?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessage)
      .catch(Utils.handleError);
  }

  private extractMessage(response: Response): ServerStatus {
    let body = response.json();
    return new ServerStatus(body.comment, body.ok);
  }

  getMessages(after?: string): Observable<Message[]> {
    return this.getAllMessages(null, null, after);
  }

  getMessagesForPeriod(before: string, days: number) {
    return this.getAllMessages(before, days, null);
  }

  private getAllMessages(before: string, days: number, after: string): Observable<Message[]> {
    const session = this.userService.getSession();
    if (session == null) {
      return new EmptyObservable();
    }
    const buddy = this.rosterService.selectedUser;
    if (buddy == null) {
      return new EmptyObservable();
    }
    let params: string = `session=${session}&with=${buddy.jid}`;
    if (after != null) {
      params = params.concat(`&after=${after}`);
    }
    if (before != null) {
      params = params.concat(`&before=${before}`);
    }
    if (days != null) {
      params = params.concat(`&days=${days}`);
    }
    const queryUrl = `${this.query.getServerUrl()}/user/mam?${params}`;
    return this.http.get(queryUrl)
      .map((resp: Response) => {
        return this.extractMessages(resp);
      }).catch(Utils.handleError);
  }

  private extractMessages(response: Response): Message[] {
    let body = response.json();
    if (!body.ok) {
      throw new Error(body.comment);
    }

    return body.mam.history
      .map(item =>
        new Message(item.from, item.id, item.jid, item.stamp, item.text, item.time, item.to, item.marker));
  }

  updateMessageStatuses(latestMessages: Message[], originMessages: Message[]): Observable<Message[]> {
    if (latestMessages.length == 0) {
      return new EmptyObservable();
    }
    const session = this.userService.getSession();
    const ids = latestMessages.map((message) => {
      return message.id;
    });
    const params = [
      `session=${session}`,
      `ids=${ids}`
    ].join('&');
    const queryUrl = `${this.query.getServerUrl()}/user/mam_ack?${params}`;
    return this.http.get(queryUrl)
      .map((resp: Response) => {
        const body = resp.json();
        if (!body.ok) {
          throw new Error(body.comment);
        }
        Object.entries(body.ack).forEach(([id, marker]) => {
          let msgs = originMessages.filter((m) => m.id == id);
          if (msgs.length == 1) {
            msgs[0].marker = marker;
            if (marker == this.constants.ACKNOWLEDGED || marker == this.constants.MARKABLE) {
              const index = latestMessages.indexOf(msgs[0]);
              latestMessages.splice(index, 1);
            }
          }
        });
        return latestMessages;
      })
      .catch(Utils.handleError);
  }

  markMessages(latestMessages: Message[], marker: string) {
    if (latestMessages.length == 0) {
      return new EmptyObservable();
    }
    const session = this.userService.getSession();
    for (let message of latestMessages) {
      if (message.marker == this.constants.ACKNOWLEDGED
        || Utils.getMessageType(message, this.userService.user.jid) == MessageType.OUT) {
        continue;
      }
      const params = [
        `session=${session}`,
        `message_id=${message.id}`,
        `marker=${marker}`,
        `to=${message.to}`
      ].join('&');
      const queryUrl = `${this.query.getServerUrl()}/v1/chat/marker?${params}`;
      this.http.get(queryUrl)
        .map((resp: Response) => {
          const body = resp.json();
          console.log(body);
          if (!body.ok) {
            throw new Error(body.comment);
          }
        })
        .catch(Utils.handleError)
        .subscribe();
    }
  }
}
