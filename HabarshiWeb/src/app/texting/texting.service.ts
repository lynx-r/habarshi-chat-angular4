import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

class User {
}

@Injectable()
export class TextingService {
  session = 'aaa62d15-ee1c-4e3f-bafe-eb15e9b1a974';
  SERVER_URL = 'https://test.habarshi.com:11999';

  constructor(private http: Http) {
  }

  send(message: string): Observable<string> {
    let to = 'kuku';
    let id: string = '123';
    let params: string[] = [
      `session=${this.session}`,
      `text=${message}`,
      `id=${id}`,
      `with=to`,
      `to=${to}`
    ];
    let queryUrl = `${this.SERVER_URL}/v1/chat/send?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessage)
      .catch(this.handleError);
  }

  private extractMessage(response: Response) : string {
    let body = response.json() as string;
    return body;
  }

  getMessages(): Observable<string[]> {
    let params: string[] = [`session=${this.session}`];
    let queryUrl = `${this.SERVER_URL}/user/mam?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessages)
      .catch(this.handleError);
  }


  private extractMessages(response: Response): string[]{
    let body = response.json() as string[];
    return body;
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = (<any>body).error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
