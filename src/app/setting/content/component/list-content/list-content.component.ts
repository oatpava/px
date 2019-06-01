import { TdLoadingService } from '@covalent/core';
import { SarabanFolder } from '../../../../saraban/model/sarabanFolder.model';
import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AssignContentService } from '../../service/assign-content.service'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
@Component({
  selector: 'tree-view',
  templateUrl: './list-content.component.html',
  styleUrls: ['./list-content.component.styl'],
})
export class ListContentComponent implements OnInit {
  @Input("selectDepartment") selectDepartment: boolean
  @Output("onselectData") onselectData = new EventEmitter();
  @Input("alertMsgTo") aletMsgTo: boolean
  @Output('msgTo') msgTo = new EventEmitter();
  rootStructureId = 0
  structureTree = []
  selectedStructure: TreeNode;
  msgs: Message[] = [];
  firstList: any
  //--//

  @Input() directories: Array<SarabanFolder>;
  @Input() userList: Array<SarabanFolder>;
  @Input() type: number;
  @Input() objId: number;
  expanded: boolean;
  checked: boolean;
  pathSave: string
  constructor(private _loadingService: TdLoadingService,
    private _assignContentService: AssignContentService, ) {
    this.expanded = false
    this.checked = false
  }

  delete(index: number) {
    this.userList.splice(index, 1);
  }

  containsObject(id, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
    this._loadingService.register('main')
    this._assignContentService
      .getFolders(0)
      .subscribe(response => {
        let i = 0
        for (let node of response) {
          this.structureTree.push({
            "label": node.wfFolderName,
            "data": node,
            "expandedIcon": "fa-home",
            "collapsedIcon": "fa-home",
            "leaf": false,
            "expanded": false,
            "children": []
          })
        }
      })
    this._loadingService.resolve('main')
  }

  selectNode(event) {
    if (event.node) {
      if (event.node.data.wfContentType.id == 1 || event.node.data.wfContentType.id == 2) {
        let push = true;
        for (let user of this.userList) {
          if (user.wfFolderLinkFolderId == event.node.data.id || user.id == event.node.data.id) {
            push = false
          }
        }
        if (push)
          this.save(event.node.data)
      }
    }
  }

  loadNode(event): void {
    if (event.node) {
      let child = []
      this._loadingService.register('main')
      this._assignContentService
        .getFolders(event.node.data.id)
        .subscribe(response => {
          let i = 0
          for (let node of response) {
            child.push({
              "label": node.wfFolderName,
              "data": node,
              "expandedIcon": "fa-home",
              "collapsedIcon": "fa-home",
              "leaf": true,
              "expanded": false,
              "children": []
            })
            if (node.wfContentType.id != 1 && node.wfContentType.id != 2)
              child[i].leaf = false
            i++
          }
        })
      event.node.children = child
      this._loadingService.resolve('main')
    }
  }

  save(shortcut: SarabanFolder) {
    this.pathSave = this.type == 2 ? 'createShortcutStructure' : 'createShortcutUserProfile'
    this.saveShortcut(shortcut, this.objId, this.pathSave)

  }

  saveShortcut(shortcut: SarabanFolder, objId: number, pathSave: string) {
    let dataSave = new SarabanFolder
    // dataSave.version = shortcut.version
    // dataSave.id = shortcut.id
    dataSave.wfFolderParentType = shortcut.wfFolderParentType
    dataSave.parentKey = shortcut.parentKey
    dataSave.nodeLevel = shortcut.nodeLevel
    dataSave.wfContentType = shortcut.wfContentType
    dataSave.wfContentType2 = shortcut.wfContentType2
    // dataSave.createdBy = shortcut.createdBy
    // dataSave.createdDate = shortcut.createdDate
    // dataSave.orderNo = shortcut.orderNo
    // dataSave.removedBy = shortcut.removedBy
    // dataSave.removedDate = shortcut.removedDate
    // dataSave.updatedBy = shortcut.updatedBy
    // dataSave.updatedDate = shortcut.updatedDate
    dataSave.wfFolderExpireDate = shortcut.wfFolderExpireDate
    dataSave.wfFolderOwnerName = shortcut.wfFolderOwnerName
    dataSave.convertId = shortcut.convertId
    dataSave.wfFolderName = shortcut.wfFolderName
    dataSave.wfFolderType = shortcut.wfFolderType
    dataSave.parentId = shortcut.parentId
    dataSave.wfFolderParentName = shortcut.wfFolderParentName
    dataSave.wfFolderDetail = shortcut.wfFolderDetail
    dataSave.wfFolderAutorun = shortcut.wfFolderAutorun
    dataSave.wfFolderBookNoType = shortcut.wfFolderBookNoType
    dataSave.wfFolderPreBookNo = shortcut.wfFolderPreBookNo
    dataSave.wfFolderPreContentNo = shortcut.wfFolderPreContentNo
    dataSave.wfFolderOwnerId = shortcut.wfFolderOwnerId
    dataSave.wfFolderLinkFolderId = shortcut.wfFolderLinkFolderId == 0 ? shortcut.id : shortcut.wfFolderLinkFolderId
    dataSave.wfFolderLinkId = shortcut.wfFolderLinkId
    dataSave.wfFolderByBudgetYear = shortcut.wfFolderByBudgetYear
    dataSave.wfFolderTypeYearExpire = shortcut.wfFolderTypeYearExpire
    dataSave.wfFolderNumYearExpire = shortcut.wfFolderNumYearExpire
    this._loadingService.register('main')
    this._assignContentService.saveShortcut(dataSave, objId, dataSave.wfFolderLinkFolderId, pathSave).subscribe(response => {
      if (response != null) {
        if (response.success == true) {
            if (response.data.length > 0)
              dataSave.id = response.data[0].id
            else
              dataSave.id = response.data.id
            this.userList.push(dataSave)
          this._loadingService.resolve('main')
        }
      } else {
        this._loadingService.resolve('main')
        return;
      }
    })
  }
}