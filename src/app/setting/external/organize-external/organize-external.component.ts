import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Observable'
import { StructureService } from '../../component/structure/structure.service'
import { TreeNode, Message } from 'primeng/primeng'

@Component({
  selector: 'app-organize-external',
  templateUrl: './organize-external.component.html',
  styleUrls: ['./organize-external.component.styl'],
  providers: [StructureService,],
})
export class OrganizeExternalComponent implements OnInit {
  @Input("selectDepartment") selectDepartment: boolean
  @Input("noneUser") noneUser: boolean
  @Output("onselectData") onselectData = new EventEmitter();
  @Input("alertMsgTo") aletMsgTo: boolean
  @Output('msgTo') msgTo = new EventEmitter();
  @Input("loadOnData") loadOnData
  rootStructureId = 0
  @Input("structureTree") structureTree = []
  selectedStructure: TreeNode;
  msgs: Message[] = [];
  firstList: any

  constructor(
    private _loadingService: TdLoadingService,
    private _structureService: StructureService
  ) { }

  ngOnInit() {
    this._loadingService.register('main')
    this._structureService
      .getOutStructures('1.0', '0', '1', '', '', this.rootStructureId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        let i = 0
        for (let node of response) {
          this.structureTree.push({
            "label": node.name,
            "data": node.id,
            "expandedIcon": "fa-home",
            "collapsedIcon": "fa-home",
            "leaf": false,
            "expanded": true,
            "dataObj": node,
            "children": []
          })
          this._loadingService.register('main')
          Observable.forkJoin(
            this._structureService.getOutStructures('1.0', '0', '200', 'orderNo', 'asc', node.id),
          ).subscribe((response: Array<any>) => {
            this._loadingService.resolve('main')
            for (let structure of response[0]) {
              this.structureTree[i].children.push({
                "label": (structure.shortName.length > 0) ? structure.name + ' (' + structure.shortName + ')' : structure.name,
                "data": structure.id,
                "expandedIcon": "fa-external-link-square",
                "collapsedIcon": "fa-external-link-square",
                "leaf": false,
                "selectable": true,
                "dataObj": structure
              })
            }
            i++
          })
        }
      })
  }

  loadData() {
    this._loadingService.register('main')
    this._structureService
      .getOutStructures('1.0', '0', '1', '', '', this.rootStructureId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        let i = 0
        for (let node of response) {
          this.structureTree.push({
            "label": node.name,
            "data": node.id,
            "expandedIcon": "fa-home",
            "collapsedIcon": "fa-home",
            "leaf": false,
            "expanded": true,
            "dataObj": node,
            "children": []
          })
          this._loadingService.register('main')
          Observable.forkJoin(
            this._structureService.getOutStructures('1.0', '0', '200', 'orderNo', 'asc', node.id),
          ).subscribe((response: Array<any>) => {
            this._loadingService.resolve('main')
            for (let structure of response[0]) {
              this.structureTree[i].children.push({
                "label": (structure.shortName.length > 0) ? structure.name + ' (' + structure.shortName + ')' : structure.name,
                "data": structure.id,
                "expandedIcon": "fa-external-link-square",
                "collapsedIcon": "fa-external-link-square",
                "leaf": false,
                "selectable": true,
                "dataObj": structure
              })
            }
            i++
          })
        }
      })
  }

  loadNode(event) {
    if (event.node) {
      this._loadingService.register('main')
      Observable.forkJoin(
        this._structureService.getOutStructures('1.0', '0', '200', 'orderNo', 'asc', event.node.data),
      ).subscribe((response: Array<any>) => {
        this._loadingService.resolve('main')
        let structures = []
        for (let structure of response[0]) {
          structures.push({
            "label": (structure.shortName.length > 0) ? structure.name + ' (' + structure.shortName + ')' : structure.name,
            "data": structure.id,
            "expandedIcon": "fa-external-link-square",
            "collapsedIcon": "fa-external-link-square",
            "leaf": false,
            "selectable": true,
            "dataObj": structure
          })
        }
        event.node.children = structures
      })
    }
  }

  nodeSelect(event) {
    if (event.node) {
      //เชค selectDepartment สามารถเลือกหน่วยงานได้หรือไม่
      if (this.selectDepartment) {
        event.node.dataObj.type = 'S'
        if (event.node.expandedIcon === 'fa-user') {
          event.node.dataObj.type = 'U'
        }
        this.onselectData.emit(event.node.dataObj)
      } else {
        if (event.node.expandedIcon === 'fa-user') {
          this.onselectData.emit(event.node.dataObj)
        } else {
          if (this.aletMsgTo) {
            this.msgTo.emit({
              severity: 'warn',
              summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น',
              detail: event.node.label
            })
          } else {
            this.msgs = [];
            this.msgs.push({
              severity: 'warn',
              summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น',
              detail: event.node.label
            })
          }
        }
      }
    }
  }

}
