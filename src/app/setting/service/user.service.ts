import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import 'rxjs/add/operator/map'

import { User } from '../model/user.model'
import { USERS } from '../model/user-mock'

@Injectable()
export class UserService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })
  }

  getUsers(version: string, offset: string, limit: string, sort: string, dir: string): Observable<any> {
    if (environment.production) {
      // return this.pxService.createObservable(USERS)
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit 
      + '&sort=' + sort + '&dir=' + dir))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/users', this._options)
        .map((response: any) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(USERS)
    }
  }

  getUser(userId: number, version: string): Observable<User> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=' + version))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/users/' + userId, this._options)
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(USERS.filter(user => user.id === userId)[0])
    }
  }

  getByUserName(userName: string, version: string): Observable<User> {
    // console.log('getUser waiting use rest. - O')
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=' + version + '&userName=' + userName))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/users/userName', this._options)
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(USERS.filter(user => user.name === userName)[0])
    }
  }

  getExpiredate(data, version: string): Observable<User> {
    // console.log('getUser waiting use rest. - O', this.convertDateActiveFormat(data))
    // let newUser: any = {
    //   userActiveDate: this.convertDateActiveFormat(data),
    //   version: '1.0'
    // }
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('userActiveDate=' +  this.convertDateActiveFormat(data) 
      + '&version=' + version))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/users/activeDate', this._options)
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    } else {

    }
  }

  createUser(newUser: User): Observable<User> {
    // console.log('createUser waiting use rest. - O',newUser)
    newUser = this.convertDateFormat(new User(newUser))
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/users', newUser, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      let lastId = USERS.length
      newUser.id = ++lastId
      USERS.push(newUser)
      return this.pxService.createObservable(newUser)
    }
  }

  updateUser(updateUser: User): Observable<User> {
    // console.log('updateUser waiting use rest. - O')
    console.log(updateUser)
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/users/' + updateUser.id, updateUser, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    } else {
      let indexRemoved: number = USERS.indexOf(updateUser)
      USERS.splice(indexRemoved, 1, updateUser)
      return this.pxService.createObservable(updateUser)
    }
  }

  deleteUser(deleteUser: User): Observable<boolean> {
    let result: boolean = false
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/v1/users/' + deleteUser.id, { headers: this._headers })
        .map((response: Response) => {
          return true
        })
        .catch(this.loggerService.handleError)
    } else {
      let indexRemovedFolder: number = USERS.indexOf(deleteUser)
      USERS.splice(indexRemovedFolder, 1)
      return this.pxService.createObservable(result)
    }
  }

  resetPassword(updateUserId): Observable<boolean> {
    // console.log('updateUser waiting use rest. - O')
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/users/reset/' + updateUserId, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    } else {
      // let indexRemoved: number = USERS.indexOf(updateUser)
      // USERS.splice(indexRemoved, 1, updateUser)
      // return this.pxService.createObservable(updateUser)
    }
  }

  checkUserNameExist(version: string, userName: string): Observable<boolean> {
    let result: boolean = true
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=' + version + '&userName=' + userName))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/users/userName', this._options)
        .map((response: any) => {
          // console.log(response.json().data as User === null)
          if (response.json().data === null) {
            result = false
          }
          return result
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(result)
    }
  }

  convertDateFormat(user: User): User {
    var newUser: User = user
    // newUser.activeDate = user.activeDate.formatted
    if (user.activeDate !== null) newUser.activeDate = user.activeDate.formatted
    if (user.expireDate !== null) newUser.expireDate = user.expireDate.formatted
    if (user.passwordExpireDate !== null) newUser.passwordExpireDate = user.passwordExpireDate.formatted
    return newUser
  }

  convertStringToDate(input: any): Object {
    // let input1: string = '01/03/2560 15:28:10'
    // console.log('input',input)
    if (input === null || input === '') return null
    let inputArray: string[] = input.split(' ')
    let inputDate: string = inputArray[0]
    let inputTime: string = ''
    if (inputArray.length >= 2) inputTime = inputArray[1]
    let inputDateArray: string[] = inputDate.split('/')
    let date = +inputDateArray[0]
    let inputMounth = (+inputDateArray[1])
    let inputYear = (+inputDateArray[2])
    return { date: { year: inputYear, month: inputMounth, day: date }, formatted: input }
  }


  convertDateActiveFormat(date: any) {

    // var newUser: any = date
    // newUser = user.formatted
    if (date !== null) date = date.formatted
    // console.log(date)
    return date
  }

}
