import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Message} from "../model/message.model";
import {ConstantsService} from "../shared/constants.service";
import {User} from "../model/user.model";
import {Utils} from "../util/util";

@Injectable()
export class TextingService {

  constructor(private http: Http, private constants: ConstantsService) {
  }

  sendMessage(session: string, message: string): Observable<string> {
    let to = 'kuku';
    let id: string = '123';
    let params: string[] = [
      `session=${session}`,
      `text=${message}`,
      `id=${id}`,
      `with=to`,
      `to=${to}`
    ];
    let queryUrl = `${this.constants.SERVER_URL}/v1/chat/send?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessage)
      .catch(Utils.handleError);
  }

  private extractMessage(response: Response) : string {
    let body = response.json() as string;
    return body;
  }

  getMessages(session: string): Observable<string[]> {
    let params: string[] = [`session=${session}`];
    let queryUrl = `${this.constants.SERVER_URL}/user/mam?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessages)
      .catch(Utils.handleError);
  }


  private extractMessages(response: Response): string[]{
    return response.json().mam.history
      .map(item =>
        new Message(item.from, item.id, item.jid, item.marker, item.stamp, item.text, item.time, item.to));
  }
}
