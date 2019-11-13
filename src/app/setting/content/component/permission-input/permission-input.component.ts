import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { TdLoadingService } from '@covalent/core';
import { ActivatedRoute, Params } from '@angular/router';
import { InOutAssign } from '../../model/inOutAssign.model';
import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'
import { PermissionInputService } from '../../service/permission-input.service'
import { MdDialog } from '@angular/material/dialog';
import { PermissionInputUpdateComponent } from '../permission-input-update/permission-input-update.component'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
@Component({
  selector: 'app-permission-input',
  templateUrl: './permission-input.component.html',
  styleUrls: ['./permission-input.component.styl'],
  providers: [PermissionInputService]
})
export class PermissionInputComponent implements OnInit {
  @Input("selectDepartment") selectDepartment: boolean
  @Output("onselectData") onselectData = new EventEmitter();
  @Input("alertMsgTo") aletMsgTo: boolean
  @Output('msgTo') msgTo = new EventEmitter();
  rootStructureId = 0
  structureTree = []
  selectedUser: TreeNode;
  msgs: Message[] = [];
  firstList: any

  expanded: boolean;
  checked: boolean;
  userList: InOutAssign[]
  directories: InOutAssign[]
  iconHeader: string = 'lock_outline'
  title: string = 'กำหนดสิทธิ์หนังสือเข้า'
  ownerId: number
  ownerType: number
  constructor(private _location: Location,
    private _route: ActivatedRoute,
    private _loadingService: TdLoadingService,
    private _permissionInputService: PermissionInputService,
    private _dialog: MdDialog) {
    this.checked = false;
    this.expanded = false;    
  }

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: true,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: false
  }

  ngOnInit() {
    this.userList = []
    this._route.params
      .subscribe((params: Params) => {
        if (params['name'] !== undefined)
          this.title = this.title + ' [' + params['name'] + ']'
        if (params['ownerId'] !== undefined) {
          this.ownerId = params['ownerId']
        }
        if (params['ownerType'] !== undefined)
          this.ownerType = params['ownerType']
      })
    this.getListAll(this.ownerId, this.ownerType)
    this.directories = [
      {
        "version": 1,
        "assignName": "โครงสร้างหน่วยงาน",
        "id": 9,
        "createdBy": -1,
        "createdDate": "12/05/2560 11:09:30",
        "orderNo": 1,
        "removedBy": 0,
        "removedDate": "",
        "updatedBy": 0,
        "updatedDate": "12/05/2560 11:09:30",
        "inOutAssignOwnerId": 1,
        "inOutAssignAssignId": 3,
        "inOutAssignOwnerType": 1,
        "inOutAssignIsperiod": 0,
        "inOutAssignStartDate": "",
        "inOutAssignEndDate": "",
        "children": [
          {
            "version": 1,
            "assignName": "ผู้ดูแลระบบ สมาร์ทออฟฟิต",
            "id": 1,
            "createdBy": -1,
            "createdDate": "12/05/2560 11:09:30",
            "orderNo": 2,
            "removedBy": 0,
            "removedDate": "",
            "updatedBy": 0,
            "updatedDate": "12/05/2560 11:09:30",
            "inOutAssignOwnerId": 2,
            "inOutAssignAssignId": 1,
            "inOutAssignOwnerType": 0,
            "inOutAssignIsperiod": 1,
            "inOutAssignStartDate": "01/01/2560 00:00:00",
            "inOutAssignEndDate": "31/05/2560 00:00:00"
          },
          {
            "version": 1,
            "assignName": "ชื่อผู้ทดสอบระบบ นามสกุลผู้ทดสอบระบบ",
            "id": 2,
            "createdBy": -1,
            "createdDate": "12/05/2560 11:09:30",
            "orderNo": 3,
            "removedBy": 0,
            "removedDate": "",
            "updatedBy": 0,
            "updatedDate": "12/05/2560 11:09:30",
            "inOutAssignOwnerId": 3,
            "inOutAssignAssignId": 1,
            "inOutAssignOwnerType": 0,
            "inOutAssignIsperiod": 1,
            "inOutAssignStartDate": "01/01/2560 00:00:00",
            "inOutAssignEndDate": "31/05/2560 00:00:00"
          },
          {
            "version": 1,
            "assignName": "นงนภัส ขนุนก้อน",
            "id": 3,
            "createdBy": -1,
            "createdDate": "12/05/2560 11:09:30",
            "orderNo": 4,
            "removedBy": 0,
            "removedDate": "",
            "updatedBy": 0,
            "updatedDate": "12/05/2560 11:09:30",
            "inOutAssignOwnerId": 4,
            "inOutAssignAssignId": 1,
            "inOutAssignOwnerType": 0,
            "inOutAssignIsperiod": 1,
            "inOutAssignStartDate": "01/01/2560 00:00:00",
            "inOutAssignEndDate": "31/05/2560 00:00:00"
          },
          {
            "version": 1,
            "assignName": "เธียรชัย ทดสอบ",
            "id": 4,
            "createdBy": -1,
            "createdDate": "12/05/2560 11:09:30",
            "orderNo": 5,
            "removedBy": 0,
            "removedDate": "",
            "updatedBy": 0,
            "updatedDate": "12/05/2560 11:09:30",
            "inOutAssignOwnerId": 5,
            "inOutAssignAssignId": 1,
            "inOutAssignOwnerType": 0,
            "inOutAssignIsperiod": 1,
            "inOutAssignStartDate": "01/01/2560 00:00:00",
            "inOutAssignEndDate": "31/05/2560 00:00:00"
          },
          {
            "version": 1,
            "assignName": "มาลินี จรูญรัตนสกุล",
            "id": 5,
            "createdBy": -1,
            "createdDate": "12/05/2560 11:09:30",
            "orderNo": 6,
            "removedBy": 0,
            "removedDate": "",
            "updatedBy": 0,
            "updatedDate": "12/05/2560 11:09:30",
            "inOutAssignOwnerId": 6,
            "inOutAssignAssignId": 1,
            "inOutAssignOwnerType": 0,
            "inOutAssignIsperiod": 1,
            "inOutAssignStartDate": "01/01/2560 00:00:00",
            "inOutAssignEndDate": "31/05/2560 00:00:00"
          },
          {
            "version": 1,
            "assignName": "นางสาวนภัส ขนุนก้อน",
            "id": 6,
            "createdBy": -1,
            "createdDate": "12/05/2560 11:09:30",
            "orderNo": 6,
            "removedBy": 0,
            "removedDate": "",
            "updatedBy": 0,
            "updatedDate": "12/05/2560 11:09:30",
            "inOutAssignOwnerId": 6,
            "inOutAssignAssignId": 1,
            "inOutAssignOwnerType": 0,
            "inOutAssignIsperiod": 1,
            "inOutAssignStartDate": "01/01/2560 00:00:00",
            "inOutAssignEndDate": "31/05/2560 00:00:00"
          }
        ]
      }]

    for (let node of this.directories) {
      this.structureTree.push({
        "label": node.assignName,
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
    for (let userProfile of this.directories) {
      for (let obj of userProfile.children) {
        userProfiles.push({
          "label": obj.assignName,
          "data": obj.id,
          "expandedIcon": "fa-user",
          "collapsedIcon": "fa-user",
          "leaf": true,
          "selectable": true,
          "dataObj": obj
        })
        // if (obj.type == 'user')
        //   userProfiles[i].leaf = false
      }
      this.structureTree[i].children = userProfiles
      i++
    }
  }

  onDateChanged(event: any) {
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  goBack() {
    this._location.back()
  }

  getListAll(ownerId: number, ownerType: number): void {
    this._loadingService.register('main')
    this._permissionInputService
      .listByOwnerId(ownerId, ownerType)
      .subscribe(response => {
        console.log(response);
        this.userList = response as InOutAssign[]
      })
    this._loadingService.resolve('main')
  }

  delete(objData: InOutAssign) {
    if (objData.id) {
      this._loadingService.register('main')
      this._permissionInputService.deleteInOutAssign(objData.id).subscribe(response => {
        if (response == true) {
          this.userList.splice(this.userList.indexOf(objData), 1)
          this._loadingService.resolve('main')
        } else {
          this._loadingService.resolve('main')
          return;
        }
      })
    }
  }

  openAlertDetail(inOutAssign: InOutAssign) {
    let dialogRef = this._dialog.open(PermissionInputUpdateComponent, {
      width: '50%', height: '60%'
    });
    dialogRef.componentInstance.inOutAssign = inOutAssign
  }

  loadNode(event) {
        console.log(event);
    }
}
