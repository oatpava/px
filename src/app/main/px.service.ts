import { Injectable, } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'
import * as FileSaver from 'file-saver'

import { LoggerService } from './logger.service'

import { FileUploader } from 'ng2-file-upload'
import { FileAttach } from './model/file-attach.model'
// import { FileAttachList } from './model/file-attach-list.model'
// import { TempTable } from './model/temp-table.model'
import * as crypto from 'crypto-js'
import { ParamSarabanService } from '../saraban/service/param-saraban.service'
import { FileAttachApprove } from './model/file-attach-approve.model'

@Injectable()
export class PxService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(
    private _http: Http,
    private loggerService: LoggerService,
    private _paramSarabanService: ParamSarabanService
  ) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.getToken())
    this._options = new RequestOptions({ headers: this._headers })
    // let params = new URLSearchParams()
    // params.set('t', ''+new Date().getTime())
    // this._options.search = params
  }

  createObservable(data: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(data)
      observer.complete()
    })
  }

  verifyResponseArray(data: any): Observable<any>[] {
    let result: Observable<any>[] = []
    if (data === null) result = []
    else result = data
    return result
  }

  convertStringToDate(input: string): Object {
    // let input1: string = '01/03/2560 15:28:10'
    // console.log('input',input)
    if (input === null || input === '') return null
    let inputArray: string[] = input.split(' ')
    let inputDate: string = inputArray[0]
    let inputTime: string = ''
    if (inputArray.length >= 2) inputTime = inputArray[1]
    let inputDateArray: string[] = inputDate.split('/')
    let date = +inputDateArray[0]
    let inputMounth = (+inputDateArray[1])
    let inputYear = (+inputDateArray[2])
    return { date: { year: inputYear, month: inputMounth, day: date } }
  }

  uploadFileAttachExcel(uploader: FileUploader, fileAttachDetail: FileAttach) {
    let params = {
      url: this._apiUrl + '/v1/fileAttachs',
      authTokenHeader: 'px-auth-token',
      authToken: this.getToken(),
      additionalParameter: fileAttachDetail
    }
    // fileAttachDetail. options.additionalParameter
    // uploader.onBuildItemForm = function(fileItem, form){ 
    //   form.append('linkId', fileAttachDetail.linkId)
    //   form.append('linkType', fileAttachDetail.linkType)
    //   return {fileItem, form}
    // };
    console.log('--etc--', uploader.queue.length)
    console.log('--fileAttachDetail--', fileAttachDetail)
    uploader.setOptions(params)
    console.log('--uploader--', uploader)
    uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false
    }
    return uploader.uploadAll()
  }

  uploadFileAttach(uploader: FileUploader, fileAttachDetail: FileAttach): any {
    console.log('--- uploadFileAttach ---')
    let params = {
      url: this._apiUrl + '/v1/fileAttachs',
      authTokenHeader: 'px-auth-token',
      authToken: this.getToken(),
      additionalParameter: fileAttachDetail,
      t: '' + new Date().getTime()
    }
    uploader.setOptions(params)
    uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false
    }
    uploader.uploadAll()
    return uploader
  }

  getFileAttachs(linkType: string, linkId: number, dir: string): Observable<FileAttach[]> {//defualt dir = 'asc'/wfe dir = 'desc'
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.encrypt('version=1.0&offset=0&limit=200&sort=orderNo&dir=' + dir))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/fileAttachs/linkType/' + linkType + '/linkId/' + linkId, this._options)
        .map((response: Response) => {
          return this.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
      return
    }
  }

  deleteFileAttachs(deleteFileAttachs: FileAttach[]) {
    if (environment.production) {
      this._options.search = null
      let listHttp: any[] = []
      if (deleteFileAttachs.length > 0) {
        deleteFileAttachs.forEach((delFile: FileAttach) => {
          listHttp.push(this._http.delete(this._apiUrl + '/v1/fileAttachs/' + delFile.id, this._options).map(res => res.json()))
          // this._http.delete(this._apiUrl+'/v1/fileAttachs/'+delFile.id,this._options).map(res => res.json())
        })
        return Observable.forkJoin(listHttp)
          .map((data: any[]) => {
            return this.verifyResponseArray(data)
          })
      } else {
        return this.createObservable(deleteFileAttachs)
      }
    } else {
      console.log('deleteFileAttachs not implement for depvelop. - O')
      return this.createObservable(deleteFileAttachs)
    }
  }

  downloadFileAttach(fileAttach: FileAttach) {
    window.open(this._apiUrl + '/v1/fileAttachs/' + fileAttach.id + '/dl?version=1&api_key=praXis')
  }

  crateTmpFile(fileAttach: FileAttach): Observable<any> {
    return this._http.get(this._apiUrl + '/v1/fileAttachs/' + fileAttach.id + '/dl', this._options)
      .map((response: Response) => {
        return
      })
      .catch(this.loggerService.handleError)
  }

  updateFileAttachVersionControl(uploader: FileUploader, fileAttachId: number) {
    let params = {
      url: this._apiUrl + '/v1/fileAttachs/versionControl/' + fileAttachId,
      authTokenHeader: 'px-auth-token',
      authToken: this.getToken(),
      // additionalParameter: fileAttachDetail
    }

    // console.log('--etc--',uploader.queue.length)
    //  console.log('--fileAttachDetail--',fileAttachDetail)
    uploader.setOptions(params)
    console.log('--uploader--', uploader)
    uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false
    }
    return uploader.uploadAll()
  }

  updateFileAttach(updatedFileAttach: FileAttach) {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/fileAttachs/update/' + updatedFileAttach.id, updatedFileAttach, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {

    }
  }

  // uploadFileAttachsByItem(uploader: FileUploader, fileAttachDetail: FileAttach, index: number): any {
  //   let params = {
  //     url: this._apiUrl + '/v1/fileAttachs',
  //     authTokenHeader: 'px-auth-token',
  //     authToken: this.getToken(),
  //     additionalParameter: fileAttachDetail,
  //     t: '' + new Date().getTime()
  //   }
  //   uploader.setOptions(params)
  //   uploader.onBeforeUploadItem = (item) => {
  //     item.withCredentials = false
  //   }
  //   console.log("index ",index)
  //   console.log("secret ", fileAttachDetail.secrets)
  //   console.log("ref ", fileAttachDetail.referenceId)
  //   console.log("uploader", uploader.queue[index])
  //   console.log("+++++++++++")
  //   return uploader.uploadItem(uploader.queue[index])
  // }
  uploadFileAttachsByItem(uploader: FileUploader, fileAttachDetail: FileAttach, index: number): any {
    let params = {
      url: this._apiUrl + '/v1/fileAttachs/createList',
      authTokenHeader: 'px-auth-token',
      authToken: this.getToken(),
      additionalParameter: fileAttachDetail
    }
    uploader.setOptions(params)
    uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false
    }
    return uploader.uploadItem(uploader.queue[index])
  }

  uploadList(uploader: FileUploader, fileAttachDetail: FileAttach): FileUploader { //not work, up3 dai 2 sometimes
    let params = {
      url: this._apiUrl + '/v1/fileAttachs/createList',
      authTokenHeader: 'px-auth-token',
      authToken: this.getToken(),
      additionalParameter: fileAttachDetail,
    }
    uploader.setOptions(params)
    uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false
    }
    console.log("uploadList", uploader.queue)
    uploader.uploadAll()
    return uploader
  }

  updateFileAttach2(updatedFileAttach: FileAttach, ecms: number): Observable<any> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/fileAttachs/update2/' + ecms, updatedFileAttach, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {

    }
  }

  // updateLinkType(linkId: number) {
  //   if (environment.production) {
  //     let fileAttach_tmp = new FileAttach()
  //     fileAttach_tmp.linkId = linkId
  //     return this._http.put(this._apiUrl + '/v1/fileAttachs/updateLinkType/', fileAttach_tmp, { headers: this._headers })
  //       .map((response: Response) => {
  //         return response.json().data
  //       })
  //       .catch(this.loggerService.handleError)
  //   } else {

  //   }
  // }

  report(reportName: string, reportOutput: string, params = new URLSearchParams()) {
    const url = environment.reportServer + params.toString() + '&_flowId=viewReportFlow&standAlone=true&_flowId=viewReportFlow&ParentFolderUri=%2Freports%2F' + environment.reportSite + '&reportUnit=%2Freports%2F' + environment.reportSite + '%2F' + reportName + '&j_acegi_security_check&j_username=' + environment.reportUser + '&j_password=' + environment.reportPass + '&decorate=no&output=' + reportOutput
    window.open(url, 'report')
  }

  // getFileAttachsAfterAdd(linkType: string, linkId: number, secrets: number[]): Observable<FileAttach[]> {
  //   let params = new URLSearchParams()
  //   params.set('version', '1.0')
  //   params.set('offset', '0')
  //   params.set('limit', '200')
  //   params.set('sort', 'orderNo')
  //   params.set('dir', 'asc')
  //   params.set('t', '' + new Date().getTime())
  //   if (environment.production) {
  //     this._options.search = params
  //     return this._http.post(this._apiUrl + '/v1/fileAttachs/afterAdd/linkType/' + linkType + '/linkId/' + linkId, secrets, this._options)
  //       .map((response: Response) => {
  //         return this.verifyResponseArray(response.json().data)
  //       })
  //       .catch(this.loggerService.handleError)
  //   } else {
  //     return
  //   }
  // }

  updateESFolderId(contentId: number) {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/fileAttachs/updateESFolderId/' + contentId, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getFileAttachsNoLogin(linkType: string, linkId: number): Observable<FileAttach[]> {
    this._headers.set('px-auth-token', this.getToken())
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.encrypt('version=1.0&offset=0&limit=200&sort=orderNo&dir=asc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/fileAttachs/linkType/' + linkType + '/linkId/' + linkId, this._options)
        .map((response: Response) => {
          return this.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
      return
    }
  }

  updateWfe(linkId: number, outboxId: number) {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/fileAttachs/updateWfe/' + linkId + '/' + outboxId, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {

    }
  }

  encrypt(paramString: string): string {
    return btoa(crypto.AES.encrypt(paramString, environment.key).toString())
  }

  createEmptyData(linkType: string, linkId: number, referenceId: number) {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/fileAttachs/createEmptyData/' + linkType + '/' + linkId + '/' + referenceId, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {

    }
  }

  checkHaveAttach(attachId: number) {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/fileAttachs/checkHaveAttach/' + attachId, this._options)
        .map((response: Response) => {
          return response.json()
        })
        .catch(this.loggerService.handleError)
    } else {

    }
  }

  getExpiredPath(fileAttach: any): string {
    //http://127.0.0.1:83/document/Temp/dms/EXT45/45139.PDF
    const tmp: string[] = fileAttach.url.split('/document/Temp/')

    const uri: string = '/viewFile/' + tmp[1].replace(fileAttach.linkType + '/', '')
    const expires: string = (Math.ceil(Date.now() / 1000) + 1).toString()
    const md5: string = this.generateSecurePathHash(expires, uri, this._paramSarabanService.clientIp)
    return tmp[0] + uri + '?linkType=' + fileAttach.linkType + '&md5=' + md5 + '&expires=' + expires
  }

  private generateSecurePathHash(expires: string, uri: string, clientIp: string): string {
    const base64Value: string = crypto.MD5(expires + uri + clientIp + ' ' + 'oatis').toString(crypto.enc.Base64)
    return base64Value.replace(/\=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  }

  getToken(): any {
    return this._paramSarabanService.token
  }

  checkpassword(username: string, password: string): Observable<boolean> {
    let params = new URLSearchParams()
    params.set('q', this.encrypt(`version=1.0&username=${username}&password=${password}`))
    this._options.search = params
    
    return this._http.get(this._apiUrl + '/v1/users/checkPassword', this._options)
      .map((response: Response) => {
        return this.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

}
