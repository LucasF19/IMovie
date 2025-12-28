import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      map((user) => {
        if (user) {
          return true;
        } else {
          // this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
