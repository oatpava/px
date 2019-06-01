import { PermissionInputService } from '../../service/permission-input.service';
import { PermissionInputComponent } from '../permission-input/permission-input.component';
import { TdLoadingService } from '@covalent/core';
import { InOutAssign } from '../../model/inOutAssign.model';
import { forwardRef, Inject, ViewChild, Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TreeModule, TreeNode, Message } from 'primeng/primeng';

@Component({
  selector: 'tree-view-permission',
  templateUrl: './list-content-permission-input.component.html',
  styleUrls: ['./list-content-permission-input.component.styl'],
  providers: [PermissionInputService]
})
export class ListContentPermissionInputComponent implements OnInit {
  @Input("selectDepartment") selectDepartment: boolean
  @Output("onselectData") onselectData = new EventEmitter();
  @Input("alertMsgTo") aletMsgTo: boolean
  @Output('msgTo') msgTo = new EventEmitter();
  @Input() dataList: Array<any>
  rootStructureId = 0
  structureTree = []
  selectedUser: TreeNode;
  msgs: Message[] = [];
  firstList: any

  @Input() directories: Array<InOutAssign>;
  @Input() userList: Array<InOutAssign>;
  @Input() ownerId: number;
  @Input() ownerType: number;
  expanded: boolean;
  checked: boolean;
  constructor(private _loadingService: TdLoadingService,
    private _permissionInputService: PermissionInputService,
    @Inject(forwardRef(() => PermissionInputComponent)) private permissionInput: PermissionInputComponent) {
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
    // this.userList = []
  }

  nodeSelect(event) {
    // (dir as any).expanded = !(dir as any).expanded;
    if (!event.node.dataObj.children) {
      let push = true;
      if (this.userList.length > 0) {
        for (let user of this.userList) {
          if (user.inOutAssignAssignId == event.node.dataObj.id || user.id == event.node.dataObj.id) {
            push = false
          }
        }
      }
      if (push) {
        event.node.dataObj.inOutAssignOwnerId = this.ownerId
        event.node.dataObj.inOutAssignOwnerType = this.ownerType
        event.node.dataObj.inOutAssignAssignId = event.node.dataObj.id
        event.node.dataObj.inOutAssignIsperiod = 0
        event.node.dataObj.inOutAssignStartDate = ''
        event.node.dataObj.inOutAssignEndDate = ''
        this.saveInOutAssign(event.node.dataObj)
      }
    }
  }

  saveInOutAssign(objData: any) {
    this._loadingService.register('main')
    this._permissionInputService.saveInOutAssign(objData).subscribe(response => {
      if (response.success == true) {
        objData.id = response.data.id
        objData.listInOutAssignModel_groupDate=[{"inOutAssignStartDate":'', "inOutAssignEndDate":""}]
        objData.listInOutAssignModel_groupDate[0].inOutAssignStartDate = ''
        objData.listInOutAssignModel_groupDate[0].inOutAssignEndDate = ''
        objData.listInOutAssignModel_groupDate[0].checkExpire = ''
        objData.listInOutAssignModel_groupDate[0].id = response.data.id
        this.userList.push(objData)
        this._loadingService.resolve('main')
      }
    })
  }
}