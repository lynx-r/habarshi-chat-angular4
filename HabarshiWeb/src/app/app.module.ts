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
    HttpModule
  ],
  providers: [ConstantsService, TextingService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
