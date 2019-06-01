import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-dialog-setting-search-filter',
  templateUrl: './dialog-setting-search-filter.component.html',
  styleUrls: ['./dialog-setting-search-filter.component.styl']
})
export class DialogSettingSearchFilterComponent implements OnInit {
  searchfields: { selected: boolean, name: string }[]
  allCheck: boolean = true

  constructor(
    public dialogRef: MdDialogRef<DialogSettingSearchFilterComponent>
  ) {
    this.searchfields = [
      { selected: true, name: "ปี" },
      { selected: true, name: "สถานะหนังสือ" },
      { selected: true, name: "เลขทะเบียน" },
      { selected: true, name: "ลำดับเลขทะเบียน" },
      { selected: true, name: "เลขที่หนังสือ" },
      { selected: true, name: "วันที่" },
      { selected: true, name: "ลงวันที่" },
      { selected: true, name: "จาก" },
      { selected: true, name: "ถึง" },
      { selected: true, name: "เรื่อง" },
      { selected: true, name: "หมายเหตุ" },
      { selected: true, name: "ผู้รับผิดชอบ" },
      { selected: true, name: "ข้อความในเอกสารแนบ" },
      { selected: true, name: "ไปรษณีย์ลงทะเบียน" }
    ]
  }

  ngOnInit() {
  }

  checkAll() {
    this.searchfields.forEach(searchfield => {
      searchfield.selected = this.allCheck
    })
  }

  ok() {
    this.dialogRef.close(true)
  }

}
