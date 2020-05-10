import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-list-menu-ecms',
  templateUrl: './list-menu-ecms.component.html',
  styleUrls: ['./list-menu-ecms.component.styl']
})
export class ListMenuEcmsComponent implements OnInit {
  reportList: any[] = [
    // { id: 1, name: 'ส่งภายนอก', type: 1 },
    { id: 2, name: 'รับภายนอก', type: 2 },
    { id: 3, name: 'สถานะหนังสือ', type: 4 },
    { id: 4, name: 'ขอรหัสกระทรวง', type: 3 },
    { id: 5, name: 'ขอข้อมูลหน่วยงาน', type: 3 },
    { id: 6, name: 'ขอรหัสชั้นความเร็ว', type: 3 },
    { id: 7, name: 'ขอรหัสชั้นความลับ', type: 3 },
    { id: 8, name: 'ขอประเภทไฟล์เอกสาร', type: 3 },
    { id: 9, name: 'ขอสอบถามสถานะส่งหนังสือ', type: 3 },
    { id: 10, name: 'การตรวจสอบเวลา', type: 3 },
  ]
  constructor(
    public dialogRef: MdDialogRef<ListMenuEcmsComponent>,
  ) { }

  ngOnInit() {
  }

  showReport(item) {
    this.dialogRef.close(item)
  }


  close() {
    this.dialogRef.close()
  }


}
