import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { PxService, } from '../../../main/px.service'
import { FileUploader } from 'ng2-file-upload'
import { FileAttach } from '../../../main/model/file-attach.model'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

@Component({
  selector: 'app-upload-file-attach',
  templateUrl: './upload-file-attach.component.html',
  styleUrls: ['./upload-file-attach.component.styl']
})
export class UploadFileAttachComponent implements OnInit {
  @Input() isAttach: boolean = false
  @Input() fileAttach: FileAttach
  @Input() fileAttachRemoved: FileAttach[]
  @Input() uploader: FileUploader
  @Input() myImage: any
  @Input() edit: boolean
  @Input() isCheck: boolean = false
  @Input() fileType: string = ''
  @Output('msgs') msgs = new EventEmitter()
  @Output('saveUploadfile') saveUploadfile = new EventEmitter()
  readonly allowedMimeType = this._paramSarabanService.allowedMimeType

  constructor(
    private _pxService: PxService,
    private _paramSarabanService: ParamSarabanService,
  ) { }

  ngOnInit() {
  }

  deleteFileAttach(deleteFileAttach: FileAttach) {
    this.fileAttach = null
    this.fileAttachRemoved.push(deleteFileAttach)
    deleteFileAttach = null
  }

  downloadFile(fileAttach: FileAttach) {
    this._pxService.downloadFileAttach(fileAttach)
      // .subscribe(response => {
      // })
  }

  openFile(file: FileAttach) {
    window.open(file.thumbnailUrl, '_blank')
  }

  removeQueue(uploader: FileUploader, fileAttach: FileAttach) {
    while (uploader.queue.length >= 1)
      uploader.queue[uploader.queue.length - 1].remove()

    this.fileAttach = null
    if (fileAttach != null) {
      this.fileAttachRemoved.push(fileAttach)
      fileAttach = null
    }
  }

  checkTypeFile() {
    if (this.fileType == 'excel') {
      let fileType = this.uploader.queue[this.uploader.queue.length - 1]._file.type
      //excel Type
      if (fileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        if (this.uploader.queue.length > 0) {
          let fileType = this.uploader.queue[this.uploader.queue.length - 1]._file.type
          if (!fileType.toLowerCase().startsWith("image") && this.isCheck) {
            this.uploader.queue[this.uploader.queue.length - 1].remove()
          }
          if (this.uploader.queue.length > 1) this.uploader.queue[0].remove()

          this.saveUploadfile.emit(true)
        }
      } else {
        this.msgs.emit(
          {
            severity: 'error',
            summary: 'ไม่สามารถเลือกไฟล์ได้',
            detail: 'กรุณาเลือกไฟล์ที่ Excel เท่านั้น',
          },
        );
        this.uploader.queue[this.uploader.queue.length - 1].remove()
      }
      //excel Type
    } else {
      if (this.uploader.queue.length > 0) {
        let fileType = this.uploader.queue[this.uploader.queue.length - 1]._file.type
        if (!fileType.toLowerCase().startsWith("image") && this.isCheck) {
          this.uploader.queue[this.uploader.queue.length - 1].remove()
        }
        if (this.uploader.queue.length > 1) this.uploader.queue[0].remove()
      }
    }
  }

}
