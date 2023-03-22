import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'

import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component'
import { LoginAndRegisterComponent } from './pages/login-and-register/login-and-register.component'
import { BulkDownloadComponent } from './pages/bulk-download/bulk-download.component'

const routes: Routes = [
  { 
    path: '', 
    component: LoginAndRegisterComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bulkDownload', component: BulkDownloadComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
