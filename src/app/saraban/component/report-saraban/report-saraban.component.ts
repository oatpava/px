import { Component, OnInit } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { URLSearchParams } from '@angular/http'

import { PxService } from '../../../main/px.service'
import { SarabanContentService } from '../../service/saraban-content.service'
import { InboxService } from '../../../mwp/service/inbox.service'
import { OutboxService } from '../../../mwp/service/outbox.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

import { Report } from '../../model/report.model'
import { SarabanContentFilter } from '../../model/SarabanContentFilter.model'

import { ReportComponent } from '../report/report.component'

@Component({
  selector: 'app-report-saraban',
  templateUrl: './report-saraban.component.html',
  styleUrls: ['./report-saraban.component.styl'],
  providers: [SarabanContentService, InboxService, OutboxService]
})
export class ReportSarabanComponent implements OnInit {
  reportList: Report[] = []
  reportType: string
  menuType: string
  folderType: number
  paramValue: string[] = [null, null, null, null, null]//startDate, endDate, folderId, linkId, userId //null = noparam
  searchModel: any

  constructor(
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _pxService: PxService,
    public dialogRef: MdDialogRef<ReportSarabanComponent>,
    private _dialog: MdDialog,
    private _inboxService: InboxService,
    private _outboxService: OutboxService,
    private _paramSarabanService: ParamSarabanService
  ) { }

  ngOnInit() {
    this.getReportList(this.menuType, this.folderType)
  }

  getReportList(menuType: string, folderType: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .getReportList(menuType, folderType)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.reportList = response as Report[]
        if (response.length == 1) {
          this.showReport(response[0], true)
        }
      })
  }

  showReport(report: Report, dontShowReportList: boolean) {
    let params = new URLSearchParams()
    if (report.parameters[0] != null) {//get date params
      let dialogRef = this._dialog.open(ReportComponent, {
        width: '40%'
      })
      if (report.parameters[3] != null) dialogRef.componentInstance.showEmsField = true
      dialogRef.afterClosed().subscribe(result => {
        this.paramValue[0] = dialogRef.componentInstance.startDate_str
        this.paramValue[1] = dialogRef.componentInstance.endDate_str
        this.paramValue[3] = dialogRef.componentInstance.ems
        for (let i = 0; i < report.parameters.length; i++) {
          if (report.parameters[i] != null) {
            params.set(report.parameters[i], this.paramValue[i])
          }
        }
        if (report.useTempTable) this.deleteTempTable(report)
        else this._pxService.report(report.url, this.reportType, params)
      })
    } else {
      if (!report.useTempTable) {
        for (let i = 0; i < report.parameters.length; i++) {
          if (report.parameters[i] != null) {
            params.set(report.parameters[i], this.paramValue[i])
          }
        }
        this._pxService.report(report.url, this.reportType, params)
      } else {
        this.deleteTempTable(report)
      }
      if (dontShowReportList) {
        setTimeout(() => {//must set timeout cause dialog thrown detexhChanged() => error
          this.close()
        }, 100)
      } else {
        this.close()
      }
    }
  }

  deleteTempTable(report: Report) {
    this._loadingService.register('main')
    this._sarabanContentService
      .deleteTempTable(report.url)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.genTempTable(report)
      })
  }

  genTempTable(report: Report) {//call service to fill temptable
    let params = new URLSearchParams()
    params.set("jobType", report.url)
    params.set("createdBy", '' + this._paramSarabanService.userId)

    this._loadingService.register('main')
    if (this.menuType == "list-saraban") {
      if (report.id < 5) {
        this._sarabanContentService
          .report1_2(report.url, +this.paramValue[2], this.searchModel)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this._pxService.report(report.url, this.reportType, params)
          })
      } else {
        let actionType: string = "X"
        if (report.id == 11) actionType = "F"
        else if (report.id == 12) actionType = "C"
        this._sarabanContentService
          .report101314(report.url, +this.paramValue[2], actionType, this.searchModel)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this._pxService.report(report.url, this.reportType, params)
          })
      }
    } else if (this.menuType == "list-folder") {
      let tmp = new SarabanContentFilter({
        wfContentContentStartDate: this.paramValue[0],
        wfContentContentEndDate: this.paramValue[1],
        wfContentBookStartDate: "",
        wfContentBookEndDate: ""
      })
      if (report.id == 6) {
        this._sarabanContentService
          .report56(report.url, +this.paramValue[2], tmp, 0)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this._pxService.report(report.url, this.reportType, params)
          })
      } else if (report.id == 7) {
        this._sarabanContentService
          .report56(report.url, +this.paramValue[2], tmp, +this.paramValue[4])
          .subscribe(response => {
            this._loadingService.resolve('main')
            this._pxService.report(report.url, this.reportType, params)
          })
      } else if (report.id == 16) {
        tmp.wfContentStr03 = this.paramValue[3]
        this._sarabanContentService
          .report1_2(report.url, -1, tmp)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this._pxService.report(report.url, this.reportType, params)
          })
      }
    } else if (this.menuType === "inbox") {
      this._inboxService
        .report(report.url, this.searchModel)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this._pxService.report(report.url, this.reportType, params)
        })
    } else if (this.menuType === "outbox") {
      this._outboxService
        .report(report.url, this.searchModel)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this._pxService.report(report.url, this.reportType, params)
        })
    }
  }

  close() {
    this.dialogRef.close()
  }

}
