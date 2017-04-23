import {Component, OnInit} from '@angular/core';
import {User} from "../model/user.model";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  errorMessage;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.userService.sessionConfig()
        .subscribe(user => this.user = user,
          error => this.errorMessage);
      return;
    }
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  auth(username: HTMLInputElement, passwd: HTMLInputElement) {
    if (!(username.value && passwd.value)) {
      this.errorMessage = 'Укажите логин и пароль';
      return;
    }
    this.userService.auth(username.value, passwd.value)
      .subscribe(user => this.user = user,
        error => this.errorMessage = error);
  }

}
