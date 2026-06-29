import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/services/auth.service';

@Component({
  selector: 'app-mobile-tabs',
  templateUrl: './mobile-tabs.component.html',
  styleUrls: ['./mobile-tabs.component.scss']
})
export class MobileTabsComponent implements OnInit {
  showTabs: boolean = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showTabs = !event.url.includes('/login') && !event.url.includes('/registro') && document.location.pathname !== '/login' && document.location.pathname !== '/registro' && document.location.pathname !== '/';
    });
  }

  logout() {
    this.authService.logout();
  }
}
