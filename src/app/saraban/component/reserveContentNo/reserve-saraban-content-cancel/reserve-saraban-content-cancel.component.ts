import { Component, OnInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-reserve-saraban-content-cancel',
  templateUrl: './reserve-saraban-content-cancel.component.html',
  styleUrls: ['./reserve-saraban-content-cancel.component.styl']
})
export class ReserveSarabanContentCancelComponent implements OnInit {
  note: string =''

  constructor(
    public dialogRef: MdDialogRef<ReserveSarabanContentCancelComponent>,
  ) { }

  ngOnInit() {
    console.log('ReserveSarabanContentCancelComponent')
  }

  ok(){
    this.dialogRef.close(true)
  }
  cancel() {
    this.dialogRef.close(false)
  }

}
