import { Component, OnInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'

import { SarabanReserveContent } from '../../../model/sarabanReserveContent.model'

@Component({
  selector: 'app-dialog-list-reserve',
  templateUrl: './dialog-list-reserve.component.html',
  styleUrls: ['./dialog-list-reserve.component.styl']
})
export class DialogListReserveComponent implements OnInit {
  editContentNo: boolean = true
  lastNumber: number
  reserveNos: SarabanReserveContent[]
  canceledReserveNos: SarabanReserveContent[]
  selectedRow: SarabanReserveContent
  disableInsert: boolean = false
  insertAt: number

  preBookNos: string[]
  preBookNoIndex: number = 0
  editBookNumber: boolean = false
  bookNumber: number

  constructor(
    public dialogRef: MdDialogRef<DialogListReserveComponent>
  ) { 
  }

  ngOnInit() {
  }

  ok(selectedRow: SarabanReserveContent, type: number) {
    this.selectedRow = selectedRow
    this.dialogRef.close(type)
  }

  insertPoint() {
    this.dialogRef.close(0)
  }

  checkRange() {
    if (this.insertAt < 1 || this.insertAt > this.lastNumber) {
      this.insertAt = null
    }
  }

}
