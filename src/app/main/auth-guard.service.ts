import { Injectable, } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from './auth.service'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  canActivate() {
    return this._authService.check().take(1).map(e => {
      if (e) {
        return true
      }
    }).catch(() => {
      window.location.reload()
      this._router.navigate(['/login'])
      return Observable.of(false)
    })
  }
}