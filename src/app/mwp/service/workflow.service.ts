import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { Workflow } from '../model/workflow.model'
import { WorkflowTo } from '../model/workflowTo.model'
import { WorkflowCc } from '../model/workflowCc.model'
import { Inbox } from '../model/inbox.model'

import { WorkflowType } from '../model/workflowType.model'
import { WorkflowImage } from '../model/workfowImage.model'
import { WorkflowModel_groupFlow } from '../model/WorkflowModel_groupFlow.model';
import { WorkflowNode } from '../model/workflowNode.model';
import { WorkflowLink } from '../model/workflowlink.model';

@Injectable()
export class WorkflowService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })
  }

  createWorkflow(newWorkflow: Workflow): Observable<Workflow> {
    if (environment.production) {
      return this._http.post(this._apiUrl + "/workflows" ,newWorkflow, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
      } else {
    }
  }

  createWorkflowTo(newWorkflowTo: WorkflowTo): Observable<WorkflowTo> {
    if (environment.production) {
      return this._http.post(this._apiUrl + "/workflowTos" ,newWorkflowTo, this._options)
        .map((response: Response) => { 
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  updateWorkflowToReceiveAll(userProfileId:number,structureId:number): Observable<WorkflowTo[]> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/workflowTos/updateWorkflowToReceive/user/"+ userProfileId +"/struc/"+ structureId, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowTo[]
        })
        .catch(this.loggerService.handleError)
  }

  updateWorkflowToOpenDate(oldInbox: Inbox,userProfileId:number,structureId:number): Observable<WorkflowTo[]> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/workflowTos/updateOpenDate/" + oldInbox.workflowId + "/user/" + userProfileId + "/struc/" + structureId, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowTo[]
        })
        .catch(this.loggerService.handleError)
  }

  updateWorkflowToActionDate(oldInbox: Inbox,userProfileId:number,structureId:number): Observable<WorkflowTo[]> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/workflowTos/updateActionDate/" + oldInbox.workflowId + "/user/" + userProfileId + "/struc/" + structureId, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowTo[]
        })
        .catch(this.loggerService.handleError)
  }

  updateWorkflowToFinishDate(oldInbox: Inbox,userProfileId:number,structureId:number): Observable<WorkflowTo[]> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/workflowTos/updateFinishDate/" + oldInbox.workflowId + "/user/" + userProfileId + "/struc/" + structureId, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowTo[]
        })
        .catch(this.loggerService.handleError)
  }

  createWorkflowCc(newWorkflowCc: WorkflowCc): Observable<WorkflowCc> {
    if (environment.production) {
      return this._http.post(this._apiUrl + "/workflowCcs" ,newWorkflowCc, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowCc
        })
        .catch(this.loggerService.handleError)
    }
  }

  updateWorkflowCcReceiveAll(userProfileId:number,structureId:number): Observable<WorkflowCc[]> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/workflowCcs/updateWorkflowCcReceive/user/"+ userProfileId +"/struc/"+ structureId, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowCc[]
        })
        .catch(this.loggerService.handleError)
  }

  updateWorkflowCcOpenDate(oldInbox: Inbox,userProfileId:number,structureId:number): Observable<WorkflowCc[]> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/workflowCcs/updateOpenDate/" + oldInbox.workflowId + "/user/" + userProfileId + "/struc/" + structureId, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowCc[]
        })
        .catch(this.loggerService.handleError)
  }

  updateWorkflowCcActionDate(oldInbox: Inbox,userProfileId:number,structureId:number): Observable<WorkflowCc[]> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/workflowCcs/updateActionDate/" + oldInbox.workflowId + "/user/" + userProfileId + "/struc/" + structureId, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowCc[]
        })
        .catch(this.loggerService.handleError)
  }

  updateWorkflowCcFinishDate(oldInbox: Inbox,userProfileId:number,structureId:number): Observable<WorkflowCc[]> {
    if (environment.production)
      return this._http.put(this._apiUrl + "/workflowCcs/updateFinishDate/" + oldInbox.workflowId + "/user/" + userProfileId + "/struc/" + structureId, this._options)
        .map((response: Response) => {
          return response.json().data as WorkflowCc[]
        })
        .catch(this.loggerService.handleError)
  }

  getWorkflowTypeList(): Observable<WorkflowType[]> {
    if(environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('sort=orderNo&dir=asc'))
      this._options.search = params      
      return this._http.get(this._apiUrl + "/workflowTypes/listAll", this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }
  
  getWorkflowTo(contentId: number): Observable<WorkflowTo[]> {
    if(environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&contentId=' + contentId 
      + '&offset=0&limit=500&sort=createdDate&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + "/workflowTos/content", this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  listWithDetail(linkId: number, dir: string): Observable<Workflow[]> {
    if(environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=' + dir))
      this._options.search = params
      return this._http.get(this._apiUrl + "/workflows/listWithDetail/" + linkId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  listForImage(linkId: number): Observable<WorkflowModel_groupFlow> {
    if(environment.production) {
      return this._http.get(this._apiUrl + "/workflows/listForImage/" + linkId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  listByLinkId(linkId: number, dir: string): Observable<Workflow[]> {
    if(environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=' + dir))
      this._options.search = params
      return this._http.get(this._apiUrl + "/workflows/list/" + linkId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getLastReply(): Observable<Workflow> {
    if (environment.production) {
      return this._http.get(this._apiUrl + "/workflows/getLastReply", this._options)
        .map((response: Response) => { 
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  listWorkfliwToByWorkflowId(workflowId: number): Observable<WorkflowTo[]> {
    if(environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&workflowId=' + workflowId))
      this._options.search = params
      return this._http.get(this._apiUrl + "/workflowTos", this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
