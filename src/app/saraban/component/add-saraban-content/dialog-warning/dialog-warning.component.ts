import { Component, OnInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-dialog-warning',
  templateUrl: './dialog-warning.component.html',
  styleUrls: ['./dialog-warning.component.styl']
})
export class DialogWarningComponent implements OnInit {
  header: string = "ยืนยันการลบข้อมูล"
  message: string = "คุณต้องการลบข้อมูลใช่ หรือ ไม่"
  confirmation: boolean = true

  constructor(
    public dialogRef: MdDialogRef<DialogWarningComponent>
  ) { }

  ngOnInit() {
  }

  ok(): void {
    this.dialogRef.close(true);
  }
  cancel(): void {
    this.dialogRef.close(false);
  }

}
