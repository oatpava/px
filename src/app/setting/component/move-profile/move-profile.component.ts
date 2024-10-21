import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Message } from 'primeng/primeng'
import { DialogWarningComponent } from '../../../shared';
import { UserProfile } from '../../model/user-profile.model';
import { Structure } from '../../model/structure.model';

@Component({
  selector: 'app-move-profile',
  templateUrl: './move-profile.component.html',
  styleUrls: ['./move-profile.component.styl']
})
export class MoveProfileComponent implements OnInit {
  userProfile: UserProfile
  selectedStructure: Structure

  msgs: Message[] = []

  constructor(
    public dialogRef: MdDialogRef<MoveProfileComponent>,
    private _dialog: MdDialog
  ) { }

  ngOnInit() {
  }

  selectStructure(event) {
    this.selectedStructure = event
  }

  close() {
    this.dialogRef.close()
  }

  ok() {
    if (this.userProfile.structure.id == this.selectedStructure.id) {
      this.msgs.push({severity: 'warn', summary: 'หน่วยงานซ้ำ', detail: 'กรุณาเลือกหน่วยงานอื่นที่ไม่ใช่หน่วยงานของผู้ใช้งาน'})
      return
    }

    const dialog = this._dialog.open(DialogWarningComponent)
    dialog.componentInstance.header = "ยืนยันการย้ายผู้ใช้งาน"
    dialog.componentInstance.message = `คุณต้องการย้ายผู้ใช้งาน ${this.userProfile.fullName}\nจาก ${this.userProfile.structure.name} ไปยัง ${this.selectedStructure.name}\n\nใช่ หรือ ไม่`
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(this.selectedStructure)
      }
    })
  }

}
