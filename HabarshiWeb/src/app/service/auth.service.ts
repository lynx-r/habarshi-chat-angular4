import { Injectable } from '@angular/core';
import {User} from "../model/user.model";
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {ConstantsService} from "../shared/constants.service";
import {UserService} from "./user.service";

@Injectable()
export class AuthService {

  constructor(private http: Http, private userService: UserService, private constants: ConstantsService) { }

  auth(username: string, passwd: string) : Observable<User> {
    const params: string[] = [
      `username=${username}`,
      `password=${passwd}`
    ];
    const queryUrl = `${this.constants.SERVER_URL}/auth/1?${params}`;
    return this.http.get(queryUrl).map((resp: Response) => {
      const body = resp.json();
      const user = new User(body.session, body.username);
      this.userService.authUser(user);
      return user;
    });
  }

}
