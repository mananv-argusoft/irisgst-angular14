import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from "@angular/material/icon";
import { MatTreeModule } from '@angular/material/tree'; 

import { AppRoutingModule } from './app-routing.module';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';

import { SortByPipe } from './pipes/sort-by.pipe';
import { ToIndianCurrencyPipe } from './pipes/to-indian-currency.pipe';

import { AppComponent } from './app.component';
import { LoginAndRegisterComponent } from './pages/login-and-register/login-and-register.component';
import { CompanySelectorComponent } from './components/company-selector/company-selector.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NavbarHeaderComponent } from './components/navbar-header/navbar-header.component';
import { MasterMenuComponent } from './components/master-menu/master-menu.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { BulkDownloadComponent } from './pages/bulk-download/bulk-download.component';
import { CompanyTreeSelectorComponent } from './components/company-tree-selector/company-tree-selector.component';
import { FlatTreeSelectorComponent } from './components/flat-tree-selector/flat-tree-selector.component';

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
    ToIndianCurrencyPipe,
    ForgotPasswordComponent,
    NavbarHeaderComponent,
    MasterMenuComponent,
    PageTitleComponent,
    BulkDownloadComponent,
    CompanyTreeSelectorComponent,
    FlatTreeSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AutocompleteLibModule,
    NgxPaginationModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatTreeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
