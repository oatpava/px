import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Message } from 'primeng/primeng'
import { Observable } from 'rxjs/Observable'
import { DatePipe } from '@angular/common'
import { SarabanEcmsService } from '../../service/saraban-ecms.service'
@Component({
  selector: 'app-status-ecms',
  templateUrl: './status-ecms.component.html',
  styleUrls: ['./status-ecms.component.styl'],
  providers: [SarabanEcmsService]
})
export class StatusEcmsComponent implements OnInit {
  ecmsType: any
  statusCheckTime: string = ''
  listData: any[] = []
  fkUpdadte: any = []
  msgs: Message[]
  constructor(
    private _ecmsService: SarabanEcmsService,
    public dialogRef: MdDialogRef<StatusEcmsComponent>,
  ) { }

  ngOnInit() {
    if (this.ecmsType.id == 4) { //ขอรหัสกระทรวง
      this.getECMSMinistry()
    }
    if (this.ecmsType.id == 5) { //ขอข้อมูลหน่วยงาน
      this.getECMSOrganization()
    }
    if (this.ecmsType.id == 6) { //ขอรหัสชั้นความเร็ว
      this.getECMSSpeed()
    }
    if (this.ecmsType.id == 7) { //ขอรหัสชั้นความลับ
      this.getECMSSecret()
    }
    if (this.ecmsType.id == 8) { //ขอประเภทไฟล์เอกสาร
      this.getECMSMimeCode()
    }
    if (this.ecmsType.id == 9) { //ขอสอบถามสถานะส่งหนังสือ
      this.getECMSStatus()
    }
    if (this.ecmsType.id == 10) { //การตรวจสอบเวลา
      this.getTimeCheck()
    }
  }

  getECMSStatus() {
    this._ecmsService
      .getECMSStatus()
      .subscribe(response => {
        response.data.forEach(element => {
          if (element.errorDescription !== '') {
            this.statusCheckTime = element.errorDescription
          } else {
            this.statusCheckTime = element.result
          }
        })
      })
  }
  getECMSMimeCode() {
    this._ecmsService
      .getECMSMimeCode()
      .subscribe(response => {
        this.listData = response.data
      })
  }
  getECMSSecret() {
    this._ecmsService
      .getECMSSecret()
      .subscribe(response => {
        this.listData = response.data
      })
  }
  getECMSSpeed() {
    this._ecmsService
      .getECMSSpeed()
      .subscribe(response => {
        this.listData = response.data
      })
  }
  getECMSOrganization() {
    this._ecmsService
      .getECMSOrganization()
      .subscribe(response => {
        this.listData = response.data
      })
  }
  getTimeCheck() {
    this._ecmsService
      .getECMSTimeCheck()
      .subscribe(response => {
        response.data.forEach(element => {
          if (element.errorDescription !== '') {
            this.statusCheckTime = element.errorDescription
          } else {
            this.statusCheckTime = element.result
          }
        })
      })
  }
  getECMSMinistry() {
    this._ecmsService
      .getMinistry()
      .subscribe(response => {
        this.listData = response.data
      })
  }
  updateOrg() {
    this.fkUpdadte.push(this._ecmsService.createEcmsOrganization())
    Observable.forkJoin(this.fkUpdadte)
      .subscribe(response2 => {
        this.fkUpdadte = []
        this.msgs = []
        this.msgs.push({
          severity: 'info',
          summary: 'ปรับปรุงโครงสร้างสำเร็จ',
          detail: 'ปรับปรุงโครงสร้างสำเร็จแล้ว'
        })
      })
  }
  updateMine() {
    this.fkUpdadte.push(this._ecmsService.createEcmsMinistry())
    Observable.forkJoin(this.fkUpdadte)
      .subscribe(response2 => {
        this.fkUpdadte = []
        this.msgs = []
        this.msgs.push({
          severity: 'info',
          summary: 'ปรับปรุงโครงสร้างสำเร็จ',
          detail: 'ปรับปรุงโครงสร้างสำเร็จแล้ว'
        })
      })
  }
  close() {
    this.dialogRef.close()
  }
}
