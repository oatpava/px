import { Component, OnInit} from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'

import { WorkflowService } from '../../../../mwp/service/workflow.service'

import { Workflow } from '../../../../mwp/model/workflow.model'

import { ReportSarabanComponent } from '../../report-saraban/report-saraban.component'

@Component({
  selector: 'app-dialog-workflow-text',
  templateUrl: './dialog-workflow-text.component.html',
  styleUrls: ['./dialog-workflow-text.component.styl'],
  providers: [WorkflowService]
})
export class DialogWorkflowTextComponent implements OnInit {
  documentId: number
  contentTitle: string
  workflows: Workflow[]
  columns: any[] = [
    { field: 'workflowActionName', header: 'ผู้ดำเนินการ', sort: false },
    { field: 'workflowActionType', header: 'ดำเนินการ', sort: false },
    { field: 'createdDate', header: 'วันและเวลาที่ดำเนินการ', sort: false },
    { field: 'workflowNote', header: 'รายละเอียด', sort: false },
    { field: 'workflowDescription', header: 'หมายเหตุ', sort: false }
  ]

  constructor(
    public dialogRef: MdDialogRef<DialogWorkflowTextComponent>,
    private _dialog: MdDialog,
    private _workflowService: WorkflowService
  ) { }

  ngOnInit() {
    this.getWorkflows(this.documentId)
  }

  getWorkflows(linkId: number) {
    this._workflowService
      .listWithDetail(linkId, 'asc')
      .subscribe(response => {
        this.workflows = response as Workflow[]
      })
  }

  report(reportType: string) {
    let dialogRef = this._dialog.open(ReportSarabanComponent, {
      width: '60%'
    })
    dialogRef.componentInstance.reportType = reportType
    dialogRef.componentInstance.menuType = 'workflow'
    dialogRef.componentInstance.folderType = 0
    dialogRef.componentInstance.paramValue = [null, null, null, '' + this.documentId, null]
  }

  close() {
    this.dialogRef.close()
  }


}
