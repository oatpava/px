import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'

import { SarabanContentService } from '../../../service/saraban-content.service'
import { PxService } from '../../../../main/px.service'
import { ParamSarabanService } from '../../../service/param-saraban.service'

import { SarabanContent } from '../../../model/sarabanContent.model'
import { ListReturn } from '../../../../main/model/listReturn.model'

const limit: number = 20
@Component({
  selector: 'app-list-circular-notice',
  templateUrl: './list-circular-notice.component.html',
  styleUrls: ['./list-circular-notice.component.styl'],
  providers: [SarabanContentService, PxService]
})
export class ListCircularNoticeComponent implements OnInit {
  menuOver: boolean = false
  folderName: string = ''
  folderId: number
  circularNotices: SarabanContent[] = []
  datas: any[] = []
  //expandedIndex: number = -1
  //fileAttachs: any[][] = []
  listReturn: ListReturn = new ListReturn()
  year: number

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _pxService: PxService,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.folderName = this._paramSarabanService.folderName
    this.folderId = this._paramSarabanService.folderId
    this.year = new Date().getFullYear() + 543
  }

  ngOnInit() {
    this.getCircularNotices(this.folderId)
  }

  goBack() {
    this._location.back()
  }

  getCircularNotices(folderId: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContents(folderId, this.year, this.listReturn.count, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas = this.circularNotices = this.circularNotices.concat(response.data)
        this.listReturn = response.listReturn
      })
  }

  getFileAttachs(event) {
    if (!this.datas[event.index].fileAttachs) {
      this._loadingService.register('main')
      this._pxService
        .getFileAttachs('dms', event.documentId, 'asc')
        .subscribe((response: any[]) => {
          this._loadingService.resolve('main')
          this.datas[event.index].fileAttachs = []
          if (response.length > 0) {
            response.forEach(fileattach => {
              if (fileattach.referenceId == 0) {
                this.datas[event.index].fileAttachs.push(fileattach)
              }
            })
            //console.log('xxx', this.fileAttachs[event.index])
          }
        })
    }
  }

  deleteList() {

  }

  add() {
    this._paramSarabanService.mode = 'สร้าง'
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['addCN']
        }
      }],
      { relativeTo: this._route })
  }


  rowSelect(event) {
    this._paramSarabanService.mode = 'แก้ไข'
    this._paramSarabanService.sarabanContentId = event.id
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['addCN']
        }
      }],
      { relativeTo: this._route })
  }

}
