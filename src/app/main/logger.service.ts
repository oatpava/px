import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'

@Injectable()
export class LoggerService {

  constructor() { }

  handleError(error: Response | any) {
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
