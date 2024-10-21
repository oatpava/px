import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Message } from 'primeng/primeng'
import { DialogWarningComponent } from '../../../shared';
import { Structure } from '../../model/structure.model';

@Component({
  selector: 'app-move-structure',
  templateUrl: './move-structure.component.html',
  styleUrls: ['./move-structure.component.styl']
})
export class MoveStructureComponent implements OnInit {
  isOrganize: boolean = false
  structure: Structure
  selectedStructure: Structure

  msgs: Message[] = []
  
  constructor(
    public dialogRef: MdDialogRef<MoveStructureComponent>,
    private _dialog: MdDialog,
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
    if (this.structure.id == this.selectedStructure.id) {
      this.msgs.push({severity: 'warn', summary: 'หน่วยงานซ้ำ', detail: 'กรุณาเลือกหน่วยงานอื่นที่ไม่ใช่หน่วยงานเดิม'})
      return
    }

    if (this.structure.parentId == this.selectedStructure.id) {
      this.msgs.push({severity: 'warn', summary: 'หน่วยงานซ้ำ', detail: 'กรุณาเลือกหน่วยงานอื่นที่ไม่ใช่หน่วยงานเดิม'})
      return
    }

    const dialog = this._dialog.open(DialogWarningComponent)
    dialog.componentInstance.header = "ยืนยันการย้ายหน่วยงาน"
    dialog.componentInstance.message = `คุณต้องการย้ายหน่วยงาน ${this.structure.name} ไปยัง ${this.selectedStructure.name}\n\nใช่ หรือ ไม่`
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(this.selectedStructure)
      }
    })
  }

}
