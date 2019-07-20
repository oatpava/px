import { Component, OnInit, Input, Directive, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PxService } from '../../../main/px.service'

import { FileUploader, FileSelectDirective } from 'ng2-file-upload'
import * as FileSaver from 'file-saver'

import { MdDialog } from '@angular/material'

import { FileAttach } from '../../../main/model/file-attach.model'
import { environment } from '../../../../environments/environment'

import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component'
import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { TimerObservable } from 'rxjs/observable/TimerObservable'

import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

@Component({
  selector: 'app-file-attach-saraban',
  templateUrl: './file-attach-saraban.component.html',
  styleUrls: ['./file-attach-saraban.component.styl']
})
export class FileAttachSarabanComponent implements OnInit {
  @ViewChild('file') uploaderRef: ElementRef
  //@ViewChild('file2') uploaderUpdateRef: ElementRef
  @Input() fileAttachs: any[]
  @Input() fileAttachRemoved: any[]
  @Input() uploader: FileUploader   //added FileAttach
  @Input() secret: number[]//added FileAttach.secrets
  @Input() type: string[]//added FileAttach type_tmp
  @Input() editMode: boolean
  @Input() uploaderUpdate: FileUploader
  //@Input() fileAttachUpdate: any[]
  //@Input() userId: number
  @Input() auth: boolean[]//[open, s1, s2, s3, s4]
  @Input() viewOnly: boolean//default = false, noauth[0]/from MWP/Archive = true
  @Input() uploaderUpdateIndex: number

  @Output() addFileAttach = new EventEmitter()
  @Output() editFileAttach = new EventEmitter()
  @Output() uploadFileAttach = new EventEmitter()
  @Output() editFileAttachView = new EventEmitter()

  hasBaseDropZoneOver: boolean = false
  hoverEdit: number = -1
  secretClass: any[] = [
    { label: 'ปกติ', value: 1 },
    { label: 'ลับ', value: 2 },
    { label: 'ลับมาก', value: 3 },
    { label: 'ลับที่สุด', value: 4 }
  ]
  allowedMimeType: any = [
    'image/png',
    'image/jpeg',
    'image/tiff',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  ];
  // auth: { label: string, auth: boolean }[] = [
  //   { label: 'dl', auth: true },
  //   { label: 's1', auth: true },
  //   { label: 's2', auth: true },
  //   { label: 's3', auth: true },
  //   { label: 's4', auth: true },
  //   { label: 'cre', auth: true },
  //   { label: 'edt', auth: true },
  //   { label: 'del', auth: true }
  // ]


  constructor(
    private _pxService: PxService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService
  ) {
  }

  ngOnInit() {
  }

  fileOverBase(event) {
    this.hasBaseDropZoneOver = event
  }

  add() {
    let last: number = this.uploader.queue.length - 1
    //console.log("addFile", this.uploader.queue[last].file)
    let name: string = this.uploader.queue[last].file.name
    let typePos: number = name.lastIndexOf(".")
    //name = name.substr(name.lastIndexOf("."))
    //console.log("type", name)
    //console.log("addFile", this.uploader)
    this.secret.push(1)
    this.type.push(name.substr(typePos))
    this.uploader.queue[last].file.name = name.substr(0, typePos)
    this.addFileAttach.emit(true)
    //console.log(this.type[last])
  }

  addByDrop(event) {
    let num: number = this.uploader.queue.length - event.length
    //console.log(event.length)//cant use foreach
    for (let i = 0; i < event.length; i++) {
      let index: number = num + i
      let name: string = this.uploader.queue[index].file.name
      let typePos: number = name.lastIndexOf(".")
      this.secret.push(1)
      this.type.push(name.substr(typePos))
      this.uploader.queue[index].file.name = name.substr(0, typePos)
    }
    this.addFileAttach.emit(true)
  }

  selectSecret(value: number, index: number) {
    //console.log('selectSecret at ' + index + ' : ' + this.secretClass[value-1].label)
    //this.secret[index] = value
  }

  remove(index: number) {
    //console.log('removeFromQueue', this.uploader.queue[index])
    this.secret.splice(index, 1)//remove secret
    this.type.splice(index, 1)
    this.uploader.queue[index].remove()
    if (index == 0) this.addFileAttach.emit(false)//no added file left
  }

  view(fileAttach: any) {
    if (this._paramSarabanService.ScanSubscription) this._paramSarabanService.ScanSubscription.unsubscribe()
    let temp = environment.plugIn
    let url = temp + '/scan/?'
    let mode = 'view'
    let auth = (this.viewOnly) ? 0 : (fileAttach.owner) ? 1 : 0
    localStorage.setItem('scan', 'uncomplete')

    this._pxService
      .createEmptyData(fileAttach.linkType, fileAttach.linkId, fileAttach.id)
      .subscribe(res => {
        window.open(url + "mode=" + mode + "&linkType=" + fileAttach.linkType + "&fileAttachName=" + fileAttach.fileAttachName
          + "&secret=" + fileAttach.secrets + "&documentId=" + fileAttach.linkId + "&urlNoName=" + ''
          + "&fileAttachId=" + res.id + "&auth=" + auth + "&attachId=" + fileAttach.id, 'scan', "height=600,width=1000")
        const timer = TimerObservable.create(4000, 2000)
        this._paramSarabanService.ScanSubscription = timer.subscribe(t => {
          if (t == 58) this._paramSarabanService.ScanSubscription.unsubscribe()
          else {
            this._pxService
              .checkHaveAttach(res.id)
              .subscribe(res2 => {
                if (res2.data == 'true') {
                  this.editFileAttachView.emit()
                  this._paramSarabanService.ScanSubscription.unsubscribe()
                }
              })
          }
        })
      })
      
}

download(fileAttach: FileAttach) {
  let tmp = new FileAttach(fileAttach)
  //tmp.fileAttachName = tmp.fileAttachName + tmp.fileAttachType.toLowerCase()
  this._pxService
    .downloadFileAttach(tmp)
  // .subscribe(response => {
  // })
}

delete (fileAttach: any) {
  //console.log('deleteFileAttach')
  // if (this.userId != fileAttach.createdBy) {
  //   let dialogRef = this._dialog.open(DialogWarningComponent)
  //   dialogRef.componentInstance.header = "แจ้งเตือน"
  //   dialogRef.componentInstance.message = "ไม่สามารถลบ เนื่องจากคุณไม่ใช่ผู้รับผิดชอบของเอกสารแนบดังกล่าว"
  //   dialogRef.componentInstance.confirmation = false
  // } else {
  let dialogRef = this._dialog.open(DeleteDialogComponent)
  // let dialogRef = this._dialog.open(DialogWarningComponent)
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      let indexRemovedFile: number = this.fileAttachs.indexOf(fileAttach)

      this.fileAttachs.splice(indexRemovedFile, 1)
      this.fileAttachRemoved.push(fileAttach)
      this.editFileAttach.emit(-1)//for reload FileAttach
    }
  })
  //}
}

edit(fileAttach: any, index: number) {
  //console.log('editFileattach', this.fileAttachUpdate[index])
  if (!this.fileAttachs[index].uploaded) this.fileAttachs[index].edited = true
  this.editFileAttach.emit(0)
  //console.log('uploadFileattach', this.fileAttachUpdate[index])
}

update(fileAttach: any, index: number) {
  //console.log("uploadderUpdateIndex", this.uploaderUpdateIndex)
  //console.log("uploadderUpdate ", this.uploaderUpdate.queue[this.uploaderUpdateIndex].file)
  let last: number = this.uploaderUpdate.queue.length - 1
  let name: string = this.uploaderUpdate.queue[last].file.name
  let typePos: number = name.lastIndexOf(".")
  let uploadedFileAttach = new FileAttach(
    {
      //fileAttachName: this.uploaderUpdate.queue[last].file.name,
      fileAttachName: name.substr(0, typePos),
      linkType: 'dms',
      linkId: fileAttach.linkId,
      referenceId: fileAttach.id,
      secrets: fileAttach.secrets
    })
  this.fileAttachs[index] = uploadedFileAttach
  this.fileAttachs[index].type = name.substr(typePos)
  this.fileAttachs[index].uploaded = true
  this.fileAttachs[index].uploadIndex = this.uploaderUpdateIndex
  this.editFileAttach.emit(1)
  this.uploadFileAttach.emit()
  //console.log('uploadFileattach', this.fileAttachs[index])

}

ngAfterViewInit() {
  this.uploader.onAfterAddingFile = (item => {
    this.uploaderRef.nativeElement.value = ''
  });
  // this.uploaderUpdate.onAfterAddingFile = (item => {
  //   this.uploaderUpdateRef.nativeElement.value = ''
  // });
}

cellColor_secret(secret: number) {
  switch (secret) {
    case (1): return null
    case (2): return { 'color': 'red' }
    case (3): return { 'color': 'red' }
    case (4): return { 'color': 'red' }
    default: return null
  }
}

}
