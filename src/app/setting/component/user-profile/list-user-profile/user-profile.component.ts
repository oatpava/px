import { Component, OnInit, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { MdDialog } from '@angular/material'
import { URLSearchParams } from '@angular/http'
import { TdDataTableSortingOrder, ITdDataTableColumn } from '@covalent/core'
import { Message } from 'primeng/primeng'

import { MoveProfileComponent } from '../../../component/move-profile/move-profile.component'
import { MoveStructureComponent } from '../../../component/move-structure/move-structure.component'
import { OrderStructureComponent } from '../../../component/order-structure/order-structure.component'
import { MergeUserComponent } from '../../../component/merge-user/merge-user.component'
import { MergeStructureComponent } from '../../../component/merge-structure/merge-structure.component'
import { LockUserComponent } from '../../../component/lock-user/lock-user.component'

import { UserService } from '../../../service/user.service'
import { UserProfileService } from '../../../service/user-profile.service'
import { User } from '../../../model/user.model'
import { UserProfile } from '../../../model/user-profile.model'
import { Observable } from 'rxjs/Observable'
import { StructureService } from '../../structure/structure.service'
import { PxService } from '../../../../main/px.service'
import { ParamSarabanService } from '../../../../saraban/service/param-saraban.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.styl'],
  providers: [UserService, UserProfileService, StructureService]
})
export class UserProfileComponent implements OnInit {
  parentId: number
  datas: any[] = []
  msgs: Message[] = []
  structureTree = []
  columns: ITdDataTableColumn[] = [
    { name: 'fullName', label: 'ชื่อ-นามสกุล' },
    { name: 'structureName', label: 'หน่วยงาน' },
    { name: 'positionName', label: 'ตำแหน่ง' },
    { name: 'tel', label: 'เบอร์โทรศัพท์' },
    { name: 'edit', label: '' },
  ]
  loadData = new EventEmitter();
  filteredData: any[]
  filteredTotal: number
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'id';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  showMenu: boolean = false
  showEditStructure: boolean = false
  showEditUser: boolean = false
  listMenu: string = 'menu'
  parentStructure: any
  showSearchResult: boolean = false
  //showSearchNotResult: boolean = true
  showMergeStructure: boolean = false
  showMergeUser: boolean = false
  userName: string = ''
  userProfileName: string = ''
  //userProfile: UserProfile
  showButton1: boolean = true
  showButton2: boolean = true

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _userService: UserService,
    private _userProfileService: UserProfileService,
    private _dialog: MdDialog,
    private _structureService: StructureService,
    private _pxService: PxService,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.parentId = 1
  }

  ngOnInit() {
    console.log('UserProfileComponent')
    if (this._paramSarabanService.msg != null) {
      this.msgs = []
      this.msgs.push(this._paramSarabanService.msg)
      this._paramSarabanService.msg = null
    }
  }


  selectStructure(event) {
    console.log('selected structure', event)
    this.parentStructure = event
    this.showMenu = true
    if (this.parentStructure.type === 'U') {
      this.showEditUser = true
      this.showMergeUser = false
      this.showEditStructure = false
      this.showMergeStructure = false
      if (this.parentStructure.code !== null) {
        this.showMergeUser = true
      }
    } else {
      this.showEditUser = false
      this.showEditStructure = true
      this.showMergeStructure = false
      this.showMergeUser = false
      if (this.parentStructure.code !== null) {
        this.showMergeStructure = true
      }
    }
  }

  manageStructure(modeSelect: string, modeTitleSelect: string) {
    let param = {
      mode: modeSelect,
      modeTitle: modeTitleSelect,
      parentId: this.parentStructure.id,
      t: new Date().getTime()
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['add-structure', param],
        }
      }],
      { relativeTo: this._route })
  }

  manageUser(modeSelect: string, modeTitleSelect: string) {
    let uId: number = 0
    let stu: number = 0

    if (modeSelect === 'edit') {
      uId = this.parentStructure.user.id
      stu = this.parentStructure.structure.id
    } else {
      stu = this.parentStructure.id
    }
    let param = {
      mode: modeSelect,
      modeTitle: modeTitleSelect,
      userId: uId,
      structureId: stu,
      t: new Date().getTime()
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['user', param],
        }
      }],
      { relativeTo: this._route })
  }

  searchUserProfiles(isButton1: boolean) {
    this.datas = []
    this.showButton1 = !isButton1
    this.showButton2 = isButton1
    isButton1 ? this.userProfileName = '' : this.userName = ''

    this._loadingService.register('main')
    this._userProfileService
      .searchUserProfilesByFullName('1.1', '0', '20', '', '', this.userProfileName, this.userName)
      .subscribe((response: any[]) => {
        this._loadingService.resolve('main')
        this.showSearchResult = true
        for (let data of response) {
          let userProfile: UserProfile = data as UserProfile
          if ('' + userProfile !== 'null') {
            let tempListU = {
              userId: userProfile.user.id,
              structureId: userProfile.structure.id,
              fullName: userProfile.fullName,
              structureName: userProfile.structure ? userProfile.structure.name : "",
              positionName: userProfile.position ? userProfile.position.name : "",
              tel: userProfile.tel ? userProfile.tel : "",
            }
            this.datas.push(tempListU)
          }
        }
      })
  }

  cancelSearch() {
    this.showSearchResult = false
    this.showButton1 = true
    this.showButton2 = true
  }

  getUsers = () => {
    this._loadingService.register('main')
    this._userService
      .getUsers('1.1', '0', '500', 'createdDate', 'desc')
      .subscribe(response => {
        let users: User[] = response as User[]
        let listHttp: any[] = []
        if (users.length > 0) {
          users.forEach((user: User) => {
            this.datas.push({
              userId: user.id,
              userName: user.name,
            })
            listHttp.push(this._userProfileService.getDefaultUserProfilesByUserId(user.id, '1.1'))
          })
          Observable.forkJoin(listHttp)
            .subscribe((response: any[]) => {
              for (let data of response) {
                let userProfile: UserProfile = data as UserProfile
                if ('' + userProfile !== 'null') {
                  let tempListU = {
                    fullName: userProfile.fullName,
                    structureName: userProfile.structure ? userProfile.structure.name : "",
                    positionName: userProfile.position ? userProfile.position.name : "",
                    address: userProfile.address ? userProfile.address : "",
                    tel: userProfile.tel ? userProfile.tel : "",
                  }
                  let tempU = this.datas.findIndex(d => d.userId === userProfile.user.id)
                  Object.assign(this.datas[tempU], tempListU)
                }
              }
            })
        }
        this._loadingService.resolve('main')
      })
  }

  getUserProfiles() {
    this._loadingService.register('main')
    this._userProfileService
      .getUserProfiles('1.1', '0', '500', 'createdDate', 'desc')
      .subscribe(response => {
        let userProfiles: UserProfile[] = response as UserProfile[]
        for (let userProfile of userProfiles) {
          this.datas.push({
            id: userProfile.id,
            userId: userProfile.user.id,
            userName: userProfile.user.name,
            fullName: userProfile.fullName,
            structureName: userProfile.structure ? userProfile.structure.name : "",
            positionName: userProfile.position ? userProfile.position.name : "",
            address: userProfile.address,
            tel: userProfile.tel,
          })
        }
        this._loadingService.resolve('main')
      })
  }

  manageResetPassword() {
    this._loadingService.register('main')
    this._userService
      .resetPassword(this.parentStructure.id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.msgs = []
        this.msgs.push({
          severity: 'warn',
          summary: 'รีเซ็ตรหัสผ่านสำเร็จ',
          detail: 'ทำการตั้งรหัสผ่านใหม่ให้ผู้ใช้งานแล้ว'
        })
      })
  }

  addUser(modeSelect: string, modeTitleSelect: string) {
    let param = {
      mode: modeSelect,
      modeTitle: modeTitleSelect,
      structureId: this.parentStructure.id,
      userId: this.parentStructure.id,
      t: new Date().getTime()
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['user', param],
        }
      }],
      { relativeTo: this._route })
  }

  edit(editUser: any) {
    let param = {
      mode: 'edit',
      modeTitle: 'แก้ไข',
      structureId: editUser.structureId,
      userId: editUser.userId,
      t: new Date().getTime()
    }

    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['user', param],
        }
      }],
      { relativeTo: this._route })
  }

  rootStructureId = 0

  structureMove() {
    let dialogRef = this._dialog.open(MoveStructureComponent, {
      width: '40%',
    });
    let instance = dialogRef.componentInstance
    instance.structureData = this.parentStructure
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'บันทึกสำเร็จ',
          detail: 'ย้ายหน่วยงาน' + this.parentStructure.name
        })
        this.structureTree = []
        this._structureService
          .getStructures('1.0', '0', '1', '', '', this.rootStructureId)
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
                this._structureService.getUserProfiles('1.1', '0', '200', '', '', node.id),
              ).subscribe((response: Array<any>) => {
                this._loadingService.resolve('main')
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
                i++;
              });
            }
          });
      }
    });
  }

  orderStructure() {
    let dialogRef = this._dialog.open(OrderStructureComponent, {
      width: '40%',
    });
    let instance = dialogRef.componentInstance
    instance.structureId = this.parentStructure.id
    instance.type = 'structure'
    dialogRef.afterClosed().subscribe(result => {
      this._loadingService.register('main')
      this.structureTree = []
      this._structureService
        .getStructures('1.0', '0', '1', '', '', this.rootStructureId)
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
              this._structureService.getUserProfiles('1.1', '0', '200', '', '', node.id),
            ).subscribe((response: Array<any>) => {
              this._loadingService.resolve('main')
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
              i++;
            });
          }
        });
    })
  }

  orderUser() {
    let dialogRef = this._dialog.open(OrderStructureComponent, {
      width: '40%',
    });
    let instance = dialogRef.componentInstance
    instance.structureId = this.parentStructure.id
    instance.type = 'user'
    dialogRef.afterClosed().subscribe(result => {
      this._loadingService.register('main')
      this.structureTree = []
      this._structureService
        .getStructures('1.0', '0', '1', '', '', this.rootStructureId)
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
              this._structureService.getUserProfiles('1.1', '0', '200', '', '', node.id),
            ).subscribe((response: Array<any>) => {
              this._loadingService.resolve('main')
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
              i++;
            });
          }
        });
    })
  }

  userProfileMove() {
    let dialogRef = this._dialog.open(MoveProfileComponent, {
      width: '40%',
    });
    let instance = dialogRef.componentInstance
    instance.user = this.parentStructure
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this.structureTree = []
        this._structureService
          .getStructures('1.0', '0', '1', '', '', this.rootStructureId)
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
                this._structureService.getUserProfiles('1.1', '0', '200', '', '', node.id),
              ).subscribe((response: Array<any>) => {
                this._loadingService.resolve('main')
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
                i++;
              });
            }
          });
      }
    });
  }

  lockuser() {
    let dialogRef = this._dialog.open(LockUserComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.userProfileId = this.parentStructure.id
    instance.structureId = this.parentStructure.structure.id
    instance.status = this.parentStructure.userStatus
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result != 'undefined') {
        delete this.parentStructure["type"]
        this.parentStructure.userStatus = result
        this.parentStructure.user.status = result
        this._loadingService.register('main')

        this._userService
          .updateUser(this.parentStructure.user)
          .subscribe(response => {
            this._userProfileService
              .updateUserProfile(this.parentStructure)
              .subscribe(response => {
              })
            this.structureTree = []
            this._structureService
              .getStructures('1.0', '0', '1', '', '', this.rootStructureId)
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
                    this._structureService.getUserProfiles('1.1', '0', '200', '', '', node.id),
                  ).subscribe((response: Array<any>) => {
                    this._loadingService.resolve('main')
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
                    i++;
                  });
                }
              })
          })
      }
    })
  }

  goBack() {
    this._location.back()
  }

  hoverMenuEdit: boolean = true
  overMenu(value: string) {
    this.hoverMenuEdit = false
    this.listMenu = 'keyboard_arrow_up'
  }
  leaveMenu() {
    this.hoverMenuEdit = true
    this.listMenu = 'menu'
  }

  mergStructure() {
    let dialogRef = this._dialog.open(MergeStructureComponent, {
      width: '70%',
    });
    let instance = dialogRef.componentInstance
    instance.structureId = this.parentStructure.id
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    })
  }

  mergUser() {
    let dialogRef = this._dialog.open(MergeUserComponent, {
      width: '70%',
    });
    let instance = dialogRef.componentInstance
    instance.userProfileId = this.parentStructure.id
    instance.structureId = this.parentStructure.structure.id
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    })

  }

  genReportPDF() {
    this._loadingService.register('main')
    this._userProfileService
      .getlistStatusByStucture(this.parentStructure.parentKey, 'user_status')
      .subscribe(response => {
        this._loadingService.resolve('main')
        let params = new URLSearchParams()
        params.set("jobType", 'user_status')
        params.set("createdBy", '' + this._paramSarabanService.userId)
        this._pxService.report('user_status', 'pdf', params)
      })
  }

  genReportExcel() {
    this._loadingService.register('main')
    this._userProfileService
      .getlistStatusByStucture(this.parentStructure.id, 'user_status2')
      .subscribe(response => {
        this._loadingService.resolve('main')
        let params = new URLSearchParams()
        params.set("jobType", 'user_status2')
        params.set("createdBy", '' + this._paramSarabanService.userId)
        this._pxService.report('user_status2', 'xls', params)
      })
  }

}