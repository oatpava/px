import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Observable'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { PxService, } from '../../../main/px.service'
import { StructureService } from '../structure/structure.service'
import { UserService } from '../../service/user.service'
import { UserProfileService } from '../../service/user-profile.service'
import { DeleteDialogComponent } from '../../../main/component/delete-dialog/delete-dialog.component'
import { ConfirmDialogComponent } from '../../../main/component/confirm-dialog/confirm-dialog.component'
import { MdDialog, MdDialogRef } from '@angular/material'
// import { FileUploader } from 'ng2-file-upload'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';


import { User } from '../../model/user.model'
// import { FileAttach } from '../../../main/model/file-attach.model'

@Component({
  selector: 'pxc-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.styl'],
  providers: [UserService, PxService, StructureService]
})
export class UserComponent implements OnInit {
  mode: string = 'add'
  modeTitle: string = 'เพิ่ม'
  iconHeader: string = 'person_add'
  structureName: string = ''
  userId: number
  user: User
  userResult: User
  nowDate: Date
  toggleAddUser: boolean = true
  toggleCommand: boolean = true
  toggleAddProfile: boolean = true
  toggleEditProfile: boolean = true
  toggleListProfile: boolean = true
  // uploader: FileUploader = new FileUploader({})
  // fileAttachs: FileAttach[] = []
  // hasBaseDropZoneOver: boolean = false
  // fileAttachRemoved: FileAttach[] = []
  userProfileId: number
  structureId: number
  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: false
  }

  msgs: Message[] = []
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _pxService: PxService,
    private _structureService: StructureService,
    private _userService: UserService,
    private _userProfileService: UserProfileService,
    private _dialog: MdDialog,
  ) {
    this.nowDate = new Date()
    this.user = new User({
      name: "",
      passwords: "",
      activeDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      expireDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      passwordExpireDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
    })
    // this.userResult = new User()
  }

  ngOnInit() {
    console.log('AddUserComponent')
    this._route.params
      .subscribe((params: Params) => {
        this.mode = params['mode']
        this.modeTitle = params['modeTitle']
        this.structureId = +params['structureId']
        this._structureService.getStructure('1', Number(this.structureId))
          .subscribe(response => {
            this.structureName = 'หน่วยงาน : ' + response.name
          })
        if (this.mode === 'add') {
          this.structureId = +params['structureId']
          this.userId = 0
        } else if (this.mode === 'edit') {
          this.userId = +params['userId']
          this.getUser(this.userId)
          this.toggleAddUser = false
          this.toggleCommand = false
        }
      })
  }

  goBack() {
    this._location.back()
  }

  createUser = (createUser: User) => {
    this._loadingService.register('main')
    this._userService
      .checkUserNameExist('1.0', createUser.name)
      .subscribe(response => {
        if (!response) {
          this._userService
            .createUser(createUser)
            .subscribe(response => {
              this._loadingService.resolve('main')
              this.userId = response.id
              this.userResult = response as User
              this.toggleEditUser()
            })
        } else {
          this._loadingService.resolve('main')
          this.msgs = [];
          this.msgs.push(
            {
              severity: 'warn',
              summary: 'ชื่อผู้ใช้ซ้ำ',
              detail: 'ไม่สามารถบันทึกข้อมูลได้',
            },
          );
        }
      })
  }

  getUser = (userId: number) => {
    this._loadingService.register('main')
    this._userService
      .getUser(userId, '1.1')
      .subscribe(response => {
        this.user = response as User
        this.userResult = this.user
        this._loadingService.resolve('main')
      })
  }

  updateUser = (updateUser: User) => {
    console.log("updateUser 1 ", updateUser)
    // this.toggleEditUser()
    this._loadingService.register('main')
    this._userService
      .updateUser(this._userService.convertDateFormat(updateUser))
      .subscribe(response => {
        this.userResult = response as User
        this.toggleEditUser()
        this._loadingService.resolve('main')
      })

    this._location.back()
  }

  deleteUser = (deleteUser: User) => {
    console.log("deleteUser 1 ", deleteUser)
    // this.toggleEditUser()
    // this._loadingService.register('main')
    let dialogRef = this._dialog.open(DeleteDialogComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.dataName = 'ผู้ใช้งาน ' + deleteUser.name
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toggleEditUser()
        this._loadingService.register('main')
        this._userService
          .deleteUser(deleteUser)
          .subscribe(response => {
            console.log(response)
            if (response) {
              this._userProfileService
                .deleteUserProfile(deleteUser)
                .subscribe(response => {
                  this.toggleEditUser()
                  // this._location.back()
                  // this._loadingService.resolve('main')
                  this.msgs = [];
                  this.msgs.push({
                    severity: 'success',
                    summary: 'ลบข้อมูลสำเร็จ',
                    detail: 'ผู้ใช้งาน ' + deleteUser.name
                  })
                  this._location.back()
                  this._loadingService.resolve('main')
                })
            }
          })
      }
    })
  }

  editMode = (updateUser: User) => {
    console.log('updateUser', updateUser)
    this.user = updateUser
    this.user.passwordExpireDate = this._userService.convertStringToDate(this.user.passwordExpireDate)
    this.user.expireDate = this._userService.convertStringToDate(this.user.expireDate)
    this.toggleEditUser()
    console.log('updateUser2', this.user)
  }

  toggleEditUser = () => {
    this.mode = 'edit'
    this.toggleAddUser = !this.toggleAddUser
    this.toggleCommand = !this.toggleCommand
  }

  alertMessage() {
    this.msgs = [];
    this.msgs.push({
      severity: 'warn',
      summary: 'ไม่สามารถเพิ่มได้เนื่องจาก',
      detail: 'รหัสพนักงาน ซ้ำ'
    })
  }

  alertMessageUser() {
    this.msgs = [];
    this.msgs.push({
      severity: 'info',
      summary: 'บันทึกสำเร็จ',
      detail: 'แก้ไขรายชื่อเรียบร้อย'
    })
  }

}
