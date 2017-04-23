import { Injectable } from '@angular/core';
import {User} from "../model/user.model";

@Injectable()
export class UsersService {

  private static USERS_KEY = 'users';
  public selectedUser: User;

  constructor() {
    this.selectedUser = new User(null, 'kuku');
  }

}
