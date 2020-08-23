import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { PxService, } from '../../../../main/px.service'
import { FileUploader } from 'ng2-file-upload'
import { TreeModule, TreeNode, Message, AutoComplete } from 'primeng/primeng'

import { UserService } from '../../../service/user.service'
import { UserProfileService } from '../../../service/user-profile.service'
import { StructureService } from '../../../service/structure.service'
import { MasterDataService } from '../../../service/master-data.service'
import { InboxService } from '../../../../mwp/service/inbox.service'
import { ParamSarabanService } from '../../../../saraban/service/param-saraban.service'

import { User } from '../../../model/user.model'
import { UserProfile } from '../../../model/user-profile.model'
import { Structure } from '../../../model/structure.model'
import { Title } from '../../../model/title.model'
import { UserProfileType } from '../../../model/user-profile-type.model'
import { Position } from '../../../model/position.model'
import { PositionType } from '../../../model/position-type.model'
import { UserStatus } from '../../../model/user-status.model'
import { FileAttach } from '../../../../main/model/file-attach.model'
import { UserProfileFolder } from '../../../model/user-profile-folder.model'

@Component({
  selector: 'app-add-user-profile',
  templateUrl: './add-user-profile.component.html',
  styleUrls: ['./add-user-profile.component.styl'],
  providers: [UserService, UserProfileService, StructureService, MasterDataService, PxService]
})
export class AddUserProfileComponent implements OnInit {
  @Input() toggleCommand: boolean = true
  @Input() userId: number
  @Input() structureId: number
  @Output() alertMessage = new EventEmitter()
  @Output() alertMessageUser = new EventEmitter()
  toggleAddProfile: boolean = true
  toggleListProfile: boolean = true
  modeProfile: string = 'add'
  // department: Structure[] = []
  userProfile: UserProfile
  userProfileList: UserProfile[] = []
  // userId: number
  // userProfileId: number
  nowDate: Date
  titles: Title[] = []
  userProfileTypes: UserProfileType[] = []
  positions: Position[] = []
  positionTypes: PositionType[] = []
  msgs: Message[] = []
  isValid: boolean = false;

  posLevel = [
    { id: 0, name: 'เลือกระดับ' },
    { id: 1, name: 'ระดับปฏิบัติงาน' },
    { id: 2, name: 'ระดับปฏิบัติการ' },
    { id: 3, name: 'ระดับชำนาญงาน' },
    { id: 4, name: 'ระดับชำราญการ' },
    { id: 5, name: 'ระดับอาวุโส' },
    { id: 6, name: 'ระดับชำนาญการพิเศษ' },
    { id: 7, name: 'ระดับทักษะพิเศษ' },
    { id: 8, name: 'ระดับเชี่ยวชาญ' },
    { id: 9, name: 'ระดับทรงคุณวุฒิ' }
  ]
  // userStatuss: UserStatus[] = []
  // private myDatePickerOptions: IMyOptions = {
  //     dateFormat: 'dd/mm/yyyy',
  //     editableDateField: false,
  //     height: '30px',
  //     width: '100%',
  //     inline: false,
  //     selectionTxtFontSize: '14px',
  //     openSelectorOnInputClick: true,
  //     showSelectorArrow: false,
  //     componentDisabled: false
  // }
  dialog: boolean = false
  structureTree: TreeNode[] = []
  selectedStructure: TreeNode = null
  showUserProfileList: boolean = true
  title = ''
  @ViewChild('acPosition') acPosition: AutoComplete
  filteredPosition: Position[] = []

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _userService: UserService,
    private _userProfileService: UserProfileService,
    private _location: Location,
    private _pxService: PxService,
    private _structureService: StructureService,
    private _masterDataService: MasterDataService,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.nowDate = new Date()
    this.userProfile = new UserProfile({
      structure: new Structure({ id: this.structureId })
      // title: new Title({
      //   id:1
      // })
    })
    // this.user = new User({
    //   name:"",
    //   passwords:"",
    //   activeDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth()+ 1, day: this.nowDate.getDate() } },
    // })
    // this.userResult = new User()
    // console.log(this.userId)
    Object.assign(this.structureTree, this._paramSarabanService.structureTree)
  }

  ngOnInit() {
    console.log('AddUserProfileComponent')
    this._route.params
      .subscribe((params: Params) => {
        // if (!isNaN(params['userProfileId'])){
        //   this.userProfileId = +params['userProfileId']
        //   this.getProfileForEdit(this.userProfileId,'1.1')
        //   this.toggleAddUser = false
        //   this.toggleListProfile = false

        // } 
        // this.mode = params['mode']
        // if (!isNaN(params['userId'])) {
        //   // this.userProfileList = new UserProfile()
        // this.userId = +params['userId']
        // console.log('this.userId = '+this.userId)
        //   // this.formAddUser = true
        //   this.getUser(this.userId)
        // if (!isNaN(this.userId)){
        //   this.getUserProfilesByUserId(this.userId)
        // }

        //   console.log(this.userProfileId)
        // }

      })
    // this.getDepartments()
    this.getTitle()
    // this.getUserProfileType()
    // this.getPosition()
    // this.getUserStatus()
    // this.userProfile.title.id = 2
  }

  getTitle() {
    this._masterDataService
      .getMasterDatas('titles')
      .subscribe(response => {
        this.titles = response as Title[]
        // this.userProfile.title.id = 2
        this.getUserProfileType()
      })
  }

  getUserProfileType = () => {
    this._masterDataService
      .getMasterDatas('userProfileTypes')
      .subscribe(response => {
        this.userProfileTypes = response as UserProfileType[]
        if (this.userProfileTypes.length == 3) this.userProfileTypes.pop()
        this.getPosition()
        this.getPositionType()
        if (this.userId !== 0) {
          this.getUserProfilesByUserId(this.userId)
        }
      })
  }

  getPosition() {
    this._masterDataService
      .getMasterDatas('positions')
      .subscribe(response => {
        this.positions = response as Position[]

        // if (this.userId !== 0){
        //   this.getUserProfilesByUserId(this.userId)
        // }
        // this.getUserProfilesByUserId(this.userId)
        console.log('upf', this.userProfile)
        // if (this.userProfile.id != 0) {
        //   this.selectedPosition = response.find(position => position.id == this.userProfile.position.id)
        // }
      })
  }

  getPositionType() {
    this._masterDataService
      .getMasterDatas('positionTypes/types')
      .subscribe(response => {
        this.positionTypes = response as PositionType[]
        // if (this.userId !== 0){
        //   this.getUserProfilesByUserId(this.userId)
        // }
        // this.getUserProfilesByUserId(this.userId)
      })
  }

  // getUserStatus(){
  //   this._masterDataService
  //       .getMasterDatas('userStatuss')
  //       .subscribe(response => this.userStatuss = response as UserStatus[])
  // }

  // getDepartments() {
  // this._loadingService.register('main')
  // this._structureService
  //   .getStructures()
  //   .subscribe(response => {
  //     this.department = response as Structure[]
  //   })
  // this._loadingService.resolve('main')
  // }

  getUserProfilesByUserId(userId: number) {
    console.log('getUserProfilesByUserId', userId)
    this._loadingService.register('main')
    this._userProfileService
      .getUserProfilesByUserId(userId)
      .subscribe(response => {
        console.log('userProfiles', response)
        this.userProfileList = []
        this.userProfileList = response as UserProfile[]
        this.userProfileList.forEach(userProfile => {
          if (userProfile.position === null) {
            userProfile.position = new Position()
          }
          if (userProfile.positionType === null) {
            userProfile.positionType = new PositionType()
          }
        })
        this._loadingService.resolve('main')
      })
  }

  openFormAddProfile() {
    this.toggleAddProfile = !this.toggleAddProfile
    this.toggleCommand = !this.toggleCommand
    this.userProfile = new UserProfile()
    this.modeProfile = 'add'
    let node = this.findNode(this.structureTree, this.structureId)
    if (node) {
      this.selectedStructure = node
      this.userProfile.structure = node.data.profile
    }
    this.showUserProfileList = false
    this.title = 'สร้างรายละเอียดผู้ใช้งาน'
  }

  // getProfileForEdit(userProfileId: number, version: string){
  //   this._loadingService.register('main')
  //   this._userProfileService
  //       .getUserProfile(userProfileId,version)
  //       .subscribe(response => {
  //         this.userProfile = response as UserProfile
  //         this.user = this.userProfile.user
  //         this.userResult = this.userProfile.user
  //         this.userProfileList.push(new UserProfile(this.userProfile))
  //         this._loadingService.resolve('main')
  //       })
  // }

  // getProfile(userProfileId: number, version: string){
  //   this._loadingService.register('main')
  //   this._userProfileService
  //   .getUserProfile(userProfileId,version)
  //   .subscribe(response => {
  //     this.userProfile = response as UserProfile
  //     // this.user = this.userProfile.user
  //     // this.userResult = this.userProfile.user
  //     // this.
  //   })
  //   this._loadingService.resolve('main')
  // }

  createProfile(addUserProfiles: UserProfile) {
    //check Code
    // if (!this.isValid) {
    this._userProfileService
      .checkUserCode(addUserProfiles.code, 0)
      .subscribe(response => {
        //check Code
        if (response.result) {
          this.alertMessage.emit(true)
        } else {

          this.userProfile.user.id = this.userId
          this.userProfile.fullName = this.userProfile.firstName + ' ' + this.userProfile.lastName
          this.userProfile.fullNameEng = this.userProfile.firstNameEng + ' ' + this.userProfile.lastNameEng
          // this.userProfile.user = this._userProfileService.convertDateFormat(new User(this.user))
          console.log('createProfile', this.userProfile)
          this._loadingService.register('main')
          // this.userProfileList.push(new UserProfile(this.userProfile))
          this._userProfileService
            .createUserProfile(this.userProfile)
            .subscribe(response => {
              this.userProfileList.push(response)
              // this.getUserProfilesByUserId(this.user.id)
              this.toggleAddProfile = !this.toggleAddProfile
              this.toggleCommand = !this.toggleCommand
              // this.toggleListProfile = false
              // this.getUserProfilebyuserId(this.userId)
              let userProfile = response as UserProfile
              this.createUserProfileFolder(userProfile)
              this.showUserProfileList = true
            })
        }
        //check Code
      })
    // }
  }

  createUserProfileFolder(userProfile: UserProfile) {
    //create Inbox 
    let userProfileFolder = new UserProfileFolder({
      userProfileId: userProfile.id,
      userProfileFolderName: 'กล่องหนังสือเข้า',
      userProfileFolderType: 'I',
      userProfileFolderDetail: 'หนังสือเข้าของ ' + userProfile.fullName
    })
    this._userProfileService
      .createUserProfileFolder(userProfileFolder)
      .subscribe(response => {
        //create OutBox, 
        userProfileFolder = new UserProfileFolder({
          userProfileId: userProfile.id,
          userProfileFolderName: 'กล่องหนังสือออก',
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
    console.log('updateProfile', updateProfile)
    // this.getProfile(userProfile.id,'1.0')
    this.toggleAddProfile = false
    this.toggleCommand = true
    this.modeProfile = 'edit'
    this.userProfile = updateProfile
    this.showUserProfileList = false
    this.title = 'แก้ไขรายละเอียดผู้ใช้งาน: ' + updateProfile.fullName
  }

  cancelCreateProfile() {
    this.toggleAddProfile = !this.toggleAddProfile
    this.toggleCommand = !this.toggleCommand
    // this.toggleListProfile = !this.toggleListProfile
    this.showUserProfileList = true
  }

  updateProfile(updateProfile: UserProfile) {
    //check Code
    if (updateProfile.userProfileType.id === 3 && updateProfile.idCard == null) {
      this.isValid = true
    }

    if (!this.isValid) {
      this._userProfileService
        .checkUserCode(updateProfile.code, updateProfile.id)
        .subscribe(response => {
          //check Code
          if (response.result) {
            this.alertMessage.emit(true)
          } else {
            this._loadingService.register('main')
            // setTimeout(() => {
            this._userProfileService
              .updateUserProfile(updateProfile)
              .subscribe(response => {
                this._loadingService.resolve('main')
                this.alertMessageUser.emit(true)
                this.getUserProfilesByUserId(this.userId)
                this.toggleAddProfile = !this.toggleAddProfile
                this.toggleCommand = false
                this.toggleListProfile = false
                this.showUserProfileList = true
              })
            // }, 2000);
          }
        })
    } else {
      this.alertMessageUser.error(true)
    }
  }

  setDefaultProfile = (updateProfile: UserProfile) => {
    this._userProfileService
      .setDefaultProfile(updateProfile)
      .subscribe(response => {
        this.getUserProfilesByUserId(this.userId)
      })
  }

  genFormat(event: any) {
    console.log('event : ', event)
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
        // this.userProfile.structure.name = event.node.label
        // this.userProfile.structure.id = event.id
        this.userProfile.structure = node.data.profile
        console.log(this.userProfile)
      }
    } else {
      this.selectedStructure = null
      this.msgs = []
      this.msgs.push({ severity: 'warn', summary: 'เลือกได้เฉพาะหน่วยงานเท่านั้น', detail: node.label })
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
    this.filteredPosition = []
    this.filteredPosition = this.positions.filter(position => {
      return event.query ? position.name.toLowerCase().indexOf(event.query.toLowerCase()) > -1 : false
    })
  }

  handleDropdown(event) {
    this.filteredPosition = this.positions
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    if (this.acPosition.panelVisible) {
      this.acPosition.hide();
    } else {
      this.acPosition.show();
    }
  }

}
