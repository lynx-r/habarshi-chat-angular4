import {Component, OnInit} from '@angular/core';
import {User} from "../model/user.model";
import {UserService} from "../service/user.service";
import {Observable} from 'rxjs/Rx';
import {TextingComponent} from "../texting/texting.component";

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
    if (this.userService.loggedIn) {
      this.userService.sessionConfig()
        .subscribe(user => {
            this.user = user;
            this.errorMessage = '';
          }, error => this.errorMessage
        );
    }
  }

  isLoggedIn() {
    return this.userService.loggedIn;
  }

  auth(username: HTMLInputElement, passwd: HTMLInputElement) {
    if (!(username.value && passwd.value)) {
      this.errorMessage = 'Укажите логин и пароль';
      return;
    }
    this.userService.auth(username.value, passwd.value)
      .subscribe(user => {
        this.user = user;
        this.errorMessage = '';
      }, error => this.errorMessage = error);
  }

  logout() {
    this.userService.logout()
      .subscribe(() => {
          this.user = null;
          this.errorMessage = '';
        }, error => this.errorMessage = error
      );
  }

}
