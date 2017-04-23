import { Injectable } from '@angular/core';
import {User} from "../model/user.model";

@Injectable()
export class UserService {

  user: User;

  constructor() { }

  authUser(user: User) {
    this.user = user;
  }

  isAuth() {
    return this.user != null;
  }

}
