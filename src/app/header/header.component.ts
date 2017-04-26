import {Component, OnInit} from '@angular/core';
import {User} from "../model/user.model";
import {UserService} from "../service/user.service";
import {Observable} from 'rxjs/Rx';
import "rxjs/add/observable/timer";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  anonym = 0;
  user: User;
  errorMessage;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    if (this.userService.loggedIn) {
      Observable.timer(500).subscribe(() => {
        this.userService.sessionConfig()
          .subscribe(user => {
              this.user = user;
              this.errorMessage = '';
            }, error => this.errorMessage
          );
      });
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
        // JOIN TO GROUP CHAT
        this.userService.join().subscribe(() => {
        }, error => this.errorMessage = error);
      }, error => this.errorMessage = error);
  }

  logout() {
    this.userService.leave().subscribe(() => {
      this.doLogout();
    }, error => {
      this.doLogout();
    });
  }

  private doLogout() {
    this.userService.logout()
      .subscribe(() => {
          this.user = null;
          this.errorMessage = '';
        }, error => this.errorMessage = error
      );
    localStorage.clear();
  }

}