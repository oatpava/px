import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'

import { Holiday } from './model/holiday.model'
import { HOLIDAY } from './model/mock-holiday'

@Injectable()
export class HolidayService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions
  holidays: Holiday
  holidayId: number
  // environment = environment.production = true;
  constructor(private _http: Http) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    // this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })

  }

  getHolidays(): Observable<Holiday[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/holidays?version=1&offset=0&limit=20&sort=createdDate&dir=asc&dateFrom=0&dateTo=0&api_key=praXis',
        { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          if (result.data) {
            localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          }
          return response.json().data
        })
        .catch(this.handleError)
    } else {
      return this.createObservable(HOLIDAY)
    }
  }

  getHolidayId(holidayId: number): Observable<Holiday> {
    console.log('getHoliday waiting use rest. - O')
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/holidays/' + holidayId + '?version=1&api_key=praXis',
        { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          if (result.data) {
            localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          }
          return response.json().data
        })
        .catch(this.handleError)
    } else {
      return this.createObservable(HOLIDAY.filter(Holiday => Holiday.id === holidayId)[0])
    }
  }
  addHoliday(newHoliday: Holiday): Observable<Holiday> {
    console.log('add new holiday waiting use rest. - O')
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/holidays?api_key=praXis', newHoliday,
        { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          if (result.data) {
            localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          }
          return response.json().data;
        })
        .catch(this.handleError)
    } else {
      let holiday: Holiday
      holiday = HOLIDAY[HOLIDAY.length - 1]
      newHoliday.id = Number((holiday.id)) + 1
      return this.createObservable(HOLIDAY.push(newHoliday))
    }
  }
  updateHoliday(editHoliday: Holiday): Observable<Holiday> {
    console.log('update holiday waiting use rest. - O')
    console.log("service holiday id=>" + editHoliday.id);
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/holidays/' + editHoliday.id + '?api_key=praXis', editHoliday,
        { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          if (result.data) {
            localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          }
          return response.json().data;
        })
        .catch(this.handleError)
    } else {
      return this.createObservable(HOLIDAY.filter(Holiday => Holiday.id === editHoliday.id)[0])
    }
  }
  deleteHoliday(deleteHoliday: Holiday): Observable<Holiday> {
    console.log('delete holiday waiting use rest. - O')
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/v1/holidays/' + deleteHoliday.id + '?version=1&api_key=praXis',
        { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          if (result.data) {
            localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          }
          return response.json().data;
        })
        .catch(this.handleError)
    } else {
      console.log(deleteHoliday.id);
      this.holidayId = +HOLIDAY.findIndex(Holiday => Holiday.id === deleteHoliday.id)
      console.log(this.holidayId)
      return this.createObservable(HOLIDAY.splice(this.holidayId, 1))
    }
  }
  private createObservable(data: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(data)
      observer.complete()
    })
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof Response) {
      const body = error.json() || ''
      const err = body.error || JSON.stringify(body)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    return Observable.throw(errMsg)
  }

}
