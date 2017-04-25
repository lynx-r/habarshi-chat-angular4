import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TextingComponent} from "./texting/texting.component";
import {AuthGuard} from "./auth.guard";

const appRoutes: Routes = [
  {
    path: '',
    component:
    TextingComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile', children: []
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {
}
