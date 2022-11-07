import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-navbar-header',
  templateUrl: './navbar-header.component.html',
  styleUrls: ['./navbar-header.component.css']
})
export class NavbarHeaderComponent implements OnInit {
  public marqueeNews
  public marqueeNewsSubscription: Subscription

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.marqueeNewsSubscription = this.newsService.marqueeNews.subscribe(news => {
      this.marqueeNews = news
    })
  }

}
