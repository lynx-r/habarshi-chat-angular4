import {Injectable, OnInit} from '@angular/core';
import {User} from "../model/user.model";
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {ConstantsService} from "../shared/constants.service";
import {Utils} from "../util/util";

@Injectable()
export class UserService implements OnInit {

  private loggedIn = false;

  constructor(private http: Http, private constants: ConstantsService) {
    this.loggedIn = !!localStorage.getItem('session');
  }

  ngOnInit() {
  }

  sessionConfig(): Observable<User> {
    if (this.loggedIn) {
      const session = localStorage.getItem('session');
      const queryUrl = `${this.constants.SERVER_URL}/session-config?session=${session}`;
      return this.http.get(queryUrl).map(UserService.extractUser)
        .catch(Utils.handleError)
    }
  }

  auth(username: string, passwd: string): Observable<User> {
    const params: string = [
      `username=${username}`,
      `password=${passwd}`
    ].join('&');
    const queryUrl = `${this.constants.SERVER_URL}/auth/1?${params}`;
    return this.http.get(queryUrl).map(UserService.extractUser)
      .catch(Utils.handleError);
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  private static extractUser(resp: Response) {
    const body = resp.json();
    localStorage.setItem('session', body.session);
    return new User(body.session, body.username);
  }

}
