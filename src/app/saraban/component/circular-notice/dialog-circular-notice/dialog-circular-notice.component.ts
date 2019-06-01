import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core'

import { LoginService } from '../../../../login/login.service'
import { SarabanService } from '../../../service/saraban.service'
import { SarabanContentService } from '../../../service/saraban-content.service'
import { PxService } from '../../../../main/px.service'

import { SarabanFolder } from '../../../model/sarabanFolder.model'
import { SarabanContent } from '../../../model/sarabanContent.model'
import { ListReturn } from '../../../../main/model/listReturn.model'

const limit: number = 20

@Component({
  selector: 'app-dialog-circular-notice',
  templateUrl: './dialog-circular-notice.component.html',
  styleUrls: ['./dialog-circular-notice.component.styl'],
  providers: [LoginService, SarabanService, SarabanContentService, PxService]
})
export class DialogCircularNoticeComponent implements OnInit {
  tabDataLoaded: boolean[] = []
  tabIndex: number = 0
  cNFolders: SarabanFolder[] = []
  circularNotices: SarabanContent[][] = []
  datas: any[][] = []
  listReturns: ListReturn[] = []

  year: number

  constructor(
    private _loadingService: TdLoadingService,
    private _loginService: LoginService,
    private _sarabanService: SarabanService,
    private _sarabanContentService: SarabanContentService,
    private _pxService: PxService,
  ) {
    this.year = new Date().getFullYear() + 543
  }

  ngOnInit() {
    this.getMockToken()
  }

  onTabChange(event) {//0,1,2,...
    let i: number = event.index
    this.tabIndex = i
    if (!this.tabDataLoaded[i]) {
      this.getCircularNotices(this.cNFolders[i].id)
      this.tabDataLoaded[i] = true
    }
  }

  getMockToken() {
    this._loadingService.register('main')
    this._loginService
      .getMockToken()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.getCNFolders()
      })
  }

  getCNFolders() {
    this._loadingService.register('main')
    this._sarabanService
      .listCNFoldersNoLogin()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.cNFolders = response
        response.forEach(folder => {
          this.tabDataLoaded.push(false)
          this.circularNotices.push([])
          this.datas.push([])
          this.listReturns.push(new ListReturn())
        })
        this.tabDataLoaded[0] = true
        this.getCircularNotices(response[0].id)
      })
  }

  getCircularNotices(folderId: number) {
    let i: number = this.tabIndex
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContentsNologin(folderId, this.year, this.listReturns[i].count, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas[i] = this.circularNotices[i] = this.circularNotices[i].concat(response.data)
        this.listReturns[i] = response.listReturn
      })
  }

  getFileAttachs(event) {
    let i: number = this.tabIndex
    if (!this.datas[i][event.index].fileAttachs) {
      this._loadingService.register('main')
      this._pxService
        .getFileAttachsNoLogin('dms', event.documentId)
        .subscribe((response: any[]) => {
          this._loadingService.resolve('main')
          this.datas[i][event.index].fileAttachs = []
          if (response.length > 0) {
            response.forEach(fileattach => {
              if (fileattach.referenceId == 0) {
                this.datas[i][event.index].fileAttachs.push(fileattach)
              }
            })
          }
        })
    }
  }

}

