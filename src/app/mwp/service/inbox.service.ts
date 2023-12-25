import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { Inbox } from '../model/inbox.model'
import { Menu } from '../model/menu.model'
import { MENUINBOX } from '../model/MENU-INBOX'
import { InboxFilter } from '../model/inboxFilter.model'
import { ListReturn } from '../../main/model/listReturn.model'

@Injectable()
export class InboxService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/inboxs'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })
  }

  private createObservable(data: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(data)
      observer.complete()
    })
  }

  createInbox(newInbox: Inbox): Observable<Inbox> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.post(this._apiUrl, newInbox, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  deleteInbox(deleteInbox: Inbox): Observable<boolean> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/' + deleteInbox.id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getMenuInboxs(): Observable<Menu[]> {
    let menus: Menu[] = []
    menus = MENUINBOX.filter(menu => menu)
    return this.pxService.createObservable(menus)
  }

  updateInboxOpenDate(inbox: Inbox): Observable<Inbox> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/updateOpenDate", inbox, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
  }

  updateInboxActionDate(inbox: Inbox): Observable<Inbox> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/updateActionDate", inbox, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
  }

  updateInboxFinishDate(inbox: Inbox): Observable<Inbox> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=asc'))
      this._options.search = params
      return this._http.put(this._apiUrl + "/updateFinishDate", inbox, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  getStructureInboxs(structureId: number, offset: number, limit: number): Observable<{ data: Inbox[], listReturn: ListReturn }> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=' + offset + '&limit=' + limit + '&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/structure/' + structureId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  search(filters: InboxFilter): Observable<Inbox[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.post(this._apiUrl + '/search', filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  deleteNoRecyc(id: number): Observable<boolean> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/removeNoRecyc/' + id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getInboxsByWorkflowId(workflowId: number): Observable<Inbox[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/list/workflow/' + workflowId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getInboxs(userId: number, offset: number, limit: number): Observable<{ data: Inbox[], listReturn: ListReturn }> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=' + offset + '&limit=' + limit + '&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/user/' + userId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getProfileOutboxId(userId: number, userType: number): Observable<Number[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/userProfileFolderIdTypeO/' + userId + '/' + userType, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  report(jobType: string, filters: InboxFilter): Observable<any> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.post(this._apiUrl + '/report/' + jobType, filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updateSendnote(newInbox: Inbox): Observable<Inbox> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.post(this._apiUrl, newInbox, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
