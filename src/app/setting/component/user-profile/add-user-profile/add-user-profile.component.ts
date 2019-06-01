import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { PxService, } from '../../../../main/px.service'
import { FileUploader } from 'ng2-file-upload'
import { TreeModule, TreeNode, Message } from 'primeng/primeng'

import { UserService } from '../../../service/user.service'
import { UserProfileService } from '../../../service/user-profile.service'
import { StructureService } from '../../../service/structure.service'
import { MasterDataService } from '../../../service/master-data.service'
import { InboxService } from '../../../../mwp/service/inbox.service'

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
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' },
    { id: 10, name: '10' },
    { id: 11, name: 'ลูกจ้างบริษัท' }
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
  }

  ngOnInit() {
    console.log(this.userId)
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
    console.log('getUserProfileType')
    this._masterDataService
      .getMasterDatas('userProfileTypes')
      .subscribe(response => {
        this.userProfileTypes = response as UserProfileType[]
        this.getPosition()
        this.getPositionType()
        if (this.userId !== 0) {
          this.getUserProfilesByUserId(this.userId)
        }
      })
  }

  getPosition() {
    console.log('getPosition')
    this._masterDataService
      .getMasterDatas('positions')
      .subscribe(response => {
        this.positions = response as Position[]

        // if (this.userId !== 0){
        //   this.getUserProfilesByUserId(this.userId)
        // }
        // this.getUserProfilesByUserId(this.userId)
      })
  }

  getPositionType() {
    console.log('getPositionType')
    this._masterDataService
      .getMasterDatas('positionTypes/types')
      .subscribe(response => {
        this.positionTypes = response as PositionType[]
        console.log(this.positionTypes)
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
    console.log(userId)
    this._loadingService.register('main')
    this._userProfileService
      .getUserProfilesByUserId(userId, '1.1')
      .subscribe(response => {
        console.log(response)
        // this.userProfileList.length = 0
        this.userProfileList = []
        // this.userProfileList = response as UserProfile[]
        let userProfileL = response as UserProfile[]
        for (let i = 0; i < userProfileL.length; i++) {
          if (userProfileL[i].position === null) {
            userProfileL[i].position = new Position()
          }
          if (userProfileL[i].positionType === null) {
            userProfileL[i].positionType = new PositionType()
          }
          this.userProfileList.push(new UserProfile(userProfileL[i]))
        }

        this._loadingService.resolve('main')
      })
  }

  openFormAddProfile() {
    this.toggleAddProfile = !this.toggleAddProfile
    this.toggleCommand = !this.toggleCommand
    this.userProfile = new UserProfile()
    this.modeProfile = 'add'
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
          console.log(response)
          //check Code
          if (response.result) {
            this.alertMessage.emit(true)
          } else {

            this.userProfile.user.id = this.userId
            this.userProfile.fullName = this.userProfile.firstName + ' ' + this.userProfile.lastName
            this.userProfile.fullNameEng = this.userProfile.firstNameEng + ' ' + this.userProfile.lastNameEng
            this.userProfile.structure.id = this.structureId
            // this.userProfile.user = this._userProfileService.convertDateFormat(new User(this.user))
            console.log('createProfile', this.userProfile)
            this._loadingService.register('main')
            // this.userProfileList.push(new UserProfile(this.userProfile))
            this._userProfileService
              .createUserProfile(this.userProfile)
              .subscribe(response => {
                this.userProfileList.push(new UserProfile(this.userProfile))
                // this.getUserProfilesByUserId(this.user.id)
                this.toggleAddProfile = !this.toggleAddProfile
                this.toggleCommand = !this.toggleCommand
                // this.toggleListProfile = false
                // this.getUserProfilebyuserId(this.userId)
                let userProfile = response as UserProfile
                this.createUserProfileFolder(userProfile)
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
      userProfileFolderName: 'กล่องข้อมูลเข้า',
      userProfileFolderType: 'I',
      userProfileFolderDetail: 'ข้อมูลเข้าของ ' + userProfile.fullName
    })
    this._userProfileService
      .createUserProfileFolder(userProfileFolder)
      .subscribe(response => {
        //create OutBox, 
        userProfileFolder = new UserProfileFolder({
          userProfileId: userProfile.id,
          userProfileFolderName: 'กล่องข้อมูลออก',
          userProfileFolderType: 'O',
          userProfileFolderDetail: 'ข้อมูลออกของ ' + userProfile.fullName
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
  }

  cancelCreateProfile() {
    this.toggleAddProfile = !this.toggleAddProfile
    this.toggleCommand = !this.toggleCommand
    // this.toggleListProfile = !this.toggleListProfile
  }

  updateProfile(updateProfile: UserProfile) {
    //check Code
    if(updateProfile.userProfileType.id === 3 && updateProfile.idCard == null){
      this.isValid = true
    }
    
    if (!this.isValid) {
    this._userProfileService
      .checkUserCode(updateProfile.code, updateProfile.id)
      .subscribe(response => {
        console.log(response)
        //check Code
        if (response.result) {
          this.alertMessage.emit(true)
        } else {
          this._loadingService.register('main')
          // setTimeout(() => {
          this._userProfileService
            .updateUserProfile(updateProfile)
            .subscribe(response => {
              this.alertMessageUser.emit(true)
              this.getUserProfilesByUserId(updateProfile.user.id)
              this.toggleAddProfile = !this.toggleAddProfile
              this.toggleCommand = false
              this.toggleListProfile = false
            })
          this._loadingService.resolve('main')
          // }, 2000);
        }
      })
    }else{
      this.alertMessageUser.error(true)
    }
  }

  setDefaultProfile = (updateProfile: UserProfile) => {
    this._userProfileService
      .setDefaultProfile(updateProfile)
      .subscribe(response => {
        this.getUserProfilesByUserId(updateProfile.user.id)
      })
  }

  onDateChanged(event: any) {
  }

  addOptionLevel(value: any) {
    // this.newPerStatus = this.perStatus
    if (value !== '') {
      this.posLevel = this.posLevel.filter(model => model.name.match(value + '+'))
    }
  }

  genFormat(event: any) {
    console.log('event : ', event)
  }
}
