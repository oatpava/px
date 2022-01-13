import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode, Message } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable'
import { MdDialogRef } from '@angular/material'
import { FolderService } from '../../service/folder.service'

@Component({
  selector: 'app-dialog-list-folder',
  templateUrl: './dialog-list-folder.component.html',
  styleUrls: ['./dialog-list-folder.component.styl'],
  providers: [FolderService]
})
export class DialogListFolderComponent implements OnInit {

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
  FolderId: number

  constructor(
    private _folderService: FolderService,
    public dialogRef: MdDialogRef<DialogListFolderComponent>
  ) { }

  ngOnInit() {
    this.structureTree.push({
      "label": 'ระบบจัดเก็บเอกสาร',
      "data": 1,
      "expandedIcon": "fa-home",
      "collapsedIcon": "fa-home",
      "leaf": false,
      "expanded": true,
      "dataObj": null,
      "children": []
    })
    this._folderService
      // .getFolders(1) // with out auth
      .getFoldersWithAuth(1) // with  auth
      .subscribe(response => {
        for (let folder of response) {
          if (folder.folderType == 'C') {
            this.iconDms = 'fa-th-large'
          } else if (folder.folderType == 'D') {
            this.iconDms = 'fa-tasks'
          } else if (folder.folderType == 'F') {
            this.iconDms = 'fa-folder-o'
          }

          this.structureTree[0].children.push({
            "label": folder.folderName,
            "data": folder.id,
            "expandedIcon": this.iconDms,
            "collapsedIcon": this.iconDms,
            "leaf": false,
            "selectable": true,
            "dataObj": folder
          })
        }
      })
    console.log('FolderId = ', this.FolderId)

  }

  loadNode(event) {
    console.log(event)
    if (event.node) {
      Observable.forkJoin(
        // this._documentTypeService.getListchildByParent(event.node.data),
        this._folderService
          .getFoldersWithAuth(event.node.data)
      ).subscribe((response: Array<any>) => {
        let structures = []
        for (let folder of response[0]) {
          if (folder.folderType == 'C') {
            this.iconDms = 'fa-th-large'
          } else if (folder.folderType == 'D') {
            this.iconDms = 'fa-tasks'
          } else if (folder.folderType == 'F') {
            this.iconDms = 'fa-folder-o'
          }
          structures.push({
            "label": folder.folderName,
            "data": folder.id,
            "expandedIcon": this.iconDms,
            "collapsedIcon": this.iconDms,
            "leaf": false,
            "selectable": true,
            "dataObj": folder
          })
        }

        event.node.children = structures
      })
    }
  }

  nodeSelect(event) {
    if (event.node) {
      if (event.node.expandedIcon === 'fa-th-large' || event.node.expandedIcon === 'fa-tasks') {
        this.msgs.push(
          {
            severity: 'warn',
            summary: 'เลือกได้แต่ที่เก็บเอกสารประเภท folder',
            // detail: event.node.label,
          });
      }
      if (event.node.expandedIcon === 'fa-folder-o') {
        this._folderService
          .getFoldersWithAuth(event.node.data)
          .subscribe((response: Array<any>) => {
            console.log(response.length)
            if (response.length > 0) {

              this.loadNode(event)

            } else {
              if (event.node.dataObj.id == this.FolderId) {
                this.msgs.push(
                  {
                    severity: 'warn',
                    summary: 'ที่เก็บเอกสารนี้เป็นที่อยู่ของเอกสาร ณ ปัจจุบันแล้ว',
                    // detail: event.node.label,
                  })
              } else {
                this.dialogRef.close(event.node.dataObj);
              }
            }
          })
      }
    }
  }

  nodeUnselect(event) {
  }

}
