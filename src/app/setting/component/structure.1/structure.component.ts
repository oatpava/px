import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { StructureService } from './structure.service';
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
@Component({
  selector: 'px-structure2',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.styl'],
  providers: [StructureService,],
})


export class StructureComponent2 implements OnInit {
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
    private _structureService: StructureService,
  ) {

  }

  ngOnInit() {
    console.log(this.noneUser)
    this._structureService
      // .getStructures('1.0', '0', '1', '', '', this.rootStructureId)
      .getStructuresV2()
      .subscribe(res => {
        console.log('response = ', res)
        let i = 0
        for (let node of res.data) {

      
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
          

          Observable.forkJoin(
            this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', node.id),
            this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', node.id),
          ).subscribe((response: Array<any>) => {
            let structures = []
            if (res.userProfileType == 1) {
            for (let structure of response[0]) {
              this.structureTree[i].children.push({
                "label": structure.name,
                "data": structure.id,
                "expandedIcon": "fa-tag",
                "collapsedIcon": "fa-tag",
                "leaf": false,
                "selectable": true,
                "dataObj": structure
              })
            }
          }
            if (!this.noneUser) {
              let userProfiles = []
              for (let userProfile of response[1]) {
                this.structureTree[i].children.push({
                  "label": userProfile.fullName,
                  "data": userProfile.id,
                  "expandedIcon": "fa-user",
                  "collapsedIcon": "fa-user",
                  "leaf": true,
                  "selectable": true,
                  "dataObj": userProfile
                })
              }
            }
            i++;
          });


        }

      });

  }

  loadData() {
    console.log('--loadData--')
    this._structureService
      // .getStructures('1.0', '0', '1', '', '', this.rootStructureId)
      .getStructuresV2()
      .subscribe(response => {
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
          Observable.forkJoin(
            this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', node.id),
            this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', node.id),
          ).subscribe((response: Array<any>) => {
            let structures = []
            for (let structure of response[0]) {
              this.structureTree[i].children.push({
                "label": structure.name,
                "data": structure.id,
                "expandedIcon": "fa-tag",
                "collapsedIcon": "fa-tag",
                "leaf": false,
                "selectable": true,
                "dataObj": structure
              })
            }
            if (!this.noneUser) {
              let userProfiles = []
              for (let userProfile of response[1]) {
                this.structureTree[i].children.push({
                  "label": userProfile.fullName,
                  "data": userProfile.id,
                  "expandedIcon": "fa-user",
                  "collapsedIcon": "fa-user",
                  "leaf": true,
                  "selectable": true,
                  "dataObj": userProfile
                })
              }
            }
            i++;
          });

        }

      });
  }

  loadNode(event) {
    console.log('--loadNode--')
    if (event.node) {
      Observable.forkJoin(
        this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', event.node.data),
        this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', event.node.data),
      ).subscribe((response: Array<any>) => {
        let structures = []
        for (let structure of response[0]) {
          structures.push({
            "label": structure.name,
            "data": structure.id,
            "expandedIcon": "fa-tag",
            "collapsedIcon": "fa-tag",
            "leaf": false,
            "selectable": true,
            "dataObj": structure
          })
        }
        if (!this.noneUser) {
          let userProfiles = []
          for (let userProfile of response[1]) {
            structures.push({
              "label": userProfile.fullName,
              "data": userProfile.id,
              "expandedIcon": "fa-user",
              "collapsedIcon": "fa-user",
              "leaf": true,
              "selectable": true,
              "dataObj": userProfile
            })
          }
        }
        event.node.children = structures
      });
    }
  }

  nodeSelect(event) {
    console.log('--event--')
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
              detail: event.node.label,
            })
          } else {
            this.msgs = [];
            this.msgs.push(
              {
                severity: 'warn',
                summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น',
                detail: event.node.label,
              },
            );
          }
        }
      }
      //เชค selectDepartment สามารถเลือกหน่วยงานได้หรือไม่
    }
  }

  nodeUnselect(event) {
  }

}
