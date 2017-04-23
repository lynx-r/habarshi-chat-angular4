import { Component, OnInit } from '@angular/core';
import {User} from "../model/user.model";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  errorMessage;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  auth(username: string, passwd: string) {
    this.authService.auth(username, passwd)
      .subscribe(user => this.user = user,
        error => this.errorMessage = error);
  }

}
