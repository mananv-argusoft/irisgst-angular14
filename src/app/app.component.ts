import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './services/auth.service'
import { BusinessService } from './services/business.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public authSubscription: Subscription
  public isAuth: boolean = false

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuth.subscribe((isAuth) => {
      this.isAuth = isAuth

      this.router.navigate(['/dashboard'])
    })

    this.businessService.selectedCompany.subscribe(data => {
      console.log('selected company = ', data)      
    })
  }
}
