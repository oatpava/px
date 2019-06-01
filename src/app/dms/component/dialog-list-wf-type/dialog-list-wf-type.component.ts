import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable'
import { DocumentTypeService } from '../../../setting/document-type/service/document-type.service'
import { WfDocumentType } from '../../../setting/document-type/model/wfDocumentType.model';
import { MdDialog, MdDialogRef } from '@angular/material'
@Component({
  selector: 'app-dialog-list-wf-type',
  templateUrl: './dialog-list-wf-type.component.html',
  styleUrls: ['./dialog-list-wf-type.component.styl'],
  providers: [DocumentTypeService]
})
export class DialogListWfTypeComponent implements OnInit {

  @Input("selectDepartment") selectDepartment: boolean
  @Output("onselectData") onselectData = new EventEmitter();
  @Input("alertMsgTo") aletMsgTo: boolean
  @Output('msgTo') msgTo = new EventEmitter();
  rootStructureId = 0
  structureTree = []
  selectedStructure: TreeNode;
  msgs: Message[] = [];
  firstList: any
  iconDms: string

  constructor(
    private _documentTypeService: DocumentTypeService,
    public dialogRef: MdDialogRef<DialogListWfTypeComponent>
  ) { }

  ngOnInit() {
    this.structureTree.push({
      "label": 'ประเภทเอกสาร',
      "data": 1,
      "expandedIcon": "fa-home",
      "collapsedIcon": "fa-home",
      "leaf": false,
      "expanded": true,
      "dataObj": null,
      "children": []
    })

    this._documentTypeService
      .getParent()
      .subscribe(response => {
        let structures = []
        for (let folder of response) {
          console.log(folder)
          this.structureTree[0].children.push({
            "label": folder.name,
            "data": folder.id,
            "expandedIcon": "fa-folder-o",
            "collapsedIcon": "fa-folder-o",
            "leaf": false,
            "selectable": true,
            "dataObj": folder
          })
        }
      })

  }

  loadNode(event) {
    console.log(event)
    if (event.node) {
      Observable.forkJoin(
        this._documentTypeService.getListchildByParent(event.node.data),
      ).subscribe((response: Array<any>) => {
        let structures = []
        for (let folder of response[0]) {
          // console.log(folder)
          // if (folder.folderType == 'D') {
          //   this.iconDms = 'fa-th-large'
          // } else if (folder.folderType == 'C') {
          //   this.iconDms = 'fa-tasks'
          // } else if (folder.folderType == 'F') {
          //   this.iconDms = 'fa-folder-o'
          // }
           this.iconDms = 'fa-folder-o'
          structures.push({
            "label": folder.name,
            "data": folder.id,
            "expandedIcon": this.iconDms,
            "collapsedIcon": this.iconDms,
            "leaf": false,
            "selectable": true,
            "dataObj": folder
          })
        }

        event.node.children = structures
      });
    }
  }

  nodeSelect(event) {
    if (event.node) {
      //เชค selectDepartment สามารถเลือกหน่วยงานได้หรือไม่
      // if (this.selectDepartment) {
      //   event.node.dataObj.type = 'S'
      //   if (event.node.expandedIcon === 'fa-user') {
      //     event.node.dataObj.type = 'U'
      //   }
      //   this.onselectData.emit(event.node.dataObj)
      // } else {
      //   if (event.node.expandedIcon === 'fa-user') {
      //     this.onselectData.emit(event.node.dataObj)
      //   } else {
      //     if (this.aletMsgTo) {
      //       this.msgTo.emit({
      //         severity: 'warn',
      //         summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น',
      //         detail: event.node.label,
      //       })
      //     } else {
      //       this.msgs = [];
      //       this.msgs.push(
      //         {
      //           severity: 'warn',
      //           summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น',
      //           detail: event.node.label,
      //         },
      //       );
      //     }
      //   }
      // }
      //เชค selectDepartment สามารถเลือกหน่วยงานได้หรือไม่
      // console.log(event.node.dataObj)
      this.dialogRef.close(event.node.dataObj);
    }
  }

  nodeUnselect(event) {
  }

}
