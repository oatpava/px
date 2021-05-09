import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { PxService, } from '../../../main/px.service'
import { StructureService } from '../structure/structure.service';
import { UserService } from '../../service/user.service'
import { UserProfileService } from '../../service/user-profile.service'
import { DeleteDialogComponent } from '../../../main/component/delete-dialog/delete-dialog.component'
import { MdDialog } from '@angular/material'
import { Message } from 'primeng/primeng';
import { User } from '../../model/user.model'
import { Structure } from '../../model/structure.model';

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
  structure = new Structure()
  userId: number
  user: User
  userResult: User
  nowDate: Date
  toggleAddUser: boolean = true
  toggleCommand: boolean = true
  toggleAddProfile: boolean = true
  toggleEditProfile: boolean = true
  toggleListProfile: boolean = true

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
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _userService: UserService,
    private _userProfileService: UserProfileService,
    private _dialog: MdDialog,
    private _strucctureService: StructureService
  ) {
    this.nowDate = new Date()
    this.user = new User({
      name: "",
      passwords: "",
      activeDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      expireDate: { date: { year: (this.nowDate.getFullYear() + 543) + 1, month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      passwordExpireDate: { date: { year: (this.nowDate.getFullYear() + 543) + 1, month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
    })
  }

  ngOnInit() {
    console.log('AddUserComponent')
    this._route.params
      .subscribe((params: Params) => {
        this.mode = params['mode']
        this.modeTitle = params['modeTitle']
        this.structureId = +params['structureId']
        this.getStructure()
        if (this.mode === 'add') {
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

  getStructure() {
    this._loadingService.register('main')
    this._strucctureService
      .getStructure('1', this.structureId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.structure = response as Structure
      })
  }

  getUser = (userId: number) => {
    this._loadingService.register('main')
    this._userService
      .getUser(userId, '1.1')
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.userResult = this.user = response as User
      })
  }

  createUser = (createUser: User) => {
    this._loadingService.register('main')
    this._userService
      .checkUserNameExist('1.0', createUser.name)
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (!response) {
          this._loadingService.register('main')
          this._userService
            .createUser(createUser)
            .subscribe(response => {
              this._loadingService.resolve('main')
              this.userId = response.id
              this.userResult = response as User
              this.toggleEditUser()
            })
        } else {
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

  updateUser = (updateUser: User) => {
    this._loadingService.register('main')
    this._userService
      .updateUser(this._userService.convertDateFormat(updateUser))
      .subscribe(response => {
        this._loadingService.resolve('main')
        this._location.back()
      })
  }

  deleteUser = (deleteUser: User) => {
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
                  this._location.back()
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
  }

  alertMessage(msg: Message) {
    this.msgs = [];
    this.msgs.push(msg)
  }

}
