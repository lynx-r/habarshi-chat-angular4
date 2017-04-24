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

@Injectable()
export class TextingService {

  constructor(private http: Http, private userService:UserService,private constants: ConstantsService) {
  }

  sendMessage(message: Message): Observable<ServerStatus> {
    const session = this.userService.getSession();
    let params: string = [
      `session=${session}`,
      `text=${message.text}`,
      `id=${message.id}`,
      `with=to`,
      `to=${message.to}`
    ].join('&');
    let queryUrl = `${this.constants.SERVER_URL}/v1/chat/send?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessage)
      .catch(Utils.handleError);
  }

  private extractMessage(response: Response): ServerStatus {
    let body = response.json();
    return new ServerStatus(body.comment, body.ok);
  }

  getMessages(after?: string): Observable<Message[]> {
    const session = this.userService.getSession();
    let params: string = `session=${session}`;
    if (after != null) {
      params = params.concat(`&after=${after}`);
    }
    const queryUrl = `${this.constants.SERVER_URL}/user/mam?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessages)
      .catch(Utils.handleError);
  }

  private extractMessages(response: Response): string[] {
    let body = response.json();
    if (!body.ok) {
      throw new Error(body.comment);
    }

    return body.mam.history
      .map(item =>
        new Message(item.from, item.id, item.jid, item.stamp, item.text, item.time, item.to, item.marker));
  }
}
