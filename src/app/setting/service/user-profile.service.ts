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
import { UserProfile } from '../model/user-profile.model'
import { USERPROFILES } from '../model/user-profile-mock'
import { Structure } from '../model/structure.model'
import { STRUCTTURES } from '../model/structure-mock'
import { UserProfileFolder } from '../model/user-profile-folder.model'
import { UserStatus } from '../model/user-status.model'

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

  // getDepartments(): Observable<Structure[]> {
  //   console.log('getDepartments waiting use rest. - O')
  //   if (environment.production) {
  //     return this.pxService.createObservable(STRUCTTURES)
  //   } else {
  //     return this.pxService.createObservable(STRUCTTURES)
  //   }
  // }

  //   createUser(newUser: User): Observable<User> {
  //     // console.log('createUser waiting use rest. - O',newUser)
  //     if (environment.production) {
  //       let lastId = USERS.length
  //       newUser.id = ++lastId
  //       // newUser = this.convertDateFormat(newUser)
  //       // console.log(newUser)
  //       USERS.push(newUser)
  //       // newUser = this.convertDateFormat(newUser)
  // // console.log('result newUser',newUser)
  //       return this.pxService.createObservable(newUser)
  //     } else {
  //       let lastId = USERS.length
  //       newUser.id = ++lastId
  //       USERS.push(newUser)
  //       return this.pxService.createObservable(newUser)
  //     }
  //   }

  // getUser(userId: number): Observable<User> {
  //   console.log('getUser waiting use rest. - O')
  //   if (environment.production) {
  //     return this.pxService.createObservable(USERS.filter(user => user.id === userId)[0])
  //   } else {
  //     return this.pxService.createObservable(USERS.filter(user => user.id === userId)[0])
  //   }
  // }

  // updateUser(updateUser: User): Observable<User> {
  //   console.log('updateUser waiting use rest. - O')
  //   // console.log(updateUser)
  //   if (environment.production) {
  //     let indexRemoved: number = USERS.indexOf(updateUser)
  //     USERS.splice(indexRemoved, 1, updateUser)
  //     return this.pxService.createObservable(updateUser)
  //   } else {
  //     let indexRemoved: number = USERS.indexOf(updateUser)
  //     USERS.splice(indexRemoved, 1, updateUser)
  //     return this.pxService.createObservable(updateUser)
  //   }
  // }

  // deleteUser(deleteUser: User): Observable<boolean> {
  //   console.log('deleteUser waiting use rest. - O')
  //   let result: boolean = false
  //   if (environment.production) {

  //   } else {
  //     let indexRemovedFolder: number = USERS.indexOf(deleteUser)
  //     USERS.splice(indexRemovedFolder, 1)
  //     return this.pxService.createObservable(result)
  //   }
  // }

  // updateUserPassword(updateUser: User, newPassword: string): boolean {
  //   console.log('updateUserPassword waiting coding. - O')
  //   return false
  // }

  getUserProfiles(version: string, offset: string, limit: string, sort: string, dir: string) {
    // console.log('getUserProfiles waiting use rest. - O')
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
      // return this.pxService.createObservable(USERPROFILES)
    } else {
      return this.pxService.createObservable(USERPROFILES)
    }
  }

  getUserProfilesByUserId(userId: number): Observable<UserProfile[]> {
    // console.log('getUserProfilebyuserId waiting use rest. - O')
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/users/' + userId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
      // return this.pxService.createObservable(USERPROFILES)
      return this.pxService.createObservable(USERPROFILES.filter(userProfile => userProfile.user.id === userId))
    }
  }

  // getOneUserProfilesByUserId(userId: number, version: string): Observable<UserProfile> {
  //   // console.log('getUserProfilebyuserId waiting use rest. - O')
  //   if (environment.production) {
  //     let params = new URLSearchParams()
  //     params.set('q', this.pxService.encrypt('version=1.0'))
  //     this._options.search = params
  //     return this._http.get(this._apiUrl + '/v1/userProfiles/user/' + userId, this._options)
  //       .map((response: Response) => {
  //         return response.json().data
  //       })
  //       .catch(this.loggerService.handleError)
  //   } else {
  //     // return this.pxService.createObservable(USERPROFILES)
  //     return this.pxService.createObservable(USERPROFILES.filter(userProfile => userProfile.user.id === userId))
  //   }
  // }

  getDefaultUserProfilesByUserId(userId: number, version: string): Observable<UserProfile> {
    // console.log('getUserProfilebyuserId waiting use rest. - O')
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/users/' + userId + "/default", this._options)
        .map((response: Response) => {
          return response.json().data as UserProfile
        })
        .catch(this.loggerService.handleError)
    } else {
      // return this.pxService.createObservable(USERPROFILES)
      return this.pxService.createObservable(USERPROFILES.filter(userProfile => userProfile.user.id === userId))
    }
  }

  getUserProfile(userProfileId: number, version: string): Observable<UserProfile> {
    // console.log('getUserProfile waiting use rest. - O',USERPROFILES,userProfileId)
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/' + userProfileId, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(USERPROFILES.filter(userProfile => userProfile.id === 1)[0])
      // return this.pxService.createObservable(USERPROFILES.filter(UserProfile => UserProfile.userId === userId))
    }
  }

  createUserProfile(newUserProfile: UserProfile): Observable<UserProfile> {
    // console.log('createUserProfile waiting use rest. - O')
    // console.log(newUserProfile)
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/userProfiles', newUserProfile, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      let lastId = USERPROFILES.length
      newUserProfile.id = ++lastId
      USERPROFILES.push(newUserProfile)
      return this.pxService.createObservable(newUserProfile)
    }
  }
  // getUserProfile(){
  //   console.log('waiting coding. - O')
  // }
  updateUserProfile(updateUserProfile: UserProfile): Observable<UserProfile> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/userProfiles/' + updateUserProfile.id, updateUserProfile, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as UserProfile//User
        })
        .catch(this.loggerService.handleError)
    } else {
      let indexRemovedProfile: number = USERPROFILES.indexOf(updateUserProfile)
      USERPROFILES.splice(indexRemovedProfile, 1, updateUserProfile)
      return this.pxService.createObservable(USERPROFILES)
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
    } else {
      let indexRemovedFolder: number = USERS.indexOf(deleteUser)
      USERS.splice(indexRemovedFolder, 1)
      return this.pxService.createObservable(result)
    }
  }

  setDefaultProfile = (defaultUserProfile: UserProfile): Observable<UserProfile> => {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/userProfiles/change/' + defaultUserProfile.id, {}, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      let indexRemovedProfile: number = USERPROFILES.indexOf(defaultUserProfile)
      USERPROFILES.splice(indexRemovedProfile, 1, defaultUserProfile)
      return this.pxService.createObservable(USERPROFILES)
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

  // createOtherUserProfile(newUserProfile: UserProfile): Observable<UserProfile> {
  //   // console.log('createUserProfile waiting use rest. - O')
  //   // console.log(newUserProfile)
  //   if (environment.production) {
  //     return this._http.post(this._apiUrl + '/v1/userProfiles/' + newUserProfile.user.id + '/userProfile', newUserProfile, this._options)
  //       .map((response: Response) => {
  //         return response.json().data
  //       })
  //       .catch(this.loggerService.handleError)
  //   } else {
  //     let lastId = USERPROFILES.length
  //     newUserProfile.id = ++lastId
  //     USERPROFILES.push(newUserProfile)
  //     return this.pxService.createObservable(newUserProfile)
  //   }
  // }

  changeUserProfile(updateUserProfile: UserProfile): Observable<UserProfile> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/userProfiles/change/' + updateUserProfile.id, updateUserProfile, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    } else {

    }
  }

  lockUser(id): Observable<UserProfile> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/users/lockUser/' + id, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as User
        })
        .catch(this.loggerService.handleError)
    } else {

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
    } else {
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
    } else {
        // return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
    }
  }


}
