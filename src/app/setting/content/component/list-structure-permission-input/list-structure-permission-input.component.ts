import { Router, ActivatedRoute } from '@angular/router';
import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Structure } from '../../model/structure'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
@Component({
  selector: 'structure-view-permission',
  templateUrl: './list-structure-permission-input.component.html',
  styleUrls: ['./list-structure-permission-input.component.styl'],
})
export class ListStructurePermissionInputComponent implements OnInit {
  @Input("selectDepartment") selectDepartment: boolean
  @Output("onselectData") onselectData = new EventEmitter();
  @Input("alertMsgTo") aletMsgTo: boolean
  @Output('msgTo') msgTo = new EventEmitter();
  @Input() dataList : Array<any>
  rootStructureId = 0
  structureTree = []
  selectedUser: TreeNode;
  msgs: Message[] = [];
  firstList: any
  // directories = []
  // @Input() directories: Array<Structure>;
  @Input() userList: Array<Structure>;
  expanded: boolean;
  checked: boolean;
  constructor(private _route: ActivatedRoute,
    private _router: Router, ) {
    this.expanded = false
    this.checked = false
  }

  delete(id: number) {
    this.userList.splice(id, 1);
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
    for (let node of this.dataList) {
      this.structureTree.push({
        "label": node.name,
        "data": node,
        "expandedIcon": "fa-home",
        "collapsedIcon": "fa-home",
        "leaf": false,
        "expanded": true,
        "children": []
      })
    }
    let userProfiles = []
    let i = 0
    for (let userProfile of this.dataList) {
      //  this.structureTree[i].children = userProfiles
      //  let j = 0
      for (let obj of userProfile.children) {
        userProfiles.push({
          "label": obj.name,
          "data": obj.id,
          "expandedIcon": "fa-user",
          "collapsedIcon": "fa-user",
          "leaf": true,
          "selectable": true,
          "dataObj": obj
        })
      }
      this.structureTree[i].children = userProfiles     
      i++
    }
  }

  // selectNode(event) {
  //     if (event.node) {
  //       if (event.node.data.wfContentType.id == 1 || event.node.data.wfContentType.id == 2) {
  //         let push = true;
  //         for (let user of this.userList) {
  //           if (user.wfFolderLinkFolderId == event.node.data.id || user.id == event.node.data.id) {
  //             push = false
  //           }
  //         }
  //         if (push)
  //           this.save(event.node.data)
  //       }
  //     }
  //   }

  selectNode(event) {
    console.log(event);
    // dir.expanded = !dir.expanded;
    // if (event.data.nodeLevel == 1) {
    //   let param = {
    //     name: event.data.name,
    //     ownerType: dir.type,
    //     ownerId: dir.id,
    //   }
    //   this._router.navigate(
    //     ['/main', {
    //       outlets: {
    //         center: ['setting-permission-input', param],
    //       }
    //     }],
    //     { relativeTo: this._route });
    // }
  }
}