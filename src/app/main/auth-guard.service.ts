import { Injectable, }     from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router'
import { AuthService }      from './auth.service'
import { Observable } from 'rxjs/Observable'



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    console.log('AuthGuard#canActivate called');
    // return this.authService.check()
    // this.router.navigate(['/login']);
    return this.authService.check().take(1).map(e => {
      if (e) {
          return true;
      }
  }).catch(() => {
    window.location.reload()
      this.router.navigate(['/login']);
      // window.location.reload();
      return Observable.of(false);
  });
    // return true;
  }
}