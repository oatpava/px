import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { environment } from '../../../environments/environment'
import * as crypto from 'crypto-js'

import { Menu } from '../model/menu.model'
import { MENUS } from '../model/MENUS'
import { SarabanFolder } from '../model/sarabanFolder.model'
import { SarabanContent } from '../model/sarabanContent.model'
import { SarabanContent_get } from '../model/sarabanContentGet.model'
import { SarabanContentFilter } from '../model/SarabanContentFilter.model'
import { SarabanSpeed } from '../model/sarabanSpeed.model'
import { SARABANSPEEDS } from '../model/SPEEDS'
import { SarabanSecret } from '../model/sarabanSecret.model'
import { SARABANSECRETS } from '../model/SECRETS'
import { Report } from '../model/report.model'
import { REPORTS } from '../model/REPORTS'
import { SarabanAuth } from '../model/sarabanAuth.model'
import { Email } from '../model/email.model'
import { ListReturn } from '../../main/model/listReturn.model'
import { CovalentExpansionPanelModule } from '@covalent/core';

@Injectable()
export class SarabanContentService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/wfContents'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getSarabanContents(sarabanFolderId: number, year: number, offset: number, limit: number): Observable<{ data: SarabanContent[], listReturn: ListReturn }> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=' + offset + '&limit=' + limit))
      this._options.search = params
      return this._http.get(this._apiUrl + '/listByFolderId/' + sarabanFolderId + '/' + year, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getSarabanContent(sarabanContentId: number): Observable<SarabanContent> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/' + sarabanContentId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getMenus(menuType: string): Observable<Menu[]> {
    let menus: Menu[] = []
    if (menuType === "list-saraban") menus.push(MENUS[6], MENUS[5], MENUS[4], MENUS[3], MENUS[2], MENUS[1])
    else if (menuType === "saraban") menus.push(MENUS[15], MENUS[13], MENUS[11], MENUS[10], MENUS[9], MENUS[8], MENUS[24], MENUS[7])
    else if (menuType === "saraban-finish") menus.push(MENUS[12])
    else if (menuType === "saraban-canceled") menus.push(MENUS[14])
    else if (menuType === "inbox") menus.push(MENUS[9], MENUS[17], MENUS[10])
    else if (menuType === "mywork") menus.push(MENUS[10], MENUS[15], MENUS[9])
    return this.pxService.createObservable(menus)
  }

  getAuthMenus(menuType: string, contentAuth: SarabanAuth[], isAdmin: boolean, isArchive: boolean): Observable<Menu[]> {
    let menus: Menu[] = []
    if (menuType === "list-saraban") {
      if (isAdmin) {
        if (!isArchive) menus.push(MENUS[19])
      }
      (contentAuth[1].auth) ? menus.push(MENUS[6], MENUS[5], MENUS[4], MENUS[2], MENUS[1]) : menus.push(MENUS[6], MENUS[5], MENUS[4], MENUS[1])
    } else if (menuType === "list-saraban-reserve") {//menu[3]
      if (isAdmin) {
        if (!isArchive) menus.push(MENUS[19])
      }
      (contentAuth[1].auth) ? menus.push(MENUS[6], MENUS[5], MENUS[4], MENUS[3], MENUS[2], MENUS[1]) : menus.push(MENUS[6], MENUS[5], MENUS[4], MENUS[3], MENUS[1])
    } else if (menuType === "saraban") {
      //menus.push(MENUS[20])
      if (contentAuth[14].auth) menus.push(MENUS[15])
      if (contentAuth[8].auth) menus.push(MENUS[13])
      if (contentAuth[6].auth) menus.push(MENUS[11])
      if (contentAuth[5].auth) menus.push(MENUS[10])
      if (contentAuth[4].auth) menus.push(MENUS[9])
      if (contentAuth[3].auth) menus.push(MENUS[8])
      menus.push(MENUS[24])
      if (contentAuth[2].auth) menus.push(MENUS[7])
    } else if (menuType === "saraban-finish") {
      menus.push(MENUS[12])
    } else if (menuType === "saraban-canceled") {
      menus.push(MENUS[14])
    } else if (menuType === "inbox") {//no check auth
      //menus.push(MENUS[20])
      menus.push(MENUS[9], MENUS[17], MENUS[10])
    } else if (menuType === "outbox") {//no check auth
      //menus.push(MENUS[20])
      menus.push(MENUS[9])
      menus.push(MENUS[10])
    }
    return this.pxService.createObservable(menus)
  }


  getSarabanMaxContentNo(folderId: number): Observable<SarabanContent_get> {
    if (environment.production) {
      return this._http.get(this._apiUrl + "/maxContentNo/" + folderId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getSarabanSpeeds(): Observable<SarabanSpeed[]> {
    return this.pxService.createObservable(SARABANSPEEDS)
  }

  getSarabanSecrets(): Observable<SarabanSecret[]> {
    return this.pxService.createObservable(SARABANSECRETS)
  }

  createSarabanContent(newContent: SarabanContent, preBookNoIndex: number): Observable<SarabanContent> {
    if (environment.production) {////check id login db or not
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('preBookNoIndex=' + preBookNoIndex))
      this._options.search = params
      return this._http.post(this._apiUrl, newContent, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {//no db
    }
  }

  updateSarabanContent(updateContent: SarabanContent, preBookNoIndex: number): Observable<SarabanContent> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('preBookNoIndex=' + preBookNoIndex))
      this._options.search = params
      return this._http.put(this._apiUrl, updateContent, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {

    }
  }

  deleteSarabanContent(deleteContent: SarabanContent): Observable<boolean> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/' + deleteContent.id, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  convertDateFormat(sarabanContent: SarabanContent): SarabanContent {
    let newSarabanContent: SarabanContent = sarabanContent
    newSarabanContent.createdDate = sarabanContent.createdDate.formatted
    newSarabanContent.updatedDate = sarabanContent.updatedDate.formatted
    newSarabanContent.wfContentContentDate = sarabanContent.wfContentContentDate.formatted
    newSarabanContent.wfContentBookDate = sarabanContent.wfContentBookDate.formatted
    newSarabanContent.wfContentExpireDate = sarabanContent.wfContentExpireDate.formatted
    return newSarabanContent
  }

  getReportList(menuType: string, folderType: number): Observable<Report[]> {
    let reports: Report[] = []
    if (menuType === "list-saraban") reports.push(REPORTS[folderType], REPORTS[8], REPORTS[11], REPORTS[12], REPORTS[17])
    else if (menuType === "workflow") reports.push(REPORTS[5])
    else if (menuType === "list-folder") (folderType == 0) ? reports.push(REPORTS[6], REPORTS[7]) : reports.push(REPORTS[6], REPORTS[7], REPORTS[16])
    else if (menuType === "inbox") reports.push(REPORTS[13], REPORTS[9])
    else if (menuType === "outbox") reports.push(REPORTS[14], REPORTS[10])
    else if (menuType === "barcode") reports.push(REPORTS[15])
    return this.pxService.createObservable(reports)
  }

  cancelFinish(sarabanContent: SarabanContent): Observable<number> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + "/cancelFinish/" + sarabanContent.id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  unCancelContent(sarabanContent: SarabanContent): Observable<any> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + "/unCancelContent/" + sarabanContent.id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  search(filters: SarabanContentFilter): Observable<SarabanContent[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=desc'))
      this._options.search = params
      return this._http.post(this._apiUrl + '/search', filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updateCreateSarabanContent(createContent: SarabanContent): Observable<SarabanContent> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/update', createContent, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  sendEmail(email: Email) {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/email', email, this._options)
        .map((response: Response) => {
          return response.json()
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  checkTitle(content: SarabanContent): Observable<boolean> {
    if (environment.production) {
      return this._http.post(this._apiUrl + "/checkTitle", content, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getNoPoint(folderId: number, contentId: number, preBookNoIndex: number): Observable<SarabanContent> {
    if (environment.production) {
      return this._http.get(this._apiUrl + "/point/" + folderId + '/' + contentId + '/' + preBookNoIndex, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  report1_2(jobType: string, folderId: number, filters: SarabanContentFilter, dir: string): Observable<SarabanContent[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('dir=' + dir))
      this._options.search = params
      return this._http.post(this._apiUrl + '/report1_2/' + jobType + '/' + folderId, filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  report101314(jobType: string, folderId: number, actionType: string, filters: SarabanContentFilter, dir: string): Observable<SarabanContent[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('dir=' + dir))
      this._options.search = params
      return this._http.post(this._apiUrl + '/report101314/' + jobType + '/' + folderId + '/' + actionType, filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  deleteTempTable(jobType: string): Observable<any> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/deleteByJobType/' + jobType, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  report56(jobType: string, folderId: number, filters: SarabanContentFilter, userId: number, dir: string): Observable<any> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('dir=' + dir))
      this._options.search = params
      return this._http.post(this._apiUrl + '/report56/' + jobType + '/' + folderId + '/' + userId, filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getMyWorks(): Observable<any[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/myWork', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  createMyWork(myWork: SarabanContent): Observable<SarabanContent> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/myWork', myWork, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updateMyWork(myWork: SarabanContent): Observable<SarabanContent> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/myWork', myWork, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  removeMyWork(id: number): Observable<SarabanContent> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/myWork/' + id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getSarabanContentsNologin(sarabanFolderId: number, year: number, offset: number, limit: number): Observable<{ data: SarabanContent[], listReturn: ListReturn }> {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=' + offset + '&limit=' + limit))
      this._options.search = params
      return this._http.get(this._apiUrl + '/listByFolderId/' + sarabanFolderId + '/' + year, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  createCircularNotice(circularNotice: SarabanContent): Observable<SarabanContent> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/circularNotice', circularNotice, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getStructureByName(name: string, searchOrder: number): Observable<any> {//searchOrder default:1=structure 1st, 0=user 1st
    if (environment.production) {
      let params = new URLSearchParams()
      let replacedName = name.replace(/ /g, 'xxxx')//this is repeace all for typescript, //because cant decrypt whitespace
      params.set('q', this.pxService.encrypt('name=' + replacedName))
      this._options.search = params
      return this._http.get(this._apiUrl + '/prepareShowFromTo/' + searchOrder, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getEmailAttachSize(): Observable<number> {
    if (environment.production) {
      return this._http.get(this._apiUrl + "/emailAttachSize", this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  checkBookNo(content: SarabanContent): Observable<SarabanContent> {
    if (environment.production) {
      return this._http.post(this._apiUrl + "/checkBookNo", content, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updateSendFlag(content: SarabanContent): Observable<any> {
    if (environment.production) {
      return this._http.put(this._apiUrl + "/updateSendFlag", content, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  createCopy(content: SarabanContent): Observable<SarabanContent> {
    if (environment.production) {
      return this._http.post(this._apiUrl + "/createCopy", content, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  report17(jobType: string, folderId: number, filters: SarabanContentFilter, dir: string): Observable<SarabanContent[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('dir=' + dir))
      this._options.search = params
      return this._http.post(this._apiUrl + '/report17/' + jobType + '/' + folderId, filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
