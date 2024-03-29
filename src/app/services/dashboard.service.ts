import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { BusinessService } from './business.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public OUTWARD_SUPPLY_AND_LIABILITY_URL = 'https://dev.asp.api.irisgst.com/capsule/dashboard/getOutwardSupplyAndLiability'
  public QUICK_STATS_URL = 'https://dev.asp.api.irisgst.com/capsule/dashboard/getQuickStats'
  public TAX_PAYMENT_URL = 'https://dev.asp.api.irisgst.com/capsule/dashboard/getTaxPayment'
  public selectedCompany

  constructor(private http: HttpClient, private authService: AuthService) { }

  handleError(errorMessage: string) {
    return throwError(() => {
      if (errorMessage)
        return errorMessage
      return 'An error occurred!'
    })
  }

  getOutWardSupplyAndLiability(company) {
    return this.http.get(this.OUTWARD_SUPPLY_AND_LIABILITY_URL, {
      params: { 
        'companyId': company.companyId,
        userMailId: this.authService.user.email
      },
      headers: new HttpHeaders({
        'X-Auth-Token':  this.authService.user.token,
        'companyid': company.rootCompanyId
      })
    })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          if (response['status'] !== 'SUCCESS')
            throw new Error()
        })
      )
  }

  getQuickStats(company) {
    return this.http.get(this.QUICK_STATS_URL, {
      params: { 
        'companyId': company.companyId,
        userMailId: this.authService.user.email
      },
      headers: new HttpHeaders({
        'X-Auth-Token':  this.authService.user.token,
        'companyid': company.rootCompanyId
      })
    })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          if (response['status'] !== 'SUCCESS')
            throw new Error()
        })
      )
  }

  getTaxPayment(company) {
    return this.http.get(this.TAX_PAYMENT_URL, {
      params: { 
        'companyId': company.companyId,
        userMailId: this.authService.user.email
      },
      headers: new HttpHeaders({
        'X-Auth-Token':  this.authService.user.token,
        'companyid': company.rootCompanyId
      })
    })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          if (response['status'] !== 'SUCCESS')
            throw new Error()
        })
      )
  }
}
