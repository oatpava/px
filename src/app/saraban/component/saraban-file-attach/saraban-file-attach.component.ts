import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { FileUploader } from 'ng2-file-upload'
import { Message, BlockUI } from 'primeng/primeng'
import { MdProgressSpinner } from '@angular/material'
import { TimerObservable } from 'rxjs/observable/TimerObservable'
import { setTimeout } from 'timers'
import { environment } from '../../../../environments/environment'
import { MdDialogRef } from '@angular/material'

import { PxService } from '../../../main/px.service'
import { SarabanContentService } from '../../service/saraban-content.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

import { FileAttach } from '../../../main/model/file-attach.model'
import { SarabanAuth } from '../../model/SarabanAuth.model'

import { DialogWarningComponent } from '../add-saraban-content/dialog-warning/dialog-warning.component'

@Component({
  selector: 'app-saraban-file-attach',
  templateUrl: './saraban-file-attach.component.html',
  styleUrls: ['./saraban-file-attach.component.styl'],
  providers: [PxService, SarabanContentService]
})
export class SarabanFileAttachComponent implements OnInit {
  private isArchive: boolean
  life: number = 3000
  msgs: Message[]
  blockUI: boolean = false
  ecms: boolean = false
  linkType: string = 'dms'
  linkId: number

  fileAttachs: any[] = []
  fileAttachRemoved: any[] = []
  uploader: FileUploader = new FileUploader({})
  secrets: number[] = []
  types: String[] = []
  editMode: boolean = false
  uploaderUpdate: FileUploader = new FileUploader({})
  uploaderUpdateIndex: number

  deleted: boolean = false
  added: boolean = false
  edited: boolean = false

  auth: boolean[] = [false, false, false, false, false]//(add/edit)[10], secret1[15], secret2[16], secret3[17], secret4[18]
  viewOnly: boolean = false

  num: number
  title: string
  loading: boolean = false

  constructor(
    private _loadingService: TdLoadingService,
    private _pxService: PxService,
    private _sarabanContentService: SarabanContentService,
    private _paramSarabanService: ParamSarabanService,
    public dialogRef: MdDialogRef<SarabanFileAttachComponent>
  ) {
    this.isArchive = this._paramSarabanService.isArchive
  }

  ngOnInit() {
    console.log('SarabanFileAttachComponent')
    this.setAuth(this._paramSarabanService.contentAuth)
    if (this.num > 0) {
      this.getFileAttachs()
    } else {
      this.editMode = false
    }
  }

  setAuth(auth: SarabanAuth[]) {
    if (!this.ecms) {
      this.auth[0] = auth[10].auth
      this.auth[1] = auth[15].auth
      this.auth[2] = auth[16].auth
      this.auth[3] = auth[17].auth
      this.auth[4] = auth[18].auth
      if (!this.auth[0] || this._paramSarabanService.mwp.fromMwp || this.isArchive) {
        this.viewOnly = true
        console.log('VIEWONLY')
      }
    } else {
      this.auth[0] = false
      this.auth[1] = true
      this.auth[2] = true
      this.auth[3] = true
      this.auth[4] = true
      this.viewOnly = true
      console.log('ECMS VIEWONLY')
    }
  }

  initialData() {
    this.deleted = false
    this.added = false
    this.edited = false
    this.fileAttachs = []
    this.fileAttachRemoved = []
    this.uploader.queue = []
    this.secrets = []
    this.types = []
    this.uploaderUpdateIndex = 0
    this.uploaderUpdate.queue = []
    this.editMode = false

  }

  getFileAttachs() {
    this.loading = true
    this.initialData()
    this._loadingService.register('main')
    this._pxService
      .getFileAttachs(this.linkType, this.linkId, 'asc')
      .subscribe((response: any[]) => {
        let fileAttachs = []
        let child = []

        response.forEach(fileattach => {
          if (fileattach.referenceId == 0) {
            fileattach.children = []
            fileAttachs.push(fileattach)
          } else {
            child.push(fileattach)
          }
        })

        fileAttachs.forEach(fileattach => {
          let idParent = fileattach.id
          for (let i = 0; i < child.length; i++) {
            if (idParent == child[i].referenceId) {
              fileattach.children.push(child[i])
              idParent = child[i].id
              i = -1
            }
          }
        })

        this.fileAttachs = fileAttachs
        if (!this.isArchive && !this.ecms) {
          this.fileAttachs.forEach(tmp => {
            let name: string = tmp.fileAttachName
            let typePos: number = name.lastIndexOf(".")
            tmp.fileAttachName = name.substr(0, typePos)
            tmp.type = name.substr(typePos)
            tmp.canView = this.checkViewByFileType(tmp.fileAttachType)
            tmp.owner = (this._paramSarabanService.userId == tmp.createdBy) ? true : false
            tmp.trimmedName = this.trimTitle(tmp.fileAttachName)
          })
        } else {
          this.fileAttachs.forEach(tmp => {
            tmp.type = tmp.fileAttachType.toLowerCase()
            tmp.canView = this.checkViewByFileType(tmp.fileAttachType)
            tmp.owner = false
            tmp.trimmedName = this.trimTitle(tmp.fileAttachName)
          })
        }

        this.num = fileAttachs.length
        this._loadingService.resolve('main')
        this.loading = false
      })
  }

  addFileAttach(hasAction: boolean) {
    this.added = hasAction
  }

  editFileAttach(action: number) {
    if (action == 1) {
      this.msgs = []
      this.msgs.push(
        {
          severity: 'info',
          summary: 'มีการนำเข้าไฟล์เอกสารแก้ไข',
          detail: ''
        })
    } else if (action == -1) this.deleted = true
    this.edited = true
  }

  uploadFileAttach() {
    this.uploaderUpdateIndex++
  }

  cancel() {
    if (this.edited) {
      this.getFileAttachs()
    } else if (this.added) {
      this.uploader.queue = []
      this.secrets = []
      this.types = []
      this.added = false
    } else {
      this.editMode = false
    }
  }

  edit() {
    this.editMode = true
  }

  saveEdit() {
    this.msgs = []
    this.life = 100000
    this.msgs.push(this._paramSarabanService.genWaitngMsg('อัพโหลดเอกสารแนบ'))

    this._loadingService.register('main')
    this.blockUI = true
    let count: number = 0
    let edit: boolean = false
    let upload: boolean = false
    let edit_tmp: any[] = []

    for (let i = 0; i < this.fileAttachs.length; i++) {
      if (this.fileAttachs[i].edited) {
        edit = true
        count++
        let tmp: FileAttach = new FileAttach()
        tmp.id = this.fileAttachs[i].id
        tmp.secrets = this.fileAttachs[i].secrets
        tmp.fileAttachName = this.fileAttachs[i].fileAttachName + this.fileAttachs[i].type

        edit_tmp.push(this._pxService.updateFileAttach2(tmp, 0))
      } else if (this.fileAttachs[i].uploaded) {
        upload = true
        count++
        let index = this.fileAttachs[i].uploadIndex
        let tmp: FileAttach = new FileAttach()
        tmp.secrets = this.fileAttachs[i].secrets
        tmp.fileAttachName = this.fileAttachs[i].fileAttachName
        tmp.referenceId = this.fileAttachs[i].referenceId
        let type: string = this.fileAttachs[i].type
        this.uploaderUpdate.queue[index].file.name = tmp.fileAttachName + type + ',' + tmp.secrets + ',' + tmp.referenceId
      }
    }
    let msgs_tmp: Message[] = [{
      severity: 'success',
      summary: 'แก้ไขเอกสารแนบสำเร็จ',
      detail: 'คุณได้ทำการแก้ไขเอกสารแนบจำนวน ' + count + ' รายการ'
    }]

    if (upload) {
      this._pxService.uploadList(this.uploaderUpdate, this.genFileattachDetail2())
        .onCompleteAll = () => {
          if (edit) {
            Observable.forkJoin(edit_tmp)
              .subscribe((res: any[]) => {
                this.afterSaveAdd(msgs_tmp)
              })
          } else {
            this.afterSaveAdd(msgs_tmp)
          }

        }
    } else if (edit) {
      Observable.forkJoin(edit_tmp)
        .subscribe((res: any[]) => {
          this.afterSaveAdd(msgs_tmp)
        })
    }
  }

  saveAdd() {
    this.msgs = []
    this.life = 100000
    this.msgs.push(this._paramSarabanService.genWaitngMsg('อัพโหลดเอกสารแนบ'))
    this._loadingService.register('main')
    this.blockUI = true
    let msgs_tmp: Message[] = []

    if (this.added) {
      this.uploadFileList()
      msgs_tmp.push({
        severity: 'success',
        summary: 'เพิ่มเอกสารแนบสำเร็จ',
        detail: 'คุณได้ทำการเพิ่มเอกสารแนบจำนวน ' + this.secrets.length + ' รายการ'
      })

      this._pxService.uploadList(this.uploader, this.genFileattachDetail2())
        .onCompleteAll = () => {
          if (this.deleted) {
            this._pxService
              .deleteFileAttachs(this.fileAttachRemoved)
              .subscribe(response => {
                msgs_tmp.push({
                  severity: 'success',
                  summary: 'ลบเอกสารแนบสำเร็จ',
                  detail: 'คุณได้ทำการเพิ่มเอกสารแนบจำนวน ' + this.fileAttachRemoved.length + ' รายการ'
                })
                this.afterSaveAdd(msgs_tmp)
              })
          } else {
            this.afterSaveAdd(msgs_tmp)
          }
        }
    } else if (this.deleted) {
      this._pxService
        .deleteFileAttachs(this.fileAttachRemoved)
        .subscribe(response => {
          msgs_tmp.push({
            severity: 'success',
            summary: 'ลบเอกสารแนบสำเร็จ',
            detail: 'คุณได้ทำการเพิ่มเอกสารแนบจำนวน ' + this.fileAttachRemoved.length + ' รายการ'
          })
          this.afterSaveAdd(msgs_tmp)
        })
    }
  }

  afterSaveAdd(msgs_tmp: Message[]) {
    this._sarabanContentService
      .updateFullText(this.linkId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.blockUI = false
        this.dialogRef.close(msgs_tmp)
      })
  }

  delete() {
    this._pxService
      .deleteFileAttachs(this.fileAttachRemoved)
      .subscribe(response => {

      })
  }

  genFileattachDetail2(): FileAttach {
    return new FileAttach({
      linkType: this.linkType,
      linkId: this.linkId,
      referenceId: this._paramSarabanService.folderId,    //for elastic search
      secrets: this._paramSarabanService.sarabanContentId //for elastic search
    })
  }

  uploadFileList() {
    for (let i = 0; i < this.secrets.length; i++) {
      this.uploader.queue[i].file.name += this.types[i] + ',' + this.secrets[i] + ',0'
    }
  }

  uploadUpdateFileList(index: number) {
    return this._pxService.uploadFileAttachsByItem(this.uploaderUpdate, this.genFileattachDetail2(), index)
  }

  scan() {
    if (this._paramSarabanService.ScanSubscription) this._paramSarabanService.ScanSubscription.unsubscribe()
    let temp = environment.plugIn
    let url = temp + '/scan/?'
    let mode = 'add'
    let linkType = this.linkType
    let fileAttachName = 'Document'
    let secret = 1
    let documentId = this.linkId
    let urlNoName = ''
    localStorage.setItem('scan', 'uncomplete')

    this._pxService
      .createEmptyData(linkType, documentId, 0)
      .subscribe(res => {
        window.open(url + "mode=" + mode + "&linkType=" + linkType + "&fileAttachName=" + fileAttachName + "&secret=" + secret + "&documentId=" + documentId + "&urlNoName=" + urlNoName + "&fileAttachId=" + res.id, 'scan', "height=600,width=1000")

        const timer = TimerObservable.create(4000, 2000)
        this._paramSarabanService.ScanSubscription = timer.subscribe(t => {
          if (t == 58) this._paramSarabanService.ScanSubscription.unsubscribe()
          else {
            this._pxService
              .checkHaveAttach(res.id)
              .subscribe(res2 => {
                if (res2.data == 'true') {
                  this.getFileAttachs()
                  this._paramSarabanService.ScanSubscription.unsubscribe()
                }
              })
          }
        })

      })
  }

  checkViewByFileType(type: string): boolean {
    let result: boolean = false
    if (type == '.PDF' || type == '.TIF' || type == '.TIFF' || type == '.JPG' || type == '.PNG') {
      result = true
    }
    return result
  }

  editFileAttachView() {
    this.getFileAttachs()
  }

  trimTitle(title: string): string {
    if (title.length > 100) {
      return title.substr(0, 100) + '...'
    } else {
      return title
    }
  }

}