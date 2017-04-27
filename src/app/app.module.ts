import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TextingComponent } from './texting/texting.component';
import { MessageComponent } from './texting/message/message.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {TextingService} from "./service/texting.service";
import {UserService} from "./service/user.service";
import {ConstantsService} from "./shared/constants.service";
import {RosterService} from "./service/roster.service";
import {FileUploadModule} from "ng2-file-upload";
import {AppRoutingModule} from "./app-routing.module";
import {AuthGuard} from "./auth.guard";
import {QueryParamsService} from "./service/query-params.service";
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    AppComponent,
    TextingComponent,
    MessageComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FileUploadModule,
    AppRoutingModule,
    MomentModule
  ],
  providers: [AuthGuard, ConstantsService, QueryParamsService, TextingService, UserService, RosterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
