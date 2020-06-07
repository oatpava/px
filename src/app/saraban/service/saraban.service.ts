import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { environment } from '../../../environments/environment'

import { Menu } from '../model/menu.model'
import { MENUS } from '../model/MENUS'
import { SarabanFolder } from '../model/sarabanFolder.model'
import { SarabanAuth } from '../model/sarabanAuth.model'

@Injectable()
export class SarabanService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/wfFolders'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getSarabanFolders(parentId: number): Observable<SarabanFolder[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listByParentId/' + parentId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getSarabanFoldersWithAuth(parentId: number): Observable<SarabanFolder[]> {
    //this._apiUrl = environment.apiServerHome + environment.apiNameHome + '/v1/wfFolders'
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listByParentIdAuth/' + parentId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getSarabanFolderShortcuts(): Observable<SarabanFolder[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listShortcutByUserProfileIdHeader', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getSarabanFolder(sarabanFolderId: number): Observable<SarabanFolder> {
    if (environment.production) {
      return this._http.get(this._apiUrl + "/" + sarabanFolderId, this._options)
        .map((response: Response) => {
          return response.json().data as SarabanFolder
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  createSarabanFolder(newFolder: SarabanFolder): Observable<SarabanFolder> {
    if (environment.production) {
      newFolder.wfFolderOwnerName = ""
      newFolder.convertId = 0
      newFolder.nodeLevel = 0;
      newFolder.wfFolderParentName = ""
      newFolder.wfFolderLinkFolderId = 0
      newFolder.wfFolderParentType = 0
      return this._http.post(this._apiUrl, newFolder, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  createSarabanShortcutFolder(ownerId: number, folder: SarabanFolder): Observable<SarabanFolder> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/createShortcut/' + ownerId, folder, this._options)
        .map((response: Response) => {
          return response.json().data as SarabanFolder
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updateFolder(updateFolder: SarabanFolder): Observable<SarabanFolder> {
    if (environment.production) {
      return this._http.put(this._apiUrl + "/" + updateFolder.id, updateFolder, this._options)
        .map((response: Response) => {
          return response.json().data as SarabanFolder
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  deleteFolder(deleteFolder: SarabanFolder): Observable<boolean> {
    let result: boolean = false
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/' + deleteFolder.id, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  convertDateFormat(sarabanFolder: SarabanFolder): SarabanFolder {
    let newSarabanFolder: SarabanFolder = sarabanFolder
    newSarabanFolder.createdDate = sarabanFolder.createdDate.formatted
    if (sarabanFolder.wfFolderExpireDate !== null) {
      newSarabanFolder.wfFolderExpireDate = sarabanFolder.wfFolderExpireDate.formatted
    }
    return newSarabanFolder
  }

  changeBudgetYear(sarabanFolder: SarabanFolder, budgetYear: any): SarabanFolder {
    if (budgetYear == false) {
      sarabanFolder.wfFolderByBudgetYear = 0
    } else {
      sarabanFolder.wfFolderByBudgetYear = 1
    }
    return sarabanFolder
  }

  changeBudgetYearShow(sarabanFolder: SarabanFolder): any {
    let budgetYear: any
    if (sarabanFolder.wfFolderByBudgetYear == 0) {
      budgetYear = false
    } else {
      budgetYear = true
    }
    return budgetYear
  }

  changeBookNoType(sarabanFolder: SarabanFolder): SarabanFolder {
    if (sarabanFolder.wfFolderBookNoType == 1 || sarabanFolder.wfFolderBookNoType == 2) {
      sarabanFolder.wfFolderAutorun = 1
    } else {
      sarabanFolder.wfFolderAutorun = 0
    }
    return sarabanFolder
  }

  listShortcutsByUserProfileId(userProfileId: number): Observable<SarabanFolder[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listShortcutByUserProfileId/' + userProfileId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  listByContentTypeId(folderType: string, contentTypeId: number, contentType2Id: number, withAuth: number): Observable<SarabanFolder[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listByContentTypeId/' + folderType + '/' + contentTypeId + '/' + contentType2Id + '/' + withAuth, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getContentAuth(folderId: number, structureId: number, userId: number): Observable<any> {
    //this._apiUrl = environment.apiServerHome + environment.apiNameHome + '/v1/wfFolders'
    if (environment.production) {
      return this._http.get(this._apiUrl + '/contentAuth/' + folderId + '/' + structureId + '/' + userId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getFolderAuth(folderId: number, structureId: number, userId: number): Observable<any> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/folderAuth/' + folderId + '/' + structureId + '/' + userId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getContentAuthMWP(contentId: number, structureId: number, userId: number): Observable<SarabanAuth[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/contentAuthMWP/' + contentId + '/' + structureId + '/' + userId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  createAuth(folderId: number, structureId: number, userId: number, auth: SarabanAuth[]): Observable<any> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/createContentAuth/' + folderId + '/' + structureId + '/' + userId, auth, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getAuthMenus(menuType: string, folderCreateAuth: SarabanAuth, isArchive: boolean, isAdmin: boolean): Observable<Menu[]> {
    let menus: Menu[] = []
    if (menuType === "list-folder") {
      if (!isArchive) {
        (folderCreateAuth.auth) ? menus.push(MENUS[5], MENUS[4], MENUS[18]) : menus.push(MENUS[5], MENUS[4])
        if (isAdmin) menus.push(MENUS[23])
      } else {
        menus.push(MENUS[5], MENUS[4])
      }
    } else {
      menus.push(MENUS[22])
    }
    return this.pxService.createObservable(menus)
  }

  getFolderMenuTypeByParam(folderId: number): Observable<string> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/folderMenuType/' + folderId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updateOrder(folder: SarabanFolder): Observable<SarabanFolder> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/updateOrder', folder, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  listCNFoldersNoLogin(): Observable<SarabanFolder[]> {
    this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listByContentTypeId/CN/4/0/0', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  listSarabanFoldersByStructureId(structureId: number): Observable<SarabanFolder[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listByLinkId/' + structureId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  listAuthTemplateValue(linkid: number): Observable<any> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listAuthTemplateValue/' + linkid, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  createAuthTemplateValue(templateId: number, auth: SarabanAuth[]): Observable<any> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/authTemplateValue/' + templateId, auth, this._options)
        .map((response: Response) => {
          return response.json().data as SarabanFolder
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updateAuthTemplateValue(templateId: number, auth: SarabanAuth[]): Observable<any> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/authTemplateValue/' + templateId, auth, this._options)
        .map((response: Response) => {
          return response.json().data as SarabanFolder
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
