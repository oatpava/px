import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core';
import { PxService } from '../../main/px.service'
import { MdDialog } from '@angular/material';
import { FileAttach } from '../../main/model/file-attach.model';
import { DialogAddFileAttachTemplateComponent } from './dialog-add-file-attach-template/dialog-add-file-attach-template.component';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-file-attach-template',
  templateUrl: './file-attach-template.component.html',
  styleUrls: ['./file-attach-template.component.styl'],
  providers: [PxService]
})
export class FileAttachTemplateComponent implements OnInit {
  fileAttachs: FileAttach[] = []
  hoverEdit: number = -1
  msgs: Message[] = []

  constructor(
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _dialog: MdDialog,
    private _pxService: PxService
  ) { }

  ngOnInit() {
    this.getFileAttachTemplates()
  }

  goBack() {
    this._location.back()
  }

  private getFileAttachTemplates(msg?: Message) {
    this._loadingService.register('main')
    this._pxService
      .getFileAttachs('wf', 0, 'asc')
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.fileAttachs = response

        if (msg) this.msgs.push(msg)
      })
  }

  mapFileName(fileAttach: FileAttach): string {
    const name: string = fileAttach.fileAttachName
    const typePos: number = name.lastIndexOf('.')
    return name.substring(0, typePos)
  }

  add() {
    const dialog = this._dialog.open(DialogAddFileAttachTemplateComponent, {
      width: '80%', height: '90%'
    })
    dialog.afterClosed().subscribe((result: { uploader: any, fileAttach: FileAttach }) => {
      if (result) {
        this._loadingService.register('main')
        this._pxService.uploadList(result.uploader, this.genFileAttachDetail())
          .onCompleteAll = () => {
            this._loadingService.resolve('main')
            this.getFileAttachTemplates(this.genMsg('เพิ่ม', result.fileAttach))
          }
      }
    })
  }

  private genFileAttachDetail(): any {
    return {
      version: 1,
      linkType: 'wf',
      linkId: 0,
    }
  }

  private genMsg(action: string, fileAttach: FileAttach): Message {
    return {
      severity: 'success',
      summary: `${action}แบบฟอร์ม`,
      detail: `คุณได้ทำการ${action}แบบฟอร์ม ${this.mapFileName(fileAttach)}`
    }
  }

  edit(fileAttach: FileAttach) {
    const dialog = this._dialog.open(DialogAddFileAttachTemplateComponent, {
      width: '80%', height: '90%'
    })
    dialog.componentInstance.fileAttach = Object.assign({}, fileAttach)
    dialog.afterClosed().subscribe((result: { uploader: any, fileAttach: FileAttach }) => {
      if (result) {
        if (result.uploader) {
          this._loadingService.register('main')
          this._pxService.replaceFile(result.uploader, result.fileAttach)
            .onCompleteAll = () => {
              this._loadingService.resolve('main')
              this.getFileAttachTemplates(this.genMsg('แก้ไข', fileAttach))
            }
        } else {
          this._loadingService.register('main')
          this._pxService
            .updateFileAttachModel2(result.fileAttach)
            .subscribe(response => {
              this._loadingService.resolve('main')
              this.getFileAttachTemplates(this.genMsg('แก้ไข', fileAttach))
            })
        }
      }
    })
  }

  delete(fileAttach: FileAttach) {
    this._loadingService.register('main')
    this._pxService
      .removeFileAttach(fileAttach.id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        const index = this.fileAttachs.indexOf(fileAttach)
        this.fileAttachs.splice(index, 1)

        this.msgs.push(this.genMsg('ลบ', fileAttach))
      })
  }

  download(fileAttach: FileAttach) {
    this._pxService.downloadFileAttach(fileAttach)
  }

}
