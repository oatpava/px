import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'

import { Lookup } from '../lookup/model/lookup.model'
import { LOOKUPS } from '../lookup/model/mock-lookups'

@Injectable()
export class LookupService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions
  Lookups: Lookup[] = []
  // environment = environment.production = true;

  constructor(private _http: Http) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    // this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getLookups(): Observable<Lookup[]> {
    console.log('getLookups use rest. - O')
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/lookups?version=1&offset=0&limit=20&sort=createdDate&dir=asc&api_key=praXis',
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
      return this.createObservable(LOOKUPS)
    }
  }

  getLookupByLookupId(lookupId: number): Observable<Lookup> {
    console.log('getLookupByLookupId use rest. - O')
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/lookups/' + lookupId + '?version=1&api_key=praXis',
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
      this.Lookups = LOOKUPS.filter(lookup => lookup.id == lookupId);
      return this.createObservable(this.Lookups[0])
    }
  }

  createLookup(newLookup: Lookup): Observable<Lookup> {
    console.log('createLookup use rest. - O')
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/lookups?api_key=praXis', newLookup,
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
      let lastId = LOOKUPS.length
      if (LOOKUPS.length > 1)
        lastId = LOOKUPS[LOOKUPS.length - 1].id
      newLookup.id = lastId++
      return this.createObservable(LOOKUPS.push(newLookup))
    }
  }

  updateLookup(updateLookup: Lookup): Observable<Lookup> {
    console.log('updateLookup use rest. - O')
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/lookups/' + updateLookup.id + '?api_key=praXis', updateLookup,
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
      let indexUpdateLookup: number = LOOKUPS.indexOf(updateLookup)
      LOOKUPS.splice(indexUpdateLookup, 1, updateLookup)
      return this.createObservable(LOOKUPS)
    }
  }

  deleteLookup(deleteLookup: Lookup): Observable<boolean> {
    console.log('deleteLookup use rest. - O')
    let result: boolean = false
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/v1/lookups/' + deleteLookup.id + '?version=1&api_key=praXis', { headers: this._headers })
        .map((response: Response) => {
          let result = response.json()
          if (result.data) {
            localStorage.setItem('px-auth-token', response.headers.get('px-auth-token'))
          }
          return response.json().data;
        })
        .catch(this.handleError)
    } else {
      let indexRemovedLookup: number = LOOKUPS.indexOf(deleteLookup)
      console.log(indexRemovedLookup);
      LOOKUPS.splice(indexRemovedLookup, 1)
      return this.createObservable(result)
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
    return Observable.throw(errMsg)
  }

}
