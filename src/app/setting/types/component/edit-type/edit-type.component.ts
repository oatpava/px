import { TdLoadingService } from '@covalent/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { TypeService } from '../../service/type.service'
import { WorkflowTypes } from '../../model/workflowTypes.model'

@Component({
  selector: 'app-edit-type',
  templateUrl: './edit-type.component.html',
  styleUrls: ['./edit-type.component.styl'],
  providers: [TypeService]
})
export class EditTypeComponent implements OnInit {
  workFlowType: WorkflowTypes = new WorkflowTypes
  mode: string = 'Add'
  title: string = 'เพิ่มประเภทการส่ง'
  typeTitle: string = 'ชื่อประเภทการส่ง'
  actionType: string = 'ใช้ในการคำนวณการดำเนินงาน'
  workflowTypeId: number
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _typeService: TypeService,
  ) {

  }

  ngOnInit() {
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['workflowTypeId']))
          this.workflowTypeId = params['workflowTypeId']
        if (this.workflowTypeId > 0) {
          this.mode = 'Edit'
          this.title = 'แก้ไขประเภทการส่ง'
          this.getTypeById(this.workflowTypeId)
        }
      })
  }

  goBack() {
    this._location.back()
  }

  getTypeById(workflowTypeId: number): void {
    this._loadingService.register('main')
    this._typeService
      .getTypeById(workflowTypeId)
      .subscribe(response => {
        this.workFlowType = response as WorkflowTypes
      })
    this._loadingService.resolve('main')
  }

  createType(workFlowType: WorkflowTypes) {
    if (workFlowType.workflowTypeAction == 1)
      workFlowType.workflowTypeActionType = 'ไม่ใช้ในการคำนวณ'
    if (workFlowType.workflowTypeAction == 2)
      workFlowType.workflowTypeActionType = 'ใช้ในการคำนวณ'
    this._typeService.saveType(workFlowType).subscribe(response => {
      this.goBack()
    })
  }

  updateType(workFlowType: WorkflowTypes) {
    if (workFlowType.workflowTypeAction == 1)
      workFlowType.workflowTypeActionType = 'ไม่ใช้ในการคำนวณ'
    if (workFlowType.workflowTypeAction == 2)
      workFlowType.workflowTypeActionType = 'ใช้ในการคำนวณ'
    this._typeService.updateType(workFlowType).subscribe(response => {
      this.goBack()
    })
  }

  deleteType(workFlowType: WorkflowTypes) {
    this._typeService.deleteType(workFlowType.id).subscribe(response => {
      if (response != null) {
      } else {
        return;
      }
    })
  }
}
