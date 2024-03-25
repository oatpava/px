import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, TdLoadingService } from '@covalent/core';
import { PxService } from '../../main/px.service'
import { MdDialog } from '@angular/material';
import { FileAttach } from '../../main/model/file-attach.model';

@Component({
  selector: 'app-file-attach-template',
  templateUrl: './file-attach-template.component.html',
  styleUrls: ['./file-attach-template.component.styl'],
  providers: [PxService]
})
export class FileAttachTemplateComponent implements OnInit {
  readonly columns: ITdDataTableColumn[] = [
    { name: 'fileAttachName', label: 'ชื่อเอกสาร' },
  ]
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
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.fileAttachs = response
      })
  }

  add() {

  }

  edit() {

  }

  delete() {

  }

  upload() {

  }

  download() {

  }

}
