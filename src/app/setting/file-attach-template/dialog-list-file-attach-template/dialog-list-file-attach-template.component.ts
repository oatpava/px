import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-list-file-attach-template',
  templateUrl: './dialog-list-file-attach-template.component.html',
  styleUrls: ['./dialog-list-file-attach-template.component.styl']
})
export class DialogListFileAttachTemplateComponent implements OnInit {
  fileAttachs: any[] = []
  hoverEdit: number = -1
  countCheck: number = 0

  constructor(
    private _dialogRef: MdDialogRef<DialogListFileAttachTemplateComponent>
  ) { }

  ngOnInit() {
    this.fileAttachs.forEach(fileAttach => fileAttach.check = false)
  }

  close() {
    this._dialogRef.close()
  }

  check(event, fileAttach: any) {
    if (event.checked) {
      fileAttach.check = true
      this.countCheck++
    } else {
      fileAttach.check = false
      this.countCheck--
    }
  }

  ok() {
    const tmp = this.fileAttachs
      .filter(fileAttach => fileAttach.check)
      .map(fileAttach => {
        const name: string = fileAttach.fileAttachName
        const typePos: number = name.lastIndexOf('.')
        fileAttach.fileAttachName = name.substring(0, typePos)
        return fileAttach
      })

    this._dialogRef.close(tmp)
  }

}
