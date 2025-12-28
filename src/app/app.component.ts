import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './modules/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getAuthState().subscribe(user => {
      if (!user){
        // this.router.navigate(['/login']);
       }
    });
  }
}
