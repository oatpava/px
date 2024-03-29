import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../main/px.service'
import { LoggerService } from '../main/logger.service'

import { User } from '../setting/model/user.model'
import { UserProfile } from '../setting/model/user-profile.model'

@Injectable()
export class LoginService {
  private _apiUrl: string
  private _headers: Headers
  private _apiUrlLogin: string
  _options: RequestOptions
  
  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/users'
    this._apiUrlLogin = environment.apiServer + environment.apiName + '/v1/users'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
  }

  checkLogin(user: User): Observable<any> {
    if (environment.production) {
      return this._http.post(this._apiUrlLogin + '/login', user, { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          if (result.data.result) {
            localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          }
          return this.pxService.verifyResponseArray(result)
        })
        .catch(this.loggerService.handleError)
    }
  }

  checkChangePassword(user: User): Observable<any> {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      return this._http.post(this._apiUrl + '/checkChangePassword', user, { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          return this.pxService.verifyResponseArray(result)
        })
        .catch(this.loggerService.handleError)
    }
  }

  checkEmail(username: String, email: String): Observable<any> {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      return this._http.get(this._apiUrl + '/checkEmail/' + username + '/email/' + email, { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          return this.pxService.verifyResponseArray(result)
        })
        .catch(this.loggerService.handleError)
    }
  }

  updateStatusByUsername(user: User): Observable<any> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('api_key=praXis'))
      this._options.search = params
      return this._http.put(this._apiUrl + '/userName', user, this._options)
        .map((response: Response) => {
          let result = response.json()
          return this.pxService.verifyResponseArray(result)
        })
        .catch(this.loggerService.handleError)
    }
  }

  updatePassword(user: User): Observable<any> {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      return this._http.put(this._apiUrl + '/pw', user, { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          return this.pxService.verifyResponseArray(result)
        })
        .catch(this.loggerService.handleError)
    }
  }

  updatePasswordByUrl(usernameUrl: String, user: User): Observable<any> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/changePass/' + usernameUrl, user, { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          return this.pxService.verifyResponseArray(result)
        })
        .catch(this.loggerService.handleError)
    }
  }

  convertDateFormat(user: User): User {
    var newUser: User = user
    if (newUser.activeDate !== null) newUser.activeDate = user.activeDate.formatted
    if (user.expireDate !== null) newUser.expireDate = user.expireDate.formatted
    if (user.passwordExpireDate !== null) newUser.passwordExpireDate = user.passwordExpireDate.formatted
    return newUser
  }

  getParmUserChange(username: String, user: User): Observable<any> {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      console.log(this._headers)
      return this._http.put(this._apiUrl + '/changePass/' + username, user, { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          return this.pxService.verifyResponseArray(result)
        })
        .catch(this.loggerService.handleError)
    }
  }

  sendEmail(username: String, user: User) {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      return this._http.post(this._apiUrl + '/sendEmail/' + username, user, { headers: this._headers })
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response)
        })
        .catch(this.loggerService.handleError)
    }
  }

  checkRecentPassword(user: User): Observable<boolean> {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      return this._http.post(this._apiUrl + '/checkRecentPassword', user, { headers: this._headers })
        .map((response: Response) => {
          localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  getMockToken(): Observable<boolean> {
    if (environment.production) {
      return this._http.get(this._apiUrlLogin + '/getMocktoken', { headers: this._headers })
        .map((response: Response) => {
          localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          return response.json().data.result
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  swapUserProfile(userProfile: UserProfile): Observable<any> {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      return this._http.post(this._apiUrl + '/swapUserProfile', userProfile, { headers: this._headers })
        .map((response: Response) => {
          localStorage.removeItem('px-auth-token')
          localStorage.setItem('px-auth-token', response.json().data)
          return this.pxService.verifyResponseArray(response)
        })
        .catch(this.loggerService.handleError)
    }
  }

}
