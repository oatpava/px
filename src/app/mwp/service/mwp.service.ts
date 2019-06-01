import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { Mwp } from '../model/mwp.model'
import { StructureFolder } from '../model/structureFolder.model'
import { PrivateGroup } from '../model/privateGroup.model'
import { PrivateGroupUser } from '../model/privateGroupUser.model'

@Injectable()
export class MwpService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  private createObservable(data: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(data)
      observer.complete()
    })
  }

  getUserProfileFolders(): Observable<Mwp[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/userProfileFolders/folderInMWP', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getUserProfileFolderByUserProfileIds(userProfileId: number): Observable<Mwp[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/userProfileFolders/userProfileId/' + userProfileId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getUserProfileFolderByUserProfileIdAndTypes(userProfileId: number, type: string): Observable<Mwp> {
    return this._http.get(this._apiUrl + '/userProfileFolders/userProfileId/' + userProfileId + "/" + type, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data[0])
      })
      .catch(this.loggerService.handleError)
  }

  getUserProfileFolderByTypes(type: string): Observable<Mwp[]> {
    return this._http.get(this._apiUrl + '/userProfileFolders/userProfileIdHeader/' + type, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

  getStructureFolders(structureId: number): Observable<StructureFolder[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/structureFolders/structure/' + structureId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  getStructureFolderByUserProfileIdAndTypes(structureId: number, type: string): Observable<StructureFolder[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/structureFolders/structure/' + structureId + "/" + type, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  createPrivateGroup(privateGroup: PrivateGroup): Observable<PrivateGroup> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/privateGroup', privateGroup, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  createPrivateGroupUser(privateGroupUsers: PrivateGroupUser[]): Observable<PrivateGroupUser[]>{
    if (environment.production) {
      return this._http.post(this._apiUrl + '/privateGroup/groupUser', privateGroupUsers, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getPrivateGroups(type: number): Observable<PrivateGroup[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/privateGroup/list/' + type, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getPrivateGroup(id: number): Observable<PrivateGroup> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/privateGroup/' + id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getPrivateGroupUser(id: number): Observable<PrivateGroupUser> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/privateGroup/groupUser/' + id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

 updatePrivateGroup(privateGroup: PrivateGroup): Observable<PrivateGroup> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/privateGroup', privateGroup, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updatePrivateGroupUser(privateGroupUser: PrivateGroupUser): Observable<PrivateGroupUser> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/privateGroup/groupUser', privateGroupUser, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  deletePrivateGroup(id: number): Observable<boolean> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/privateGroup/delete/' + id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  deletePrivateGroupUser(id: number): Observable<boolean> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/privateGroup/groupUser/delete/' + id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
