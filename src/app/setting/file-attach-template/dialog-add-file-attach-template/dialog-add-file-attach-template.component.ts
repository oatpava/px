import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material'
import { Message } from 'primeng/primeng';
import { FileUploader } from 'ng2-file-upload';
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { FileAttach } from '../../../main/model/file-attach.model';
import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'

@Component({
  selector: 'app-dialog-add-file-attach-template',
  templateUrl: './dialog-add-file-attach-template.component.html',
  styleUrls: ['./dialog-add-file-attach-template.component.styl']
})
export class DialogAddFileAttachTemplateComponent implements OnInit {
  fileAttach = new FileAttach()

  hasBaseDropZoneOver: boolean = false
  uploader: FileUploader = new FileUploader({})
  fileName: string = ''
  fileType: string = '.unknown'
  fileUpdated: boolean = false
  readonly allowedMimeType = this._paramSarabanService.allowedMimeType
  readonly fileSizeLimit = this._paramSarabanService.fileSizeLimit
  readonly fileSizeLimitByte = this._paramSarabanService.fileSizeLimit * 1024 * 1024

  validateSave = () => this.uploader.queue.length != 0 && this.fileName.length != 0
  validateEdit = () => this.fileName.length != 0

  constructor(
    private _dialog: MdDialog,
    private _dialogRef: MdDialogRef<DialogAddFileAttachTemplateComponent>,
    private _paramSarabanService: ParamSarabanService
  ) { }

  ngOnInit() {
    if (this.fileAttach.id != 0) {
      const name: string = this.fileAttach.fileAttachName
      const typePos: number = name.lastIndexOf('.')
      this.fileName = name.substring(0, typePos)
      this.fileType = name.substring(typePos)
    }
  }

  close() {
    this._dialogRef.close()
  }

  // scan() {

  // }

  fileOverBase(event) {
    this.hasBaseDropZoneOver = event
  }

  add() {
    const last: number = this.uploader.queue.length - 1
    const file: any = this.uploader.queue[last].file
    const typePos: string = file.name.lastIndexOf('.')
    this.fileName = file.name.substring(0, typePos)
    this.fileType = file.name.substring(typePos)

    const isFileTypeValid = this.isFileTypeValid(file.type)
    const isFileSizeValid = this.isFileSizeValid(file.size)
    if (isFileTypeValid && isFileSizeValid) {
      this.uploader.queue = [this.uploader.queue[last]]
      this.fileUpdated = true
      return
    } else this.clear()

    const msg1 = !isFileTypeValid ? `ไม่อนุญาติให้แนบเอกสารประเภท ${this.fileType}` : null
    const msg2 = !isFileSizeValid ? `ขนาดของเอกสารแนบต้องไม่เกิน ${this.fileSizeLimit} MB` : null
    const msg = (msg1 && msg2) ? `${msg1}\nและ${msg2}` : msg1 ? msg1 : msg2
    if (msg) {
      const dialogRef = this._dialog.open(DialogWarningComponent)
      dialogRef.componentInstance.header = 'แจ้งเตือน'
      dialogRef.componentInstance.message = msg
      dialogRef.componentInstance.confirmation = false
    }
  }

  private isFileTypeValid(mimeType: string) {
    return this._paramSarabanService.allowedMimeType.includes(mimeType)
  }

  private isFileSizeValid(fileSize: number) {
    return fileSize <= this.fileSizeLimitByte
  }

  clear() {
    this.uploader.queue = []
    this.fileType = '.unknown'
    this.fileUpdated = false
  }

  save() {

  }

}
