import { Component, OnInit, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'

import { MdDialog, MdDialogRef } from '@angular/material';
import { DeleteDialogComponent } from '../../../main/component/delete-dialog/delete-dialog.component';

import { PxService, } from '../../../main/px.service'

import { IMyOptions, IMyDateModel } from 'mydatepicker'

import { FolderService } from '../../service/folder.service'
import { Folder } from '../../model/folder.model'
import { DocumentType } from '../../model/documentType.model'

import { UserProfileService } from '../../../setting/service/user-profile.service'

import { UserProfile } from '../../../setting/model/user-profile.model'

import { ListUserDmsComponent } from '../dialog-list-user/list-user.component'

import { DialogListWfTypeComponent } from '../dialog-list-wf-type/dialog-list-wf-type.component'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.styl'],
  providers: [FolderService, PxService, UserProfileService],
})
export class AddFolderComponent implements OnInit {
  title: string = 'เพิ่ม'
  nameAdd: string = 'aaa'
  icon: string = ''
  parentId: number
  documentTypes: DocumentType[] = []
  folder: Folder
  menuType: string
  folderId: number
  mode: string
  documentTypeId: number
  documentTypeTemp: any

  checkDrawer: boolean = false

  nowDate: Date
  tempDay: any

  createName: string = ''
  userProfile: UserProfile
  folderTypeExpires: any

  isFolder: boolean = false
  userPreExpire: string = ''
  userPreExpireFolder: any = null

  folderName: string = ''

  folderNameInput: any

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: false,
    showSelectorArrow: false,
    componentDisabled: true
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,
    private _location: Location,
    private _dialog: MdDialog,
    private _pxService: PxService,
    private _userProfileService: UserProfileService,
  ) {
    this.nowDate = new Date()
    this.folder = new Folder()
    this.folder.createDate = { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      this.folderId = 0

    this.mode = 'Add'
    this.getUserProfile()
    this.folderTypeExpires = [
      {
        id: 1,
        name: 'วัน',
        data: 'D'

      },
      {
        id: 2,
        name: 'เดือน',
        data: 'M'

      },
      {
        id: 3,
        name: 'ปี',
        data: 'Y'

      },
    ]

  }

  ngOnInit() {
    console.log('--- AddFolderComponent ---')
    this._route.params
      .subscribe((params: Params) => {
        // console.log('parentId = '+params['parentId'])
        // console.log('folderType = '+params['folderType'])
        if (!isNaN(params['parentId'])) this.parentId = +params['parentId']
        if (!isNaN(params['documentTypeId'])) {
          this.documentTypeId = +params['documentTypeId']
          // this.folder.documentTypeId = this.documentTypeId;
          console.log(this.documentTypeId)
          console.log(this.folder)
        }

        // console.log(this.documentTypeId)

        this.title += params['menuName'] + 'เอกสาร'
        console.log(this.title)
        this.menuType = params['menuType']
        if (this.menuType == 'C') { this.nameAdd = 'ชื่อตู้เอกสาร'; this.icon = 'dashboard'; }
        if (this.menuType == 'D') { this.nameAdd = 'ชื่อลิ้นชักเอกสาร'; this.icon = 'dns';  }
        if (this.menuType == 'F') { this.nameAdd = 'ชื่อแฟ้มเอกสาร'; this.icon = 'folder'; this.isFolder = true, this.checkDrawer = true }
        // console.log(this.menuType)
        this.getDocumentTypes()



        if (!isNaN(params['folderId'])) this.folderId = +params['folderId']

        if (this.folderId > 0) {
          this.mode = 'Edit'
          this.title = 'แก้ไข'
          this.getFolder(this.folderId)

        }

      })

  }

  onDateChanged(event: any) {
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  getDocumentTypes(): void {
    this._folderService
      .getDocumentTypes()
      .subscribe(response => {
        this.documentTypes = response as DocumentType[]
        this.folder.documentTypeId = this.documentTypeId;

        console.log(this.documentTypes)

      })
  }

  getFolder(folderId: number): void {
    this._folderService
      .getFolder(folderId)
      .subscribe(response => {
        this.folder = response as Folder
        switch (this.folder.folderType) {
          case 'C':
            this.title += 'ตู้เอกสาร'
            this.nameAdd = 'ชื่อตู้เอกสาร'
            this.icon = 'dashboard'
            break
          case 'D':
            this.title += 'ลิ้นชักเอกสาร'
            this.nameAdd = 'ชื่อลิ้นชักเอกสาร'
            this.icon = 'dns'

            break
          case 'F':
            this.title += 'แฟ้มเอกสาร'
            this.nameAdd = 'ชื่อแฟ้มเอกสาร'
            this.icon = 'folder'
            this.isFolder = true

            break
        }

        if (this.folder.createDate != "") {
          this.folder.createDate = this._pxService.convertStringToDate(this.folder.createDate)
        }
        if (this.folder.userProfileCreate != null) {
          this.createName = this.folder.userProfileCreate.fullName
        }
        if (this.folder.dmsUserProfilePreExpire != null) {
          this.userPreExpire = this.folder.dmsUserProfilePreExpire.fullName
        }

        console.log('this.folder')
        console.log(this.folder)
        //  this.folder.documentTypeId = 1
      })
  }

  save(newFolder: Folder) {
    console.log('-- save -- ')
    console.log('folderName = ', this.folderName)
    console.log('folderName 2= ', newFolder.folderName)
    newFolder.folderParentId = this.parentId
    newFolder.folderType = this.menuType

    if (this.folderName == '') {
      newFolder.folderName = newFolder.folderName
    } else {
      newFolder.folderName = this.folderName
    }

    if (this.userPreExpireFolder != null) {
      newFolder.dmsUserPreExpire = this.userPreExpireFolder.id
    }
    switch (newFolder.folderType) {
      case 'C':
        newFolder.icon = 'dashboard'
        newFolder.iconColor = '#f93550'
        break
      case 'D':
        newFolder.icon = 'dns'
        newFolder.iconColor = '#4ee832'
        break
      case 'F':
        newFolder.icon = 'folder'
        newFolder.iconColor = '#e6b800'
        break
    }
    console.log(newFolder)
    newFolder.createDate = ''

    this._loadingService.register('main')
    this._folderService
      .createFolder2(newFolder)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this._location.back()
      })
  }

  update(updateFolder: Folder) {
    updateFolder.createDate = ''
    // updateFolder.folderName = this.folderName
    if (this.folderName == '') {
      updateFolder.folderName = updateFolder.folderName
    } else {
      updateFolder.folderName = this.folderName
    }

    if (this.userPreExpireFolder != null) {
      updateFolder.dmsUserPreExpire = this.userPreExpireFolder.id
    }
    console.log(updateFolder)
    this._folderService
      .updateFolder(updateFolder)
      .subscribe(response => {
        this._location.back()
      })
  }

  delete(deleteFolder: Folder) {
    this._folderService
      .deleteFolder(deleteFolder)
      .subscribe(response => {
        this._location.back()
      })
  }

  cancel() {
    this._location.back()
  }


  // selectedDay: any; 
  //   selectedMonth: any; 
  //   selectedYear: any; 
  //   day: any;

  //   onDateChanged(event: any) {
  //       console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  //      this.selectedDay=event.date.day;
  //      this.selectedMonth=event.date.month;
  //      this.selectedYear=event.date.year;
  //      console.log(this.selectedDay);
  //      console.log(this.selectedMonth);
  //      console.log(this.selectedYear);
  //      this.day = this.selectedDay+'/'+this.selectedMonth+'/'+(this.selectedYear+543);
  //      console.log(this.day);


  //   }

  goBack() {
    this._location.back()
  }

  openDialog(deleteFolder: Folder): void {
    let dialogRef = this._dialog.open(DeleteDialogComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this._folderService
          .deleteFolder(deleteFolder)
          .subscribe(response => {
            this._location.back()
          })
      }
    });
  }


  getUserProfile() {
    this._userProfileService
      .getUserProfile(-1, '1.0')
      .subscribe(response => {
        this.userProfile = response as UserProfile

        this.createName = this.userProfile.fullName
        console.log('getUserProfile', this.userProfile)
      })


  }

  addName() {
    console.log('-- addName --')

    let dialogRef = this._dialog.open(ListUserDmsComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.userPreExpireFolder = result
      this.userPreExpire = result.fullName
    });
  }

  listWfdocType() {
    console.log('-- listWfdocType --')

    let dialogRef = this._dialog.open(DialogListWfTypeComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result.name);
      this.folderName = result.name
    });
  }

}
