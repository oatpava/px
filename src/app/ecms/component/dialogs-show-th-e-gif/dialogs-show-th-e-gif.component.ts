import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { SarabanEcmsService } from '../../service/saraban-ecms.service'
@Component({
  selector: 'px-dialogs-show-th-e-gif',
  templateUrl: './dialogs-show-th-e-gif.component.html',
  styleUrls: ['./dialogs-show-th-e-gif.component.styl'],
  providers: [SarabanEcmsService]
})
export class DialogsShowThEGifComponent implements OnInit {
  data: any
  listSend: any = []
  selectedRow: any = []
  allCheck: any
  fkCreateWorkflow: any = []
  fkDeleteInbox: any = []
  contentTitle: any
  contentBook: any
  contentNo: any
  searchFilter: any[] = []
  status: any[] = [
    { label: 'ทั้งหมด', value: 99 },
    { label: 'ยังไม่เปิด', value: 0 },
    { label: 'เปิดอ่านแล้ว', value: 1 },
    { label: 'ดำเนินการ ส่ง/ลงทะเบียน', value: 2 },
    { label: 'ทำเรื่องเสร็จ', value: 3 }
  ]
  constructor(
    private _ecmsService: SarabanEcmsService,
    public _dialog: MdDialog,
    public dialogRef: MdDialogRef<DialogsShowThEGifComponent>
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.getDataSend()
  }

  getDataSend() {
    this._ecmsService
      .sendContentDataECMSThEgif(this.data)
      .subscribe(response => {
        this.listSend = response.data
        console.log(response)
      })
  }

  close() {
    this.dialogRef.close()
  }

}
