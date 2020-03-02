import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { Document } from '../model/document.model'
import { Search } from '../model/search.model'
import { DOCUMENTS, DOCUMENTSEARCHS } from '../model/document.mock'
import { FileAttach } from '../../main/model/file-attach.model'
import { UserProfile } from '../../setting/model/user-profile.model'
import { USERPROFILES } from '../../setting/model/user-profile-mock'
import { email } from '../model/email.model'
import { ReportInput } from '../model/ReportInput.model';

@Injectable()
export class DocumentService {
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
    
    let params = new URLSearchParams()
    params.set('t', ''+new Date().getTime())
    this._options.search = params
    // ''+new Date().getTime()
  }

  getDocuments(folderId: number,offset:any,limit:any): Observable<any> {
    // console.log('getDocuments waiting use rest. - O')
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=desc&offset=' + offset + '&limit=' + limit + '&folderId=' + folderId))
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/dmsDocuments/folder/' + folderId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.documentFolderId === folderId))
    }
  }

  getDocumentsExp(folderId: number): Observable<Document[]> {
    // console.log('getDocuments waiting use rest. - O')
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('offset', '0')
    params.set('limit', '1000')
    params.set('sort', 'createdDate')
    params.set('dir', 'desc')
    params.set('folderId', '' + folderId)
    params.set('t', ''+new Date().getTime())
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/dmsDocuments/exp/' + folderId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.documentFolderId === folderId))
    }
  }

  createDocument(newDoc: Document): Observable<Document> {
    // console.log('createDocument waiting use rest. - O')
    // console.log(newDoc)
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/dmsDocuments', newDoc, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      let lastId = DOCUMENTS.length
      newDoc.id = lastId++
      DOCUMENTS.push(newDoc)
      return this.pxService.createObservable(newDoc)
    }
  }

  getDocument(docId: number): Observable<Document> {
    // console.log('getDocument waiting use rest. - '+docId)
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=1.0'))
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/dmsDocuments/' + docId, this._options)
        .map((response: Response) => {
          return response.json().data as Document
        })
        .catch(this.loggerService.handleError)
    } else {
      // console.log(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId))
      return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId)[0])

    }
  }

  updateDocument(updatedDoc: Document) {
    // console.log('updateDocument waiting use rest. - O')
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/dmsDocuments/' + updatedDoc.id, updatedDoc, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as Document
        })
        .catch(this.loggerService.handleError)
    } else {
      let indexRemoved: number = DOCUMENTS.indexOf(updatedDoc)
      DOCUMENTS.splice(indexRemoved, 1, updatedDoc)
      return this.pxService.createObservable(DOCUMENTS)
    }
  }

  deleteDocument(deleteDocument: Document): Observable<boolean> {
    // console.log('deleteDocument waiting use rest. - O')
    let result: boolean = false
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/v1/dmsDocuments/' + deleteDocument.id, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      let indexRemoved: number = DOCUMENTS.indexOf(deleteDocument)
      DOCUMENTS.splice(indexRemoved, 1)
      return this.pxService.createObservable(result)
    }
  }

  convertDateFormat(dmsDocument: Document): Document {
    let newDocument: Document = dmsDocument
    newDocument.createdDate = dmsDocument.createdDate.formatted
    newDocument.documentPublicDate = dmsDocument.documentPublicDate.formatted
    if (newDocument.documentExpireDate != null)
      newDocument.documentExpireDate = dmsDocument.documentExpireDate.formatted

    if (newDocument.documentDate01 != null)
      newDocument.documentDate01 = dmsDocument.documentDate01.formatted
    if (newDocument.documentDate02 != null)
      newDocument.documentDate02 = dmsDocument.documentDate02.formatted
    if (newDocument.documentDate03 != null)
      newDocument.documentDate03 = dmsDocument.documentDate03.formatted
    if (newDocument.documentDate04 != null)
      newDocument.documentDate04 = dmsDocument.documentDate04.formatted
    return newDocument
  }

  searchDocument(dataSearch: any): Observable<Document[]> {
    // let params = new URLSearchParams()
    // params.set('version', '1.0')
    // dataSearch['version'] = 1

    // console.log(dataSearch)
    // console.log(dataSearch.documentName)
    let newDataSearch: Search = new Search();
    newDataSearch.folderId = dataSearch.folderId
    //  newDataSearch.version =1
    // console.log(dataSearch.documentName)
    if (dataSearch.documentName === undefined) { newDataSearch.documentName = ''; } else { newDataSearch.documentName = dataSearch.documentName }

    if (dataSearch.createdDateForm === undefined) { newDataSearch.createdDateForm = ''; } else { newDataSearch.createdDateForm = dataSearch.createdDateForm.formatted }
    if (dataSearch.createdDateTo === undefined) { newDataSearch.createdDateTo = ''; } else { newDataSearch.createdDateTo = dataSearch.createdDateTo.formatted }
    if (dataSearch.createdBy === undefined) { newDataSearch.createdBy = ''; } else { newDataSearch.createdBy = dataSearch.createdBy }

    if (dataSearch.updatedDateForm === undefined) { newDataSearch.updatedDateForm = ''; } else { newDataSearch.updatedDateForm = dataSearch.updatedDateForm.formatted }
    if (dataSearch.updatedDateTo === undefined) { newDataSearch.updatedDateTo = ''; } else { newDataSearch.updatedDateTo = dataSearch.updatedDateTo.formatted }
    if (dataSearch.updatedBy === undefined) { newDataSearch.updatedBy = ''; } else { newDataSearch.updatedBy = dataSearch.updatedBy }

    if (dataSearch.documentExpireDateForm === undefined) { newDataSearch.documentExpireDateForm = ''; } else { newDataSearch.documentExpireDateForm = dataSearch.documentExpireDateForm.formatted }
    if (dataSearch.documentExpireDateTo === undefined) { newDataSearch.documentExpireDateTo = ''; } else { newDataSearch.documentExpireDateTo = dataSearch.documentExpireDateTo.formatted }

    if (dataSearch.documentDate01Form === undefined) { newDataSearch.documentDate01Form = ''; } else { newDataSearch.documentDate01Form = dataSearch.documentDate01Form.formatted }
    if (dataSearch.documentDate01To === undefined) { newDataSearch.documentDate01To = ''; } else { newDataSearch.documentDate01To = dataSearch.documentDate01To.formatted }
    if (dataSearch.documentDate02Form === undefined) { newDataSearch.documentDate02Form = ''; } else { newDataSearch.documentDate02Form = dataSearch.documentDate02Form.formatted }
    if (dataSearch.documentDate02To === undefined) { newDataSearch.documentDate02To = ''; } else { newDataSearch.documentDate02To = dataSearch.documentDate02To.formatted }
    if (dataSearch.documentDate03Form === undefined) { newDataSearch.documentDate03Form = ''; } else { newDataSearch.documentDate03Form = dataSearch.documentDate03Form.formatted }
    if (dataSearch.documentDate03To === undefined) { newDataSearch.documentDate03To = ''; } else { newDataSearch.documentDate03To = dataSearch.documentDate03To.formatted }
    if (dataSearch.documentDate04Form === undefined) { newDataSearch.documentDate04Form = ''; } else { newDataSearch.documentDate04Form = dataSearch.documentDate04Form.formatted }
    if (dataSearch.documentDate04To === undefined) { newDataSearch.documentDate04To = ''; } else { newDataSearch.documentDate04To = dataSearch.documentDate04To.formatted }

    if (dataSearch.documentFloat01 === undefined) { newDataSearch.documentFloat01 = 0; } else { newDataSearch.documentFloat01 = Number(dataSearch.documentFloat01) }
    if (dataSearch.documentFloat02 === undefined) { newDataSearch.documentFloat02 = 0; } else { newDataSearch.documentFloat02 = Number(dataSearch.documentFloat02) }

    if (dataSearch.documentInt01 === undefined) { newDataSearch.documentInt01 = 0; } else { newDataSearch.documentInt01 = Number(dataSearch.documentInt01) }
    if (dataSearch.documentInt02 === undefined) { newDataSearch.documentInt02 = 0; } else { newDataSearch.documentInt02 = Number(dataSearch.documentInt02) }
    if (dataSearch.documentInt03 === undefined) { newDataSearch.documentInt03 = 0; } else { newDataSearch.documentInt03 = Number(dataSearch.documentInt03) }
    if (dataSearch.documentInt04 === undefined) { newDataSearch.documentInt04 = 0; } else { newDataSearch.documentInt04 = Number(dataSearch.documentInt04) }

    if (dataSearch.documentText01 === undefined) { newDataSearch.documentText01 = ''; } else { newDataSearch.documentText01 = dataSearch.documentText01 }
    if (dataSearch.documentText02 === undefined) { newDataSearch.documentText02 = ''; } else { newDataSearch.documentText02 = dataSearch.documentText02 }
    if (dataSearch.documentText03 === undefined) { newDataSearch.documentText03 = ''; } else { newDataSearch.documentText03 = dataSearch.documentText03 }
    if (dataSearch.documentText04 === undefined) { newDataSearch.documentText04 = ''; } else { newDataSearch.documentText04 = dataSearch.documentText04 }
    if (dataSearch.documentText05 === undefined) { newDataSearch.documentText05 = ''; } else { newDataSearch.documentText05 = dataSearch.documentText05 }

    if (dataSearch.documentVarchar01 === undefined) { newDataSearch.documentVarchar01 = ''; } else { newDataSearch.documentVarchar01 = dataSearch.documentVarchar01 }
    if (dataSearch.documentVarchar02 === undefined) { newDataSearch.documentVarchar02 = ''; } else { newDataSearch.documentVarchar02 = dataSearch.documentVarchar02 }
    if (dataSearch.documentVarchar03 === undefined) { newDataSearch.documentVarchar03 = ''; } else { newDataSearch.documentVarchar03 = dataSearch.documentVarchar03 }
    if (dataSearch.documentVarchar04 === undefined) { newDataSearch.documentVarchar04 = ''; } else { newDataSearch.documentVarchar04 = dataSearch.documentVarchar04 }
    if (dataSearch.documentVarchar05 === undefined) { newDataSearch.documentVarchar05 = ''; } else { newDataSearch.documentVarchar05 = dataSearch.documentVarchar05 }
    if (dataSearch.documentVarchar06 === undefined) { newDataSearch.documentVarchar06 = ''; } else { newDataSearch.documentVarchar06 = dataSearch.documentVarchar06 }
    if (dataSearch.documentVarchar07 === undefined) { newDataSearch.documentVarchar07 = ''; } else { newDataSearch.documentVarchar07 = dataSearch.documentVarchar07 }
    if (dataSearch.documentVarchar08 === undefined) { newDataSearch.documentVarchar08 = ''; } else { newDataSearch.documentVarchar08 = dataSearch.documentVarchar08 }
    if (dataSearch.documentVarchar09 === undefined) { newDataSearch.documentVarchar09 = ''; } else { newDataSearch.documentVarchar09 = dataSearch.documentVarchar09 }
    if (dataSearch.documentVarchar10 === undefined) { newDataSearch.documentVarchar10 = ''; } else { newDataSearch.documentVarchar10 = dataSearch.documentVarchar10 }

    if (dataSearch.documentIntComma === undefined) { newDataSearch.documentIntComma = 0; } else { newDataSearch.documentIntComma = dataSearch.documentIntComma }


    // console.log(newDataSearch)
    // console.log(dataSearch)


    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/dmsDocuments/searchDocument', newDataSearch, this._options)
        .map((response: Response) => {
          return response.json().data as Document[]
        })
        .catch(this.loggerService.handleError)

    } else {

      return this.pxService.createObservable(DOCUMENTSEARCHS)
    }

  }


  searchFolder(dataSearch: any): Observable<Document[]> {
    // let params = new URLSearchParams()
    // params.set('version', '1.0')
    // dataSearch['version'] = 1

    // console.log(dataSearch)
    // console.log(dataSearch.documentName)
    let newDataSearch: Search = new Search();
    newDataSearch.folderId = dataSearch.folderId
    //  newDataSearch.version =1
    // console.log(dataSearch.documentName)
    if (dataSearch.documentName === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentName = ''; } else { newDataSearch.documentName = dataSearch.documentName }

    if (dataSearch.createdDateForm === undefined || dataSearch.documentName === 'undefined') { newDataSearch.createdDateForm = ''; } else { newDataSearch.createdDateForm = dataSearch.createdDateForm }
    if (dataSearch.createdDateTo === undefined || dataSearch.documentName === 'undefined') { newDataSearch.createdDateTo = ''; } else { newDataSearch.createdDateTo = dataSearch.createdDateTo }
    if (dataSearch.createdBy === undefined || dataSearch.documentName === 'undefined') { newDataSearch.createdBy = ''; } else { newDataSearch.createdBy = dataSearch.createdBy }

    if (dataSearch.updatedDateForm === undefined || dataSearch.documentName === 'undefined') { newDataSearch.updatedDateForm = ''; } else { newDataSearch.updatedDateForm = dataSearch.updatedDateForm }
    if (dataSearch.updatedDateTo === undefined || dataSearch.documentName === 'undefined') { newDataSearch.updatedDateTo = ''; } else { newDataSearch.updatedDateTo = dataSearch.updatedDateTo }
    if (dataSearch.updatedBy === undefined || dataSearch.documentName === 'undefined') { newDataSearch.updatedBy = ''; } else { newDataSearch.updatedBy = dataSearch.updatedBy }

    if (dataSearch.documentExpireDateForm === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentExpireDateForm = ''; } else { newDataSearch.documentExpireDateForm = dataSearch.documentExpireDateForm }
    if (dataSearch.documentExpireDateTo === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentExpireDateTo = ''; } else { newDataSearch.documentExpireDateTo = dataSearch.documentExpireDateTo }

    if (dataSearch.documentDate01Form === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate01Form = ''; } else { newDataSearch.documentDate01Form = dataSearch.documentDate01Form }
    if (dataSearch.documentDate01To === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate01To = ''; } else { newDataSearch.documentDate01To = dataSearch.documentDate01To }
    if (dataSearch.documentDate02Form === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate02Form = ''; } else { newDataSearch.documentDate02Form = dataSearch.documentDate02Form }
    if (dataSearch.documentDate02To === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate02To = ''; } else { newDataSearch.documentDate02To = dataSearch.documentDate02To }
    if (dataSearch.documentDate03Form === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate03Form = ''; } else { newDataSearch.documentDate03Form = dataSearch.documentDate03Form }
    if (dataSearch.documentDate03To === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate03To = ''; } else { newDataSearch.documentDate03To = dataSearch.documentDate03To }
    if (dataSearch.documentDate04Form === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate04Form = ''; } else { newDataSearch.documentDate04Form = dataSearch.documentDate04Form }
    if (dataSearch.documentDate04To === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate04To = ''; } else { newDataSearch.documentDate04To = dataSearch.documentDate04To }

    if (dataSearch.documentFloat01 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentFloat01 = 0; } else { newDataSearch.documentFloat01 = Number(dataSearch.documentFloat01) }
    if (dataSearch.documentFloat02 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentFloat02 = 0; } else { newDataSearch.documentFloat02 = Number(dataSearch.documentFloat02) }

    if (dataSearch.documentInt01 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentInt01 = 0; } else { newDataSearch.documentInt01 = Number(dataSearch.documentInt01) }
    if (dataSearch.documentInt02 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentInt02 = 0; } else { newDataSearch.documentInt02 = Number(dataSearch.documentInt02) }
    if (dataSearch.documentInt03 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentInt03 = 0; } else { newDataSearch.documentInt03 = Number(dataSearch.documentInt03) }
    if (dataSearch.documentInt04 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentInt04 = 0; } else { newDataSearch.documentInt04 = Number(dataSearch.documentInt04) }

    if (dataSearch.documentText01 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText01 = ''; } else { newDataSearch.documentText01 = dataSearch.documentText01 }
    if (dataSearch.documentText02 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText02 = ''; } else { newDataSearch.documentText02 = dataSearch.documentText02 }
    if (dataSearch.documentText03 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText03 = ''; } else { newDataSearch.documentText03 = dataSearch.documentText03 }
    if (dataSearch.documentText04 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText04 = ''; } else { newDataSearch.documentText04 = dataSearch.documentText04 }
    if (dataSearch.documentText05 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText05 = ''; } else { newDataSearch.documentText05 = dataSearch.documentText05 }

    if (dataSearch.documentVarchar01 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar01 = ''; } else { newDataSearch.documentVarchar01 = dataSearch.documentVarchar01 }
    if (dataSearch.documentVarchar02 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar02 = ''; } else { newDataSearch.documentVarchar02 = dataSearch.documentVarchar02 }
    if (dataSearch.documentVarchar03 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar03 = ''; } else { newDataSearch.documentVarchar03 = dataSearch.documentVarchar03 }
    if (dataSearch.documentVarchar04 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar04 = ''; } else { newDataSearch.documentVarchar04 = dataSearch.documentVarchar04 }
    if (dataSearch.documentVarchar05 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar05 = ''; } else { newDataSearch.documentVarchar05 = dataSearch.documentVarchar05 }
    if (dataSearch.documentVarchar06 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar06 = ''; } else { newDataSearch.documentVarchar06 = dataSearch.documentVarchar06 }
    if (dataSearch.documentVarchar07 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar07 = ''; } else { newDataSearch.documentVarchar07 = dataSearch.documentVarchar07 }
    if (dataSearch.documentVarchar08 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar08 = ''; } else { newDataSearch.documentVarchar08 = dataSearch.documentVarchar08 }
    if (dataSearch.documentVarchar09 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar09 = ''; } else { newDataSearch.documentVarchar09 = dataSearch.documentVarchar09 }
    if (dataSearch.documentVarchar10 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar10 = ''; } else { newDataSearch.documentVarchar10 = dataSearch.documentVarchar10 }

    if (dataSearch.documentIntComma === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentIntComma = 0; } else { newDataSearch.documentIntComma = dataSearch.documentIntComma }
    
    if (dataSearch.fullText === undefined || dataSearch.documentName === 'undefined') { newDataSearch.fullText = ''; } else { newDataSearch.fullText = dataSearch.fullText }

    console.log('service - ',newDataSearch)
    // console.log(dataSearch)


    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/dmsDocuments/searchDocument', newDataSearch, this._options)
        .map((response: Response) => {
          return response.json().data as Document[]
        })
        .catch(this.loggerService.handleError)

    } else {

      return this.pxService.createObservable(DOCUMENTSEARCHS)
    }

  }


  getUserprofile(userprofileId: string): Observable<any> {
    console.log('getDocument waiting use rest. - O')
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=1.0'))
    let intuser = Number(userprofileId)
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/userProfiles/' + intuser, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      // return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id === docId))[0]
    }
  }

  getReport() {

  }

  getDocumentByDoctype(docId: number, folderId: number): Observable<Document[]> {
    // console.log('getDocumentByDoctype. - '+docId)
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=1.0'))
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/dmsDocuments/DocTypeId/' + docId + '/' + folderId, this._options)
        .map((response: Response) => {
          return response.json().data as Document
        })
        .catch(this.loggerService.handleError)
    } else {
      // console.log(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId))
      return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId)[0])

    }
  }

  getDocumentByDoctype2(wfTypeId: number, folderId: number): Observable<Document[]> {
    // console.log('getDocumentByDoctype. - '+docId)
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=1.0'))
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/dmsDocuments/listDocByWfDocTypeId/' + wfTypeId + '/' + folderId, this._options)
        .map((response: Response) => {
          return response.json().data as Document
        })
        .catch(this.loggerService.handleError)
    } else {
      // console.log(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId))
      return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == wfTypeId)[0])

    }
  }

  createAdocument(folderId: number,CustomerName: string, ProjectName: string): Observable<Document> {
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=1.0'))
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/dmsDocuments/createADocument/' + folderId+'/'+CustomerName+'/'+ProjectName, this._options)
        .map((response: Response) => {
          return response.json().data as Document
        })
        .catch(this.loggerService.handleError)
    } else {
      // console.log(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId))
      return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == folderId)[0])

    }

  }

  updateAdocument(docId: number, attackName: string, wfTypeId: number, flowId: number, typeCode: string, typeName: string): Observable<Document> {
    console.log('---- updateAdocument -----')
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=1.0'))
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/dmsDocuments/createADocument/' + docId + '/' + attackName + '/' + wfTypeId + '/' + typeCode + '/' + typeName + '/' + flowId, this._options)
        .map((response: Response) => {
          return response.json().data as Document
        })
        .catch(this.loggerService.handleError)
    } else {
      // console.log(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId))
      return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId)[0])

    }
  }

  searchDocumentWithDocType(dataSearch: any, docTyped: number, isWfType: String): Observable<Document[]> {
    // let params = new URLSearchParams()
    // params.set('version', '1.0')
    // dataSearch['version'] = 1

    // console.log(dataSearch)
    // console.log(dataSearch.documentName)
    let newDataSearch: Search = new Search();
    newDataSearch.folderId = dataSearch.folderId
    //  newDataSearch.version =1
    // console.log(dataSearch.documentName)
    if (dataSearch.documentName === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentName = ''; } else { newDataSearch.documentName = dataSearch.documentName }

    if (dataSearch.createdDateForm === undefined || dataSearch.documentName === 'undefined') { newDataSearch.createdDateForm = ''; } else { newDataSearch.createdDateForm = dataSearch.createdDateForm }
    if (dataSearch.createdDateTo === undefined || dataSearch.documentName === 'undefined') { newDataSearch.createdDateTo = ''; } else { newDataSearch.createdDateTo = dataSearch.createdDateTo }
    if (dataSearch.createdBy === undefined || dataSearch.documentName === 'undefined') { newDataSearch.createdBy = ''; } else { newDataSearch.createdBy = dataSearch.createdBy }

    if (dataSearch.updatedDateForm === undefined || dataSearch.documentName === 'undefined') { newDataSearch.updatedDateForm = ''; } else { newDataSearch.updatedDateForm = dataSearch.updatedDateForm }
    if (dataSearch.updatedDateTo === undefined || dataSearch.documentName === 'undefined') { newDataSearch.updatedDateTo = ''; } else { newDataSearch.updatedDateTo = dataSearch.updatedDateTo }
    if (dataSearch.updatedBy === undefined || dataSearch.documentName === 'undefined') { newDataSearch.updatedBy = ''; } else { newDataSearch.updatedBy = dataSearch.updatedBy }

    if (dataSearch.documentExpireDateForm === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentExpireDateForm = ''; } else { newDataSearch.documentExpireDateForm = dataSearch.documentExpireDateForm }
    if (dataSearch.documentExpireDateTo === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentExpireDateTo = ''; } else { newDataSearch.documentExpireDateTo = dataSearch.documentExpireDateTo }

    if (dataSearch.documentDate01Form === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate01Form = ''; } else { newDataSearch.documentDate01Form = dataSearch.documentDate01Form }
    if (dataSearch.documentDate01To === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate01To = ''; } else { newDataSearch.documentDate01To = dataSearch.documentDate01To }
    if (dataSearch.documentDate02Form === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate02Form = ''; } else { newDataSearch.documentDate02Form = dataSearch.documentDate02Form }
    if (dataSearch.documentDate02To === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate02To = ''; } else { newDataSearch.documentDate02To = dataSearch.documentDate02To }
    if (dataSearch.documentDate03Form === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate03Form = ''; } else { newDataSearch.documentDate03Form = dataSearch.documentDate03Form }
    if (dataSearch.documentDate03To === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate03To = ''; } else { newDataSearch.documentDate03To = dataSearch.documentDate03To }
    if (dataSearch.documentDate04Form === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate04Form = ''; } else { newDataSearch.documentDate04Form = dataSearch.documentDate04Form }
    if (dataSearch.documentDate04To === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentDate04To = ''; } else { newDataSearch.documentDate04To = dataSearch.documentDate04To }

    if (dataSearch.documentFloat01 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentFloat01 = 0; } else { newDataSearch.documentFloat01 = Number(dataSearch.documentFloat01) }
    if (dataSearch.documentFloat02 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentFloat02 = 0; } else { newDataSearch.documentFloat02 = Number(dataSearch.documentFloat02) }

    if (dataSearch.documentInt01 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentInt01 = 0; } else { newDataSearch.documentInt01 = Number(dataSearch.documentInt01) }
    if (dataSearch.documentInt02 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentInt02 = 0; } else { newDataSearch.documentInt02 = Number(dataSearch.documentInt02) }
    if (dataSearch.documentInt03 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentInt03 = 0; } else { newDataSearch.documentInt03 = Number(dataSearch.documentInt03) }
    if (dataSearch.documentInt04 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentInt04 = 0; } else { newDataSearch.documentInt04 = Number(dataSearch.documentInt04) }

    if (dataSearch.documentText01 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText01 = ''; } else { newDataSearch.documentText01 = dataSearch.documentText01 }
    if (dataSearch.documentText02 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText02 = ''; } else { newDataSearch.documentText02 = dataSearch.documentText02 }
    if (dataSearch.documentText03 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText03 = ''; } else { newDataSearch.documentText03 = dataSearch.documentText03 }
    if (dataSearch.documentText04 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText04 = ''; } else { newDataSearch.documentText04 = dataSearch.documentText04 }
    if (dataSearch.documentText05 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentText05 = ''; } else { newDataSearch.documentText05 = dataSearch.documentText05 }

    if (dataSearch.documentVarchar01 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar01 = ''; } else { newDataSearch.documentVarchar01 = dataSearch.documentVarchar01 }
    if (dataSearch.documentVarchar02 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar02 = ''; } else { newDataSearch.documentVarchar02 = dataSearch.documentVarchar02 }
    if (dataSearch.documentVarchar03 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar03 = ''; } else { newDataSearch.documentVarchar03 = dataSearch.documentVarchar03 }
    if (dataSearch.documentVarchar04 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar04 = ''; } else { newDataSearch.documentVarchar04 = dataSearch.documentVarchar04 }
    if (dataSearch.documentVarchar05 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar05 = ''; } else { newDataSearch.documentVarchar05 = dataSearch.documentVarchar05 }
    if (dataSearch.documentVarchar06 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar06 = ''; } else { newDataSearch.documentVarchar06 = dataSearch.documentVarchar06 }
    if (dataSearch.documentVarchar07 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar07 = ''; } else { newDataSearch.documentVarchar07 = dataSearch.documentVarchar07 }
    if (dataSearch.documentVarchar08 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar08 = ''; } else { newDataSearch.documentVarchar08 = dataSearch.documentVarchar08 }
    if (dataSearch.documentVarchar09 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar09 = ''; } else { newDataSearch.documentVarchar09 = dataSearch.documentVarchar09 }
    if (dataSearch.documentVarchar10 === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentVarchar10 = ''; } else { newDataSearch.documentVarchar10 = dataSearch.documentVarchar10 }

    if (dataSearch.documentIntComma === undefined || dataSearch.documentName === 'undefined') { newDataSearch.documentIntComma = 0; } else { newDataSearch.documentIntComma = dataSearch.documentIntComma }


    console.log(newDataSearch)
    // console.log(dataSearch)


    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=asc&offset=0&limit=1000'))
      return this._http.post(this._apiUrl + '/v1/dmsDocuments/searchDocumentWithDocType/'+docTyped+'/'+isWfType, newDataSearch, this._options)
        .map((response: Response) => {
          return response.json().data as Document[]
        })
        .catch(this.loggerService.handleError)

    } else {

      return this.pxService.createObservable(DOCUMENTSEARCHS)
    }

  }


  updateFileAttach(updatedFileAttach: FileAttach) {
    // console.log('updateDocument waiting use rest. - O')
    console.log('updateAtt',updatedFileAttach)
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/fileAttachs/update/' + updatedFileAttach.id, updatedFileAttach, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data 
        })
        .catch(this.loggerService.handleError)
    } else {
     
    }
  }

  createCreateDocument(newDoc: Document): Observable<Document> {
    // console.log('createDocument waiting use rest. - O')
    // console.log(newDoc)
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/dmsDocuments/createCreate', newDoc, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
      let lastId = DOCUMENTS.length
      newDoc.id = lastId++
      DOCUMENTS.push(newDoc)
      return this.pxService.createObservable(newDoc)
    }
  }

  updateCreateDocument(updatedDoc: Document) {
    // console.log('updateDocument waiting use rest. - O')
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/dmsDocuments/createUpdate/' + updatedDoc.id, updatedDoc, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data as Document
        })
        .catch(this.loggerService.handleError)
    } else {
      let indexRemoved: number = DOCUMENTS.indexOf(updatedDoc)
      DOCUMENTS.splice(indexRemoved, 1, updatedDoc)
      return this.pxService.createObservable(DOCUMENTS)
    }
  }

  moveDocument(listdocId: String , folderId:number) {
    // console.log('getDocument waiting use rest. - '+docId)
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=1.0'))
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/dmsDocuments/' + listdocId+'/'+folderId, this._options)
        .map((response: Response) => {
          return response.json()
        })
        .catch(this.loggerService.handleError)
    } else {
      // console.log(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId))
      // return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId)[0])

    }
  }

  getUserProfile(userProfileId: number,version: string): Observable<UserProfile>{
    // console.log('getUserProfile waiting use rest. - O',USERPROFILES,userProfileId)
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('version=' + version))
    if (environment.production) {
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

  sendEmail(emailData: email) {
    // console.log('getDocument waiting use rest. - '+docId)
   
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/dmsDocuments/sendEmail', emailData, this._options)
      // return this._http.get(this._apiUrl + '/v1/dmsDocuments/sendEmail', emailData , this._options)
        .map((response: Response) => {
          return response.json()
        })
        .catch(this.loggerService.handleError)
    } else {
      // console.log(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId))
      // return this.pxService.createObservable(DOCUMENTS.filter(DOCUMENTS => DOCUMENTS.id == docId)[0])

    }
  }

  createReport(data:ReportInput) {
   
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/dmsDocuments/createDynamicReportDataFromSearch',data, this._options)
        .map((response: Response) => {
          return response.json()
        })
        .catch(this.loggerService.handleError)
    } else {
      
    }
  }


}
