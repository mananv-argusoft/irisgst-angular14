import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';

import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import { AppComponent } from './app.component';
import { LoginAndRegisterComponent } from './pages/login-and-register/login-and-register.component';
import { CompanySelectorComponent } from './components/company-selector/company-selector.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { SortByPipe } from './pipes/sort-by.pipe';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NavbarHeaderComponent } from './components/navbar-header/navbar-header.component';
import { MasterMenuComponent } from './components/master-menu/master-menu.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ToIndianCurrencyPipe } from './pipes/to-indian-currency.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginAndRegisterComponent,
    LoginComponent,
    RegisterComponent,
    CompanySelectorComponent,
    DashboardComponent,
    SortByPipe,
    ForgotPasswordComponent,
    NavbarHeaderComponent,
    MasterMenuComponent,
    PageTitleComponent,
    ToIndianCurrencyPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AutocompleteLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
