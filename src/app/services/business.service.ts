import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  public BUSINESS_ENTITIES_URL = 'https://dev.asp.api.irisgst.com/capsule/user/entity'
  public CHANGE_COMPANY_URL = 'https://dev.asp.api.irisgst.com/capsule/user/changecompany'
  public COMPANY_HIERARCHY_URL = 'https://dev.asp.api.irisgst.com/capsule/company/businesshierarchy'
  public TAX_PAYER_TYPE_URL = 'https://dev.asp.api.irisgst.com/capsule/company/getTaxpayerType'

  public selectedCompany = new BehaviorSubject<any>({})
  public selectedRootCompany = new BehaviorSubject<any>({})

  constructor(private http: HttpClient, private authService: AuthService) { }

  getBusinessEntities() {
    return this.http.get(this.BUSINESS_ENTITIES_URL, {
      headers: new HttpHeaders({ 'X-Auth-Token':  this.authService.user.token })
    })
      .pipe(catchError(this.handleError))
  }

  changeBusiness(companyId) {
    // console.log('ida = ', companyId)
    return this.http.post(this.CHANGE_COMPANY_URL, {}, {
      headers: new HttpHeaders({ 'X-Auth-Token':  this.authService.user.token }),
      params: { 'companyid': companyId }
    })
      .pipe(catchError(this.handleError))
  }

  getCompanyHierarchy(companyId) {
    return this.http.get(this.COMPANY_HIERARCHY_URL, {
      params: { 'companyid': companyId },
      headers: new HttpHeaders({ 
        'X-Auth-Token':  this.authService.user.token, 
        'companyid': companyId 
      })
    })
      .pipe(catchError(this.handleError))
  }

  getTaxPayerType(company) {
    return this.http.get(this.TAX_PAYER_TYPE_URL, {
      params: { 'gstin': company['gstin'] },
      headers: new HttpHeaders({
        'X-Auth-Token':  this.authService.user.token, 
        'companyid': company.rootCompanyId
      })
    })
      .pipe(catchError(this.handleError))
  }

  handleError(errorMessage) {
    return throwError(() => {
      if (errorMessage)
        return errorMessage
      return `An error occurred!`
    })
  }
}