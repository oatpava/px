import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Message } from 'primeng/primeng'
import { Observable } from 'rxjs/Observable'
import { SarabanEcmsService } from '../../service/saraban-ecms.service'

@Component({
  selector: 'app-send-ecms',
  templateUrl: './send-ecms.component.html',
  styleUrls: ['./send-ecms.component.styl'],
  providers: [SarabanEcmsService]
})
export class SendEcmsComponent implements OnInit {
  rootStructureId = 0
  userProfile: any
  structureTree = []
  selectedStructure: any = []
  searchTree: any = {
    thegifDepartmentName: '',
    thegifDepartmentCode: '',
  }
  msgs: Message[] = []
  listSearch: any[] = []
  constructor(
    private _ecmsService: SarabanEcmsService,
    public _dialog: MdDialog,
    public dialogRef: MdDialogRef<SendEcmsComponent>
  ) { }

  ngOnInit() {
    this._ecmsService
      .getECMSStructure(this.rootStructureId)
      .subscribe(response => {
        let i = 0
        for (let node of response.data) {
          this.structureTree.push({
            "label": node.thegifDepartmentName,
            "data": node.id,
            "expandedIcon": "fa-home",
            "collapsedIcon": "fa-home",
            "leaf": false,
            "expanded": true,
            "dataObj": node,
            "children": []
          })
        }
        Observable.forkJoin(
          this._ecmsService.getECMSStructure(1)
        ).subscribe((response: Array<any>) => {
          for (let node of response[0].data) {
            let icon = "fa-tag"
            if (node.thegifDepartmentServiceName != null) {
              icon = 'fa-circle-thin'
            }
            this.structureTree[0].children.push({
              "label": node.thegifDepartmentName,
              "data": node.id,
              "expandedIcon": icon,
              "collapsedIcon": icon,
              "leaf": false,
              "expanded": false,
              "dataObj": node,
              "children": []
            })
          }
        })
      })
  }
  loadNode(event) {
    if (event.node) {
      Observable.forkJoin(
        this._ecmsService.getECMSStructure(event.node.data)
      ).subscribe((response: Array<any>) => {
        let structures = []
        for (let userProfile of response[0].data) {
          let icon = "fa-tag"
          if (userProfile.thegifDepartmentServiceName != null) {
            icon = 'fa-circle-thin'
          }
          structures.push({
            "label": userProfile.thegifDepartmentName,
            "data": userProfile.id,
            "expandedIcon": icon,
            "collapsedIcon": icon,
            "leaf": true,
            "selectable": true,
            "dataObj": userProfile
          })
        }
        event.node.children = structures
      })
    }
  }
  delSelect(event) {
    let index = this.selectedStructure.indexOf(event)
    if (index >= 0) {
      this.selectedStructure.splice(index, 1)
    }
  }
  nodeSelect(item) {
    if (item.node.collapsedIcon != "fa-circle-thin") {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถเลือกได้',
        detail: 'เลือกได้เฉพาะหน่วยงานภายในเท่านั้น'
      })
    } else {
      this.selectedStructure.push(item.node)
    }
  }
  search(data) {
    this._ecmsService
      .getECMSSearchStructure(data)
      .subscribe(response => {
        this.listSearch = response.data
      })
  }
  selectData(data) {
    let name = data.thegifDepartmentName
    let newPush = {
      data: data.id,
      label: name,
      dataObj: data,
      collapsedIcon: "fa-circle-thin",
      expandedIcon: "fa-circle-thin",
    }
    if (data.code == true) {
      data.code = false
      let iData = this.selectedStructure.filter(pList => pList.data != newPush.data)
      this.selectedStructure = iData
    } else {
      data.code = true
      this.selectedStructure.push(newPush)
    }
  }
  ok() {
    this.dialogRef.close(this.selectedStructure)
  }
  close() {
    this.dialogRef.close()
  }

}
