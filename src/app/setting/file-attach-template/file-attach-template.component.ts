import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import { PxService } from '../../main/px.service'
import { MdDialog } from '@angular/material';
import { FileAttach } from '../../main/model/file-attach.model';
// import { DialogAddFileAttachTemplateComponent } from './dialog-add-file-attach-template/dialog-add-file-attach-template.component';

@Component({
  selector: 'app-file-attach-template',
  templateUrl: './file-attach-template.component.html',
  styleUrls: ['./file-attach-template.component.styl'],
  providers: [PxService]
})
export class FileAttachTemplateComponent implements OnInit {
  fileAttachs: FileAttach[] = []
  hoverEdit: number = -1

  constructor(
    private _loadingService: TdLoadingService,
    private _dialog: MdDialog,
    private _pxService: PxService
  ) { }

  ngOnInit() {
    this.getFileAttachTEmplates()
  }

  private getFileAttachTEmplates() {
    this._loadingService.register('main')
    this._pxService
      .getFileAttachs('wf', 0, 'asc')
      // .getFileAttachs('dms', 41, 'asc')
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.fileAttachs = response
      })
  }

  add() {
    // const dialog = this._dialog.open(DialogAddFileAttachTemplateComponent, {
    //   width: '80%', height: '90%'
    // })
  }

  edit(fileAttach: FileAttach) {
    // const dialog = this._dialog.open(DialogAddFileAttachTemplateComponent, {
    //   width: '80%', height: '90%'
    // })
    // dialog.componentInstance.fileAttach = Object.assign({}, fileAttach)
  }

  delete() {

  }

  download() {

  }

}
