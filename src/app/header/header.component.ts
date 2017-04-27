import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  errorMessage;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    if (this.userService.loggedIn) {
      Observable.timer(500).subscribe(() => {
        this.userService.sessionConfig()
          .subscribe(user => {
              this.errorMessage = '';
            }, error => this.errorMessage
          );
      });
    }
  }

  isLoggedIn() {
    return this.userService.loggedIn;
  }

  auth(usernameEl: HTMLInputElement, passwd: HTMLInputElement) {
    const username = usernameEl.value.trim();
    if (!(username && passwd.value)) {
      this.errorMessage = 'Укажите логин и пароль';
      return;
    }
    this.userService.auth(username, passwd.value)
      .subscribe(user => {
        this.errorMessage = '';
        // JOIN TO GROUP CHAT
        this.userService.join().subscribe(() => {
        }, error => this.errorMessage = error);
      }, error => this.errorMessage = error);
  }

  create(nameEl: HTMLInputElement, fullnameEl: HTMLInputElement) {
    const name = nameEl.value.trim();
    if (!name) {
      this.errorMessage = 'Укажите ваше имя';
      return;
    }
    const fullname = fullnameEl.value.trim();
    this.userService.create(name, fullname)
      .subscribe(user => {
        this.errorMessage = '';
        // JOIN TO GROUP CHAT
        this.userService.join().subscribe(() => {
        }, error => this.errorMessage = error);
      }, error => this.errorMessage = error);
  }

  logout() {
    this.userService.leave().subscribe(() => {
      this.doLogout();
    }, () => {
      this.doLogout();
    });
  }

  private doLogout() {
    this.userService.logout()
      .subscribe(() => {
          this.errorMessage = '';
        }, error => this.errorMessage = error
      );
  }

}
