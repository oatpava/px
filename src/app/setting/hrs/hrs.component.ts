import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService, LoadingType, LoadingMode } from '@covalent/core'
import { TreeModule, TreeNode, Message } from 'primeng/primeng'
import { Location } from '@angular/common'

import { FileAttach } from '../../main/model/file-attach.model'
import { FileUploader } from 'ng2-file-upload'
import { PxService } from '../../main/px.service'


import { Structure } from '../../setting/model/structure.model'
import { StructureService } from '../../setting/component/structure/structure.service'

@Component({
  selector: 'app-hrs',
  templateUrl: './hrs.component.html',
  styleUrls: ['./hrs.component.styl'],
  providers: [PxService, StructureService]
})
export class HrsComponent implements OnInit {
  msgs: Message[] = []
  //fileAttach
  uploader: FileUploader = new FileUploader({})
  fileAttach: FileAttach
  fileAttachRemoved: FileAttach[] = []
  linkType: string = 'STRUCTEXCEL'
  isCheck: boolean = true
  hasBaseDropZoneOver: boolean = false
  fileType: string = 'excel'
  timeAttachFile: any
  //fileAttach
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _pxService: PxService,
    private _location: Location,
    private _structureService: StructureService,
  ) { }

  ngOnInit() {
  }

  saveFile(data) {
    console.log(data)
    this.timeAttachFile = Math.floor(Math.random() * (1 - 999 + 1)) + 999
    this.uploadFile(this.timeAttachFile, this.linkType)
  }

  uploadFile(linkId: number, linkType: string) {
    console.log('--- uploadFile ---')
    console.log(linkId)
    console.log(linkType)
    console.log(this.uploader)
    let fileAttachDetail = new FileAttach({
      version: 1,
      linkType: linkType,
      linkId: this.timeAttachFile
    })
    while (this.uploader.queue.length > 1) {  // upload last index
      this.uploader.queue = this.uploader.queue.splice(this.uploader.queue.length - 1, 1)
    }

    return this._pxService.uploadFileAttachExcel(this.uploader, fileAttachDetail)
  }

  alertMsg(event) {
    this.msgs = [];
    this.msgs.push(event)
  }


  save(data) {
    this._loadingService.register('main')
    this._pxService
      .getFileAttachs(this.linkType, this.timeAttachFile, 'asc')
      .subscribe(response => {
        // console.log(response)

        this._structureService
          .structureImport('1.0', response[0].id)
          .subscribe(response => {
            console.log(response)
            this.msgs = []
            this.msgs.push(
              {
                severity: 'success',
                summary: 'สำเร็จ',
                detail: 'นำเข้า HRIS (โครงสร้าง)',
              },
            );
            this._loadingService.resolve('main')
          })

      })
  }

  goBack() {
    this._location.back()
  }

}
