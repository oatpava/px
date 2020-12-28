import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimerObservable } from 'rxjs/observable/TimerObservable'
import { Subscription } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment'

import { PxService } from '../../../main/px.service'

import { SarabanContent } from '../../model/sarabanContent.model'
import { ListReturn } from '../../../main/model/listReturn.model'


@Component({
  selector: 'circular-notice',
  templateUrl: './circular-notice.component.html',
  styleUrls: ['./circular-notice.component.styl'],
  providers: [PxService]
})
export class CircularNoticeComponent implements OnInit {
  @Input() datas: any[]
  //@Input() expandedIndex: number
  //@Input() fileAttachs: any[][]
  @Input() listReturn: ListReturn
  @Output() loadDatas = new EventEmitter()
  @Output() getFileAttachs = new EventEmitter()
  @Output() rowSelect = new EventEmitter()
  //@Output() viewFileAttach = new EventEmitter()
  //@Output() downloadAttach = new EventEmitter()
  year: number

  private tick: string;
  private subscription: Subscription;

  constructor(
    private _pxService: PxService
  ) {
    this.year = new Date().getFullYear() + 543
  }

  ngOnInit() {
  }

  loadMoreContents() {
    this.loadDatas.emit()
  }

  expandRow(index: number, documentId: number) {
    //this.expandedIndex = index
    this.getFileAttachs.emit({ index: index, documentId: documentId })
  }

  show(selectedRow: SarabanContent) {
    this.rowSelect.emit(selectedRow)
  }

  // view(fileAttach: any) {
  //   this.viewFileAttach.emit(fileAttach)
  // }

  // download(fileAttach: any) {
  //   this.downloadAttach.emit(fileAttach)
  // }

  view(fileAttach: any) {
    if (fileAttach.fileAttachType == '.PDF' || fileAttach.fileAttachType == '.TIF' || fileAttach.fileAttachType == '.TIFF' || fileAttach.fileAttachType == '.JPG' || fileAttach.fileAttachType == '.PNG') {
      let temp = environment.plugIn
      let auth = 1
      let url = temp + '/scan/?'
      let mode = 'view'
      localStorage.setItem('scan', 'uncomplete')
      window.open(url + "mode=" + mode + "&attachId=" + fileAttach.id + "&auth=" + auth, 'scan', "height=600,width=1000")

      const timer = TimerObservable.create(500, 1000);
      this.subscription = timer.subscribe(t => {
        this.tick = '' + t;
        if (localStorage.getItem('scan') == 'complete') {
          localStorage.setItem('scan', 'uncomplete')
        }
      });
    } else {
      let temp = environment.plugIn
      let url = temp + '/activeX/view.html?'
      let mode = 'view'
      let fileurl = fileAttach.url
      let fileAttachType = fileAttach.fileAttachType
      localStorage.setItem('activeX', 'uncomplete')
      window.open(url + "mode=" + mode + "&fileAttachType=" + fileAttachType + "&url=" + fileurl, 'scan', "height=500,width=800")
    }
  }

  download(fileAttach: any) {
    this._pxService.downloadFileAttach(fileAttach)
  }

}
