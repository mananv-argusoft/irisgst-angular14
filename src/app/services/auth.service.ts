import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap, throwError } from 'rxjs';

import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public SIGNIN_URL: string = 'https://dev.asp.api.irisgst.com/capsule/login'

  public user = new User(null, null)
  public isAuth = new Subject<boolean>()

  constructor(private http: HttpClient) { }

  handleError(errorMessage: string) {
    return throwError(() => {
      if (errorMessage)
        return errorMessage
      return 'An error occurred!'
    })
  }

  handleAuthentication(email: string, token: string) {
    this.user.email = email
    this.user.authToken = token

    this.isAuth.next(true)
  }

  login(email: string, password: string) {    
    return this.http.post(this.SIGNIN_URL, {
      email, 
      password
    }, {
      headers: new HttpHeaders({ 'tenant': 'dev' })
    })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          if (response['status'] === 'SUCCESS') {
            const responseData = response['response']
            this.handleAuthentication(responseData.email, responseData.token)
          }
          else
            throw new Error(response['message'])
        })
      )
  }
}
