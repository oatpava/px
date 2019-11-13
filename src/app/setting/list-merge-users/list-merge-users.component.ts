import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService, LoadingType, LoadingMode } from '@covalent/core'
import { TreeModule, TreeNode, Message } from 'primeng/primeng'
import { Location } from '@angular/common'
import { MdDialog, MdDialogRef } from '@angular/material'

import { MergeUserComponent } from '../../setting/component/merge-user/merge-user.component'
import { MergeStructureComponent } from '../../setting/component/merge-structure/merge-structure.component'

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableSelectEvent } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core'

import { PxService } from '../../main/px.service'

import { VStructureModel } from '../../setting/model/structure.model'
import { StructureConvertModel } from '../../setting/model/structure.model'
import { StructureService } from '../../setting/component/structure/structure.service'
import { ConfirmDialogComponent } from '../../main/component/confirm-dialog/confirm-dialog.component'

import { UserProfile } from '../model/user-profile.model'
import { vUserProfile } from '../model/user-profile.model'
import { convertUserPorfile } from '../model/user-profile.model'

import { Observable } from 'rxjs/Observable'
import { UserProfileService } from '../service/user-profile.service'
import { UserProfileFolder } from '../model/user-profile-folder.model'


@Component({
  selector: 'app-list-merge-users',
  templateUrl: './list-merge-users.component.html',
  styleUrls: ['./list-merge-users.component.styl'],
  providers: [PxService, StructureService]
})
export class ListMergeUsersComponent implements OnInit {
  msgs: Message[] = []
  data: any[] = [] //no source
  ModeSearch: boolean = true
  dataSearch: 'none'
  allRecord: number = 0
  allCheck: boolean = true
  numCheck: number = 0
  dataRow: any
  selectedRow: any[]
  searchMerge: any
  status: any = [
    {
      id: null,
      name: ''
    }, {
      id: 1,
      name: 'เพิ่ม'
    }, {
      id: 2,
      name: 'ลบ'
    }, {
      id: 3,
      name: 'แก้ไข'
    }, {
      id: 4,
      name: 'ย้าย'
    }, {
      id: 5,
      name: 'ย้ายและแก้ไข'
    }
  ]
  rowSelected: convertUserPorfile[] = []
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _pxService: PxService,
    private _dialog: MdDialog,
    private _dataTableService: TdDataTableService,
    private _structureService: StructureService,
    private _userProfileService: UserProfileService,
  ) { }

  ngOnInit() {
    this.searchMerge = {
      vstatus: '',
      userCode: '',
      fullName: '',
      positionName: '',
      structureCode: '',
      structureName: '',
      strucShortName: '',
    }
    this.getdata()
  }


  getdata() {  //no source
    this.selectedRow = []
    this._loadingService.register('main')
    this._userProfileService
      .getUserprofileConvert('1.0', '0', '20', '', '')
      .subscribe(response => {
        console.log(response)
        this._loadingService.resolve('main')
        this.data = response
        this.allRecord = response.length
      });
  }


  searchdata(data) {  //no source
    console.log(data)
    this._loadingService.register('main')
    this._userProfileService
      .searchUserprofileConvert(data, '1.0', '0', '20', '', '')
      .subscribe(response => {
        console.log(response)
        this._loadingService.resolve('main')
        this.data = response
        this.allRecord = response.length
      });
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }

  onDateChanged(event: any) {
  }

  selectRow(data) {
    // console.log(data)
    let dialogRef = this._dialog.open(MergeUserComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.data = data
    // instance.structureData = this.parentStructure
    dialogRef.afterClosed().subscribe(result => {

    })
  }


  save() {
    console.log(this.selectedRow)
    let dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.dataName = 'ดำเนินการเพื่อปรับโครงสร้างผู้ใช้งานตามที่เลือก '
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'บันทึกสำเร็จ',
          detail: 'ดำเนินการเพื่อปรับโครงสร้างผู้ใช้งานเรียบร้อย'
        })
        this.rowSelected = []
        this.selectedRow.forEach((data: any) => {
          let rowSelected: convertUserPorfile = new convertUserPorfile()
          console.log(data)
          rowSelected.status = data.status

          if (data.userProfile == null) {
            rowSelected.userProfile = null
          } else {
            rowSelected.userProfile.id = data.userProfile.id
            rowSelected.userProfile.structure = data.userProfile.structure
            rowSelected.userProfile.title = data.userProfile.title
            rowSelected.userProfile.firstName = data.userProfile.firstName
            rowSelected.userProfile.lastName = data.userProfile.lastName
            rowSelected.userProfile.fullName = data.userProfile.fullName
            rowSelected.userProfile.email = data.userProfile.email
            rowSelected.userProfile.userProfileType = data.userProfile.userProfileType
            rowSelected.userProfile.tel = data.userProfile.tel
            rowSelected.userProfile.defaultSelect = data.userProfile.defaultSelect
            rowSelected.userProfile.firstNameEng = data.userProfile.firstNameEng
            rowSelected.userProfile.lastNameEng = data.userProfile.lastNameEng
            rowSelected.userProfile.fullName = data.userProfile.fullName
            rowSelected.userProfile.idCard = data.userProfile.idCard
            rowSelected.userProfile.code = data.userProfile.code
            rowSelected.userProfile.address = data.userProfile.address
            rowSelected.userProfile.position = data.userProfile.position
            rowSelected.userProfile.positionType = data.userProfile.positionType
            rowSelected.userProfile.digitalKey = data.userProfile.digitalKey
            rowSelected.userProfile.userStatus = data.userProfile.userStatus
            rowSelected.userProfile.user = data.userProfile.user
            rowSelected.userProfile.positionLevel = data.userProfile.positionLevel
          }
          if (data.vUserProfile == null) {
            rowSelected.vUserProfile = null
          }
          else {

            rowSelected.vUserProfile.id = data.vUserProfile.id
            rowSelected.vUserProfile.structure = data.vUserProfile.structure
            rowSelected.vUserProfile.title = data.vUserProfile.title
            rowSelected.vUserProfile.firstName = data.vUserProfile.firstName
            rowSelected.vUserProfile.lastName = data.vUserProfile.lastName
            rowSelected.vUserProfile.fullName = data.vUserProfile.fullName
            rowSelected.vUserProfile.email = data.vUserProfile.email
            rowSelected.vUserProfile.userProfileType = data.vUserProfile.userProfileType
            rowSelected.vUserProfile.tel = data.vUserProfile.tel
            rowSelected.vUserProfile.firstNameEng = data.vUserProfile.firstNameEng
            rowSelected.vUserProfile.lastNameEng = data.vUserProfile.lastNameEng
            rowSelected.vUserProfile.fullName = data.vUserProfile.fullName
            rowSelected.vUserProfile.idCard = data.vUserProfile.idCard
            rowSelected.vUserProfile.userProfileType = data.vUserProfile.userProfileType
            rowSelected.vUserProfile.tel = data.vUserProfile.tel
            rowSelected.vUserProfile.firstNameEng = data.vUserProfile.firstNameEng
            rowSelected.vUserProfile.lastNameEng = data.vUserProfile.lastNameEng
            rowSelected.vUserProfile.fullName = data.vUserProfile.fullName
            rowSelected.vUserProfile.address = data.vUserProfile.address
            rowSelected.vUserProfile.position = data.vUserProfile.position
            rowSelected.vUserProfile.code = data.vUserProfile.code
            // rowSelected.vUserProfile.positionType = data.vUserProfile.positionType
            rowSelected.vUserProfile.positionLevel = data.vUserProfile.positionLevel
            rowSelected.vUserProfile.userStatus = data.vUserProfile.userStatus
          }

          this.rowSelected.push(rowSelected)
        })
        console.log(this.rowSelected)


        this._loadingService.register('main')
        this._userProfileService
          .convertUserprofile(this.rowSelected)
          .subscribe(response => {
            console.log(response)
            this._loadingService.resolve('main')           
            
            this.getdata()//do folder action in service instead
            // let tmp: any[] = []
            // tmp.push(this._userProfileService.createUserProfileFolder(this.genInbox(response[0])))
            // tmp.push(this._userProfileService.createUserProfileFolder(this.genOutbox(response[0])))
            // tmp.push(this._userProfileService.createUserProfileFolder(this.genRecyclebin(response[0])))
            // tmp.push(this._userProfileService.createUserProfileFolder(this.genMyWork(response[0])))
            // this._loadingService.register('main')
            // Observable.forkJoin(tmp)
            //   .subscribe((res: any[]) => {
            //     this._loadingService.resolve('main')
            //     this.getdata()
            //   })
          })
      }
    })
  }

  saveAll() {
    console.log(this.selectedRow)
    this._loadingService.register('main')
    this._userProfileService
      .convertUserprofile(this.data)
      .subscribe(response => {
        console.log(response)
        this._loadingService.resolve('main')
        
        this.getdata()//do folder action in service instead
        // let tmp: any[] = []
        // response.forEach(userProfile => {
        //   tmp.push(this._userProfileService.createUserProfileFolder(this.genInbox(userProfile)))
        //   tmp.push(this._userProfileService.createUserProfileFolder(this.genOutbox(userProfile)))
        //   tmp.push(this._userProfileService.createUserProfileFolder(this.genRecyclebin(userProfile)))
        //   tmp.push(this._userProfileService.createUserProfileFolder(this.genMyWork(userProfile)))
        // })
        // this._loadingService.register('main')
        // Observable.forkJoin(tmp)
        //   .subscribe((res: any[]) => {
        //     this._loadingService.resolve('main')
        //     this.getdata()
        //   })
      })
  }

  goBack() {
    this._location.back()
  }

  genInbox(userProfile: UserProfile): UserProfileFolder {
    return new UserProfileFolder({
      userProfileId: userProfile.id,
      userProfileFolderName: 'กล่องหนังสือเข้า',
      userProfileFolderType: 'I',
      userProfileFolderDetail: 'หนังสือเข้าของ ' + userProfile.fullName
    })
  }

  genOutbox(userProfile: UserProfile): UserProfileFolder {
    return new UserProfileFolder({
      userProfileId: userProfile.id,
      userProfileFolderName: 'กล่องหนังสือออก',
      userProfileFolderType: 'O',
      userProfileFolderDetail: 'หนังสือออกของ ' + userProfile.fullName
    })
  }

  genRecyclebin(userProfile: UserProfile): UserProfileFolder {
    return new UserProfileFolder({
      userProfileId: userProfile.id,
      userProfileFolderName: 'ถังขยะ',
      userProfileFolderType: 'Z',
      userProfileFolderDetail: 'ถังขยะของ ' + userProfile.fullName
    })
  }

  genMyWork(userProfile: UserProfile): UserProfileFolder {
    return new UserProfileFolder({
      userProfileId: userProfile.id,
      userProfileFolderName: 'แฟ้มส่วนตัว',
      userProfileFolderType: 'W',
      userProfileFolderDetail: 'แฟ้มส่วนตัวของ ' + userProfile.fullName
    })
  }





}
