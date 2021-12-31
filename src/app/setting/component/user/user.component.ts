import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { PxService, } from '../../../main/px.service'
import { StructureService } from '../../service/structure.service'
import { UserService } from '../../service/user.service'
import { UserProfileService } from '../../service/user-profile.service'
import { DeleteDialogComponent } from '../../../main/component/delete-dialog/delete-dialog.component'
import { MdDialog } from '@angular/material'
import { Message } from 'primeng/primeng'
import { User } from '../../model/user.model'
import { Structure } from '../../model/structure.model'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

@Component({
  selector: 'px-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.styl'],
  providers: [UserService, PxService, StructureService]
})
export class UserComponent implements OnInit {
  mode: string = 'add'
  modeTitle: string = 'เพิ่ม'
  structure = new Structure()
  user: User
  nowDate: Date
  toggleAddUser: boolean = true
  toggleCommand: boolean = true
  showUserProfile: boolean = false

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
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _userService: UserService,
    private _userProfileService: UserProfileService,
    private _dialog: MdDialog,
    private _structureService: StructureService,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.nowDate = new Date()
    this.user = new User({
      id: 0,
      name: "",
      passwords: "",
      activeDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      expireDate: { date: { year: (this.nowDate.getFullYear() + 543) + 1, month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      passwordExpireDate: { date: { year: (this.nowDate.getFullYear() + 543) + 1, month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
    })
  }

  ngOnInit() {
    this._route.params
      .subscribe((params: Params) => {
        this.mode = params['mode']
        this.modeTitle = params['modeTitle']
        this._structureService.getStructure('1', +params['structureId'])
          .subscribe(response => {
            this.structure = response
            if (this.mode == 'add') {
              this.showUserProfile = true
              console.log('xxxxx', response, this.showUserProfile)
            } else if (this.mode == 'edit') {
              this.getUser(+params['userId'])
            }
          })
      })
  }

  goBack() {
    this._location.back()
  }

  getUser(userId: number) {
    this._loadingService.register('main')
    this._userService
      .getUser(userId, '1.1')
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.user = response
        this.toggleAddUser = false
        this.toggleCommand = false
        this.showUserProfile = true
      })
  }

  updateUser(updateUser: User) {
    this._loadingService.register('main')
    this._userService
      .updateUser(this._userService.convertDateFormat(updateUser))
      .subscribe(response => {
        this._loadingService.resolve('main')
        // this._paramSarabanService.msg = {
        //   severity: 'success',
        //   summary: 'แก้ไขวันที่หมดอายุของรหัสผ่านและการใช้งานสำเร็จ',
        //   detail: 'คุณได้ทำการแก้ไขบัญชีผู้ใช้ ' + updateUser.name
        // }
        // this.goBack()
        this.user = response
        this._location.back()
      })
  }

  deleteUser(deleteUser: User) {
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
            this._loadingService.resolve('main')
            if (response) {
              this._loadingService.register('main')
              this._userProfileService
                .deleteUserProfile(deleteUser)
                .subscribe(response => {
                  this._loadingService.resolve('main')
                  this._paramSarabanService.msg = {
                    severity: 'success',
                    summary: 'ลบบัญชีผู้ใช้สำเร็จ',
                    detail: 'คุณได้ทำการลบบัญชีผู้ใช้ ' + deleteUser.name
                  }
                  this.goBack()
                })
            }
          })
      }
    })
  }

  editMode = (updateUser: User) => {
    this.user = updateUser
    this.user.passwordExpireDate = this._userService.convertStringToDate(this.user.passwordExpireDate)
    this.user.expireDate = this._userService.convertStringToDate(this.user.expireDate)
    this.toggleEditUser()
  }

  toggleEditUser = () => {
    this.mode = 'edit'
    this.toggleAddUser = !this.toggleAddUser
    this.toggleCommand = !this.toggleCommand
    this.showUserProfile = true
  }

  alertMessage(msg: Message) {
    this.msgs = []
    this.msgs.push(msg)
  }

}
