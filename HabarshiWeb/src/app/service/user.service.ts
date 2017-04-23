import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {User} from "../model/user.model";
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {ConstantsService} from "../shared/constants.service";
import {Utils} from "../util/util";
import {Store} from "../util/store";

@Injectable()
export class UserService implements OnInit {

  private static USER_KEY: string = 'user';
  private loggedIn = false;

  @Output() userLoggedInEvent = new EventEmitter<User>();

  constructor(private http: Http, private constants: ConstantsService) {
    this.loggedIn = !!Store.get(UserService.USER_KEY);
  }

  ngOnInit() {
  }

  sessionConfig(): Observable<User> {
    if (this.loggedIn) {
      const user: User = Store.get(UserService.USER_KEY);
      const queryUrl = `${this.constants.SERVER_URL}/session-config?session=${user.session}`;
      return this.http.get(queryUrl).map((resp: Response) => {
        this.extractUser(resp);
        this.loggedIn = true;
      }).catch(Utils.handleError)
    }
  }

  auth(username: string, passwd: string): Observable<User> {
    const params: string = [
      `username=${username}`,
      `password=${passwd}`
    ].join('&');
    const queryUrl = `${this.constants.SERVER_URL}/auth/1?${params}`;
    return this.http.get(queryUrl).map((resp: Response) => {
      this.extractUser(resp);
      this.loggedIn = true;
    }).catch(Utils.handleError);
  }

  logout(): Observable<void> {
    if (this.loggedIn) {
      const user: User = Store.get(UserService.USER_KEY);
      const queryUrl = `${this.constants.SERVER_URL}/logout?session=${user.session}`;
      return this.http.get(queryUrl)
        .map((resp: Response) => this.loggedIn = false)
        .catch(Utils.handleError)
    }
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  private extractUser(resp: Response) {
    const body = resp.json();
    console.log(body);
    try {
      if (body.session == false) {
        throw new Error(body.comment);
      } else if (body.ok == false) {
        throw new Error(body.comment);
      }
    } finally {
      Store.put(UserService.USER_KEY, null);
      this.loggedIn = false;
    }
    let user = new User(body.session, body.username);
    Store.put(UserService.USER_KEY, user);
    this.userLoggedInEvent.emit(user);
    return user;
  }

  public static getSession() {
    const user: User = Store.get(UserService.USER_KEY);
    if (user == null) {
      return null;
    }
    return user.session;
  }

}
