import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'

import { TreeModule, TreeNode, Message, ChartModule } from 'primeng/primeng'

import { MdDialog, MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-report-log',
  templateUrl: './report-log.component.html',
  styleUrls: ['./report-log.component.styl']
})
export class ReportLogComponent implements OnInit {
  data: any
  report: any
  reportData: any
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    public dialogRef: MdDialogRef<ReportLogComponent>
  ) {

  }


  ngOnInit() {

    console.log(this.reportData)
    if (this.reportData.length == 1) {
      this.data = {
        labels: [this.reportData[0].moduleName],
        datasets: [
          {
            data: [this.reportData[0].countLog],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ]
          }]
      };
    }
    if (this.reportData.length == 2) {
      this.data = {
        labels: [this.reportData[0].moduleName, this.reportData[1].moduleName],
        datasets: [
          {
            data: [this.reportData[0].countLog, this.reportData[1].countLog],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ]
          }]
      };
    }
    if (this.reportData.length == 3) {
      this.data = {
        labels: [this.reportData[0].moduleName, this.reportData[1].moduleName, this.reportData[2].moduleName],
        datasets: [
          {
            data: [this.reportData[0].countLog, this.reportData[1].countLog, this.reportData[2].countLog],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ]
          }]
      };
    }
    if (this.reportData.length == 4) {
      this.data = {
        labels: [this.reportData[0].moduleName, this.reportData[1].moduleName, this.reportData[2].moduleName, this.reportData[3].moduleName],
        datasets: [
          {
            data: [this.reportData[0].countLog, this.reportData[1].countLog, this.reportData[2].countLog, this.reportData[3].countLog],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#5f9ea0"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#5f9ea0"
            ]
          }]
      };
    }

  }

  close(): void {
    this.dialogRef.close(false)
  }




}
