import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { User } from '../model/user.model'
import { UserProfile } from '../model/user-profile.model'
import { UserProfileFolder } from '../model/user-profile-folder.model'

@Injectable()
export class UserProfileService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getUserProfiles(version: string, offset: string, limit: string, sort: string, dir: string) {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
        + '&sort=' + sort + '&dir=' + dir))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  getUserProfilesByUserId(userId: number): Observable<UserProfile[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/users/' + userId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  getDefaultUserProfilesByUserId(userId: number, version: string): Observable<UserProfile> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/users/' + userId + "/default", this._options)
        .map((response: Response) => {
          return response.json().data as UserProfile
        })
        .catch(this.loggerService.handleError)
    }
  }

  getUserProfile(userProfileId: number, version: string): Observable<UserProfile> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/' + userProfileId, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  createUserProfile(newUserProfile: UserProfile): Observable<UserProfile> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/userProfiles', newUserProfile, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  updateUserProfile(updateUserProfile: UserProfile): Observable<UserProfile> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/userProfiles/' + updateUserProfile.id, updateUserProfile, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as UserProfile//User
        })
        .catch(this.loggerService.handleError)
    }
  }

  deleteUserProfile(deleteUser: User): Observable<boolean> {
    let result: boolean = false
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/v1/userProfiles/users/' + deleteUser.id, { headers: this._headers })
        .map((response: Response) => {
          return true
        })
        .catch(this.loggerService.handleError)
    }
  }

  setDefaultProfile = (defaultUserProfile: UserProfile): Observable<UserProfile> => {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/userProfiles/change/' + defaultUserProfile.id, {}, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  createUserProfileFolder(userProfileFolder: UserProfileFolder): Observable<UserProfileFolder> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/userProfileFolders', userProfileFolder, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(userProfileFolder)
    }
  }

  updateUserProfileFolder(userProfileFolder: UserProfileFolder) {
    return this._http.put(this._apiUrl + '/v1/userProfileFolders/' + userProfileFolder.id, userProfileFolder, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  deleteUserProfileFolder(userProfileFolder: UserProfileFolder): Observable<UserProfileFolder> {
    return this._http.delete(this._apiUrl + '/v1/userProfileFolders/' + userProfileFolder.id, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  searchUserProfilesByFullName(version: string, offset: string, limit: string, sort: string, dir: string, fullName: string, userName: string): Observable<any> {
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir + '&userProfileFirstName=' + fullName + '&userProfile=' + userName))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/userProfiles/search", this._options)
      .map((response: Response) => {
        console.log(response.json().data)
        return this.pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this.loggerService.handleError)
  }

  convertDateFormat(user: User): User {
    var newUser: User = user
    newUser.activeDate = user.activeDate.formatted
    if (user.expireDate !== null) newUser.expireDate = user.expireDate.formatted
    if (user.passwordExpireDate !== null) newUser.passwordExpireDate = user.passwordExpireDate.formatted
    return newUser
  }

  changeUserProfile(updateUserProfile: UserProfile): Observable<UserProfile> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/userProfiles/change/' + updateUserProfile.id, updateUserProfile, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    }
  }

  lockUser(id): Observable<UserProfile> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/users/lockUser/' + id, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    }
  }

  checkUserCode(code, id) {
    return this._http.get(this._apiUrl + "/v1/userProfiles/checkDup/" + code + '/id/' + id, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this.loggerService.handleError)
  }


  getUserStatus(): Observable<any[]> {
    return this._http.get(this._apiUrl + "/v1/userStatuss", this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this.loggerService.handleError)
  }

  userImport(version: string, fileId: any): Observable<any> {
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=' + version + '&fileId=' + fileId))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/userProfiles/importFileExcel", this._options)
      .map((response: Response) => {
        return response.json()
      })
      .catch(this.loggerService.handleError)
  }

  getUserprofileConvert(version: string, offset: string, limit: string, sort: string, dir: string): Observable<any> {
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/userProfiles/convert", this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this.loggerService.handleError)
  }


  searchUserprofileConvert(search: any, version: string, offset: string, limit: string, sort: string, dir: string): Observable<any> {
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir
      + '&vstatus=' + search.vstatus + '&userCode=' + search.userCode + '&fullName=' + search.fullName
      + '&positionName=' + search.positionName + '&structureCode=' + search.structureCode
      + '&structureName=' + search.structureName + '&strucShortName=' + search.strucShortName))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/userProfiles/convert", this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this.loggerService.handleError)
  }


  convertUserprofile(data: any[]): Observable<UserProfile[]> {
    return this._http.put(this._apiUrl + '/v1/userProfiles/updateConvert', data, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  searchVUserByName(name: string): Observable<UserProfile[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('fullName=' + name + '&sort=createdDate&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/hris/name', this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  getlistStatusByStucture(parentKey: string, jobType: string): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/userStatus/' + parentKey + '/report/' + jobType, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

}
