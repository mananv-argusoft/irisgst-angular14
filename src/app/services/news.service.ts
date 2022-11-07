import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  public inactiveNews = new Subject<any>()
  public marqueeNews = new Subject<any>()
  public newsList = new Subject<any>() 

  public NEWS_URL = 'https://dev.asp.api.irisgst.com/capsule/news'

  constructor(public http: HttpClient, private authService: AuthService) {
    this.getNews()
  }

  handleError(errorMessage) {
    return throwError(() => {
      if (errorMessage)
        return errorMessage 
      return `An error occurred!`
    })
  }

  getNews() {
    this.http.get(this.NEWS_URL, {
      headers: new HttpHeaders({ 'X-Auth-Token':  this.authService.user.token })
    })
      .subscribe({
        next: (response) => {
          if (response !== null) {
            this.newsList.next(response['response'].news)
            this.marqueeNews.next(response['response'].marquee)
            this.inactiveNews.next(response['response'].inactiveNews)
          }
        },
        error: (errorMessage) => {
          console.log(errorMessage)
        }
      })
  }
}
