import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http'
import { Router } from '@angular/router'
import { environment } from '../../environments/environment'
import { PxService } from '../main/px.service'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class AuthService {
    _apiUrl: string
    _headers: Headers
    _token: string
    _options: RequestOptions

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private _http: Http, private router: Router, private pxService: PxService,) {
        this._apiUrl = environment.apiServer + environment.apiName
        this._headers = new Headers()
        this._headers.append('Content-Type', 'application/json; charset=UTF-8')
        this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
        this._options = new RequestOptions({ headers: this._headers })
        let params = new URLSearchParams()
        params.set('t', ''+new Date().getTime())
        this._options.search = params
    }

    check(): Observable<any> {
        return this._http.get(this._apiUrl + '/checkAuth', this._options)
            .map((response: Response) => {
                if(response.status===200){
                    return this.pxService.createObservable(true)
                }else{
                    // this.router.navigate(['/login']);
                    return this.pxService.createObservable(false)
                }
            })
    }

}