import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { PxService, } from '../../../../main/px.service'
import { TreeNode, AutoComplete } from 'primeng/primeng'

import { UserService } from '../../../service/user.service'
import { UserProfileService } from '../../../service/user-profile.service'
import { StructureService } from '../../../service/structure.service'
import { MasterDataService } from '../../../service/master-data.service'
import { ParamSarabanService } from '../../../../saraban/service/param-saraban.service'

import { UserProfile } from '../../../model/user-profile.model'
import { Structure } from '../../../model/structure.model'
import { Title } from '../../../model/title.model'
import { UserProfileType } from '../../../model/user-profile-type.model'
import { Position } from '../../../model/position.model'
import { PositionType } from '../../../model/position-type.model'
import { UserProfileFolder } from '../../../model/user-profile-folder.model'
import { User } from '../../../model/user.model'

@Component({
  selector: 'app-add-user-profile',
  templateUrl: './add-user-profile.component.html',
  styleUrls: ['./add-user-profile.component.styl'],
  providers: [UserService, UserProfileService, StructureService, MasterDataService, PxService]
})
export class AddUserProfileComponent implements OnInit {
  @Input() toggleCommand: boolean = true
  @Input() user: User
  @Input() addUserform: any
  @Input() structure = new Structure()
  @Output() alertMessage = new EventEmitter()
  @Output() cancel = new EventEmitter()
  @Output() createdUser = new EventEmitter()
  toggleAddProfile: boolean = true
  toggleListProfile: boolean = true
  modeProfile: string = 'add'
  userProfile: UserProfile
  selectedPosition = new Position()
  userProfileList: UserProfile[] = []

  nowDate: Date
  titles: Title[] = []
  userProfileTypes: UserProfileType[] = []
  positions: Position[] = []
  positionTypes: PositionType[] = []
  isValid: boolean = false;

  posLevel = [
    { id: 0, name: 'เลือกระดับ' },
    { id: 1, name: 'ระดับปฏิบัติงาน' },
    { id: 2, name: 'ระดับปฏิบัติการ' },
    { id: 3, name: 'ระดับชำนาญงาน' },
    { id: 4, name: 'ระดับชำนาญการ' },
    { id: 5, name: 'ระดับอาวุโส' },
    { id: 6, name: 'ระดับชำนาญการพิเศษ' },
    { id: 7, name: 'ระดับทักษะพิเศษ' },
    { id: 8, name: 'ระดับเชี่ยวชาญ' },
    { id: 9, name: 'ระดับทรงคุณวุฒิ' }
  ]

  dialog: boolean = false
  structureTree: TreeNode[] = []
  selectedStructure: TreeNode = null
  showUserProfileList: boolean = true
  title = ''
  @ViewChild('acPosition') acPosition: AutoComplete
  filteredPosition: Position[] = []

  constructor(
    private _loadingService: TdLoadingService,
    private _userService: UserService,
    private _userProfileService: UserProfileService,
    private _masterDataService: MasterDataService,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.nowDate = new Date()
    this.userProfile = new UserProfile({
      structure: new Structure({ id: this.structure.id })
    })
    Object.assign(this.structureTree, this._paramSarabanService.structureTree)
  }

  ngOnInit() {
    console.log('AddUserProfileComponent', this.user, this.structure)
    this.getTitle()
    this.getPosition()
    this.getPositionType()
    this.getUserProfileType()
    if (this.user.id != 0) {
      this.getUserProfilesByUserId(this.user.id)
    } else {
      this.openFormAddProfile()
    }
  }

  getTitle() {
    this._loadingService.register('main')
    this._masterDataService
      .getMasterDatas('titles')
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.titles = response as Title[]
      })
  }

  getUserProfileType = () => {
    this._loadingService.register('main')
    this._masterDataService
      .getMasterDatas('userProfileTypes')
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.userProfileTypes = response as UserProfileType[]
        if (this.userProfileTypes.length == 3) this.userProfileTypes.pop()
      })
  }

  getPosition() {
    this._loadingService.register('main')
    this._masterDataService
      .getMasterDatas('positions')
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.positions = response as Position[]
        this.selectedPosition = response[0]
      })
  }

  getPositionType() {
    this._loadingService.register('main')
    this._masterDataService
      .getMasterDatas('positionTypes/types')
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.positionTypes = response as PositionType[]
      })
  }

  getUserProfilesByUserId(userId: number) {
    this._loadingService.register('main')
    this._userProfileService
      .getUserProfilesByUserId(userId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.userProfileList = []
        if (response) {
          this.userProfileList = response as UserProfile[]
          this.userProfileList.forEach(userProfile => {
            if (userProfile.position === null) {
              userProfile.position = new Position()
            } else {
              this.selectedPosition = this.positions.find(position => position.id == userProfile.position.id)
            }
            if (userProfile.positionType === null) {
              userProfile.positionType = new PositionType()
            }
          })
        } else {
          this.userProfile = new UserProfile()
        }
      })
  }

  openFormAddProfile() {
    this.toggleAddProfile = !this.toggleAddProfile
    this.toggleCommand = !this.toggleCommand
    this.userProfile = new UserProfile()
    this.modeProfile = 'add'
    let node = this.findNode(this.structureTree, this.structure.id)
    if (node) {
      this.selectedStructure = node
      this.userProfile.structure = node.data.profile
    } else {//tree not update when add new structure
      this.userProfile.structure = this.structure
    }
    this.showUserProfileList = false
    this.title = 'รายละเอียดผู้ใช้งาน'
  }

  createProfile(addUserProfiles: UserProfile) {
    this._loadingService.register('main')
    this._userProfileService
      .checkUserCode(addUserProfiles.code, 0)
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (response.result) {
          this.alertMessage.emit({
            severity: 'error',
            summary: 'ไม่สามารถสร้างบัญชีผู้ใช้',
            detail: 'รหัสพนักงาน ซ้ำ'
          })
        } else {
          if (this.user.id == 0) {
            this._loadingService.register('main')
            this._userService
              .checkUserNameExist('1.0', this.user.name)
              .subscribe(response => {
                this._loadingService.resolve('main')
                if (!response) {
                  this._loadingService.register('main')
                  this._userService
                    .createUser(this.user)
                    .subscribe(response => {
                      this._loadingService.resolve('main')
                      this.user.id = response.id
                      this.createdUser.emit(response.id)
                      this.alertMessage.emit({
                        severity: 'success',
                        summary: 'เพิ่มบัญชีผู้ใช้สำเร็จ',
                        detail: '',
                      })
                      this.createUserProfile(response)
                    })
                } else {
                  this.alertMessage.emit({
                    severity: 'error',
                    summary: 'ไม่สามารถสร้างบัญชีผู้ใช้',
                    detail: 'ชื่อผู้ใช้ ซ้ำ',
                  })
                }
              })
          } else {
            this.createUserProfile(this.user)
          }
        }
      })
  }

  createUserProfile(user: User) {
    this.userProfile.user.id = user.id
    this.userProfile.fullName = this.userProfile.firstName + ' ' + this.userProfile.lastName
    this.userProfile.fullNameEng = this.userProfile.firstNameEng + ' ' + this.userProfile.lastNameEng
    this.userProfile.position = this.selectedPosition

    this._loadingService.register('main')
    this._userProfileService
      .createUserProfile(this.userProfile)
      .subscribe(response => {
        this.userProfileList.push(response)
        this.createUserProfileFolder(response)
        this.alertMessage.emit({
          severity: 'success',
          summary: 'เพิ่มรายละเอียดผู้ใช้งานสำเร็จ',
          detail: '',
        })
        this.toggleCommand = !this.toggleCommand
        this.cancelCreateProfile()
      })
  }

  createUserProfileFolder(userProfile: UserProfile) {
    //create Inbox 
    let userProfileFolder = new UserProfileFolder({
      userProfileId: userProfile.id,
      userProfileFolderName: 'กล่องหนังสือเข้า (inbox)',
      userProfileFolderType: 'I',
      userProfileFolderDetail: 'หนังสือเข้าของ ' + userProfile.fullName
    })
    this._userProfileService
      .createUserProfileFolder(userProfileFolder)
      .subscribe(response => {
        //create OutBox, 
        userProfileFolder = new UserProfileFolder({
          userProfileId: userProfile.id,
          userProfileFolderName: 'กล่องหนังสือออก (outbox)',
          userProfileFolderType: 'O',
          userProfileFolderDetail: 'หนังสือออกของ ' + userProfile.fullName
        })
        this._userProfileService
          .createUserProfileFolder(userProfileFolder)
          .subscribe(response => {
            //create Recycle Bin, 
            userProfileFolder = new UserProfileFolder({
              userProfileId: userProfile.id,
              userProfileFolderName: 'ถังขยะ',
              userProfileFolderType: 'Z',
              userProfileFolderDetail: 'ถังขยะของ ' + userProfile.fullName
            })
            this._userProfileService
              .createUserProfileFolder(userProfileFolder)
              .subscribe(response => {
                //create My Work, 
                userProfileFolder = new UserProfileFolder({
                  userProfileId: userProfile.id,
                  userProfileFolderName: 'แฟ้มส่วนตัว',
                  userProfileFolderType: 'W',
                  userProfileFolderDetail: 'แฟ้มส่วนตัวของ ' + userProfile.fullName
                })
                this._userProfileService
                  .createUserProfileFolder(userProfileFolder)
                  .subscribe(response => {
                    this._loadingService.resolve('main')
                  })
              })
          })
      })
  }

  editProfile(updateProfile: UserProfile) {
    this.toggleAddProfile = false
    this.toggleCommand = true
    this.modeProfile = 'edit'
    this.userProfile = updateProfile
    this.showUserProfileList = false
    this.title = 'แก้ไขรายละเอียดผู้ใช้งาน: ' + updateProfile.fullName
  }

  cancelCreateProfile() {
    if (this.user.id == 0) {
      this.cancel.emit()
    } else {
      this.toggleAddProfile = !this.toggleAddProfile
      this.toggleCommand = !this.toggleCommand
      this.showUserProfileList = true
    }
  }

  updateProfile(updateProfile: UserProfile) {
    if (updateProfile.userProfileType.id === 3 && updateProfile.idCard == null) {
      this.isValid = true
    }
    if (!this.isValid) {
      this._loadingService.register('main')
      this._userProfileService
        .checkUserCode(updateProfile.code, updateProfile.id)
        .subscribe(response => {
          this._loadingService.resolve('main')
          if (response.result) {
            this.alertMessage.emit({
              severity: 'error',
              summary: 'ไม่สามารถเพิ่มผู้ใช้งาน',
              detail: 'รหัสพนักงาน ซ้ำ'
            })
          } else {
            this.userProfile.position = this.selectedPosition
            this._loadingService.register('main')
            this._userProfileService
              .updateUserProfile(updateProfile)
              .subscribe(response => {
                this._loadingService.resolve('main')
                this.getUserProfilesByUserId(this.user.id)
                this.toggleAddProfile = !this.toggleAddProfile
                this.toggleCommand = false
                this.toggleListProfile = false
                this.showUserProfileList = true
                this.alertMessage.emit({
                  severity: 'success',
                  summary: 'เพิ่มผู้ใช้งานสำเร็จ',
                  detail: 'คุณได้ทำการเพิ่มผู้ใช้งาน รหัส: ' + this.userProfile.code
                })
              })
          }
        })
    }
  }

  setDefaultProfile = (updateProfile: UserProfile) => {
    this._userProfileService
      .setDefaultProfile(updateProfile)
      .subscribe(response => {
        this.getUserProfilesByUserId(this.user.id)
      })
  }

  nodeSelect(event) {
    let node = event.node
    if (!event.node.leaf) {
      if (this.userProfile.structure.id === node.id) {
        this.userProfile.structure = new Structure({
          id: 0,
          name: '',
          shortName: '',
          detail: '',
          code: ''
        })
        this.selectedStructure = null
      } else {
        this.userProfile.structure = node.data.profile
      }
    } else {
      this.selectedStructure = null
      this.alertMessage.emit({ severity: 'warn', summary: 'เลือกได้เฉพาะหน่วยงานเท่านั้น', detail: node.label })
    }
  }

  findNode(tree: TreeNode[], id: number): any {
    let node = null
    for (let i = 0; i < tree.length; i++) {
      let tmp = this.findNodeRecursive(tree[i], id)
      if (tmp) {
        node = tmp; break
      }
    }
    return node
  }
  findNodeRecursive(node: TreeNode, id: number): any {
    if (!node.leaf && node.data.id === id) {
      return node
    } else if (node.children) {
      let res = null
      for (let i = 0; i < node.children.length; i++) {
        if (res == null) {
          res = this.findNodeRecursive(node.children[i], id)
        }
      }
      return res
    }
    return null
  }

  positionFilter(event) {
    this.filteredPosition = this.positions.filter((position: Position) => {
      return event.query ? position.name.toLowerCase().indexOf(event.query.toLowerCase()) > -1 : false
    })
  }

  handlePositionDropdown(event) {
    this.filteredPosition = this.positions
    event.originalEvent.preventDefault()
    event.originalEvent.stopPropagation()
    if (this.acPosition.panelVisible) {
      this.acPosition.hide()
    } else {
      this.acPosition.show()
    }
  }

}
