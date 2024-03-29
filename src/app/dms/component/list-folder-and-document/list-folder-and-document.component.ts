import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { URLSearchParams } from '@angular/http'//report
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'
import { DataTable } from 'primeng/primeng'

import { FolderService } from '../../service/folder.service'
import { DmsFieldService } from '../../service/dmsField.service'
import { Folder } from '../../model/folder.model'
import { Menu } from '../../model/menu.model'
import { Document } from '../../model/document.model'
import { DmsField } from '../../model/dmsField.model';
import { DocumentType } from '../../model/documentType.model'
import { DocumentTypeDetailService } from '../../service/documentTypeDetail.service'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { DeleteDialogComponent } from '../../../main/component/delete-dialog/delete-dialog.component';
//doc
import { DialogMoveComponent } from '../dialog-move/dialog-move.component';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table'
// import { Document } from '../../model/document.model'
import { DocumentService } from '../../service/document.service'
import { PxService, } from '../../../main/px.service'
import { MdDialog, MdDialogRef } from '@angular/material';
import { DialogListFolderComponent } from '../dialog-list-folder/dialog-list-folder.component'
import { DialogReportOptionComponent } from '../dialog-report-option/dialog-report-option.component';
import { LevelBar } from '../../model/level-bar.model';
import { ParamDmsService } from '../../service/param-dms.service'
import { Level } from '../../model/level.model';
import { environment } from '../../../../environments/environment'
import { IPageChangeEvent } from '@covalent/paging'

import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { ListReturn } from '../../../main/model/listReturn.model';

const offset: number = 0
const limit: number = 20
@Component({
  selector: 'app-list-folder-and-document',
  templateUrl: './list-folder-and-document.component.html',
  styleUrls: ['./list-folder-and-document.component.styl'],
  providers: [FolderService, DmsFieldService, DocumentTypeDetailService, DocumentService, PxService],

})
export class ListFolderAndDocumentComponent implements OnInit {
  parentId: number
  folders: Folder[] = []
  foldersSearchList: Folder[] = []
  a: number;
  parentType: string = 'A'
  documentTypeId: number = 2
  dmsHeaderName: string = 'ระบบจัดเก็บเอกสารฯ'
  menus: Menu[] = []
  search: any[] = []
  searchFilter: string
  searchLength: number = 0
  pageLength: number = 0
  dmsDocumentType: DocumentType[] = []
  dmsField: DmsField[] = []
  icondmsHeaderName: string = "dashboard"
  listMenu: string = 'menu'
  ModeSearch: boolean = true
  selecArray: Folder[] = []
  stateCopy: boolean = false
  stateMove: boolean = false
  stetaPaste: boolean = false
  stetaCanCopy: boolean = false
  maxFolderTypeSelect: string = 'F'
  docInFolder: boolean = true
  documentTypeDetails: any[] = []
  documentIntComma: number = -1

  allField: string
  fullText: string
  attachName: string

  seeButtonCopy: boolean = false
  nowDate: Date
  typeSerach: string = 'normal'
  cached: boolean = false
  booleanCheckDocInFolder: boolean = false // false = ไม่มีdoc


  folderId: number
  documents: Document[] = []
  dmsfolderName: string
  columns: ITdDataTableColumn[] = []
  top2: string = ''
  nameCreated: string = ''
  nameUpdate: string = ''

  menu: any = []

  authEditFolder: boolean = false
  authAddDoc: boolean = false
  createFolder: boolean = false
  openDoc: boolean = false
  authDelDoc: boolean = false
  authDocRe: boolean = false
  lvBar: LevelBar
  levleBar: string = ''
  disableBack = false

  typeSearchInput: string = 'a'

  folderListReturn = new ListReturn()
  @ViewChild('dt') dt: DataTable
  datas: any[]
  listReturn: ListReturn
  tableFirst: number

  typeSearchInputData: any[] = [
    { id: 1, name: 'เอกสารปกติ', val: 'a' }, { id: 2, name: 'เอกสารหมดอายุ', val: 'b' }
  ]

  widthSize: number

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '1000px',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: false

  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,
    private _dmsFieldService: DmsFieldService,
    private _location: Location,
    private _documentTypeDetailService: DocumentTypeDetailService,
    private _documentService: DocumentService,
    private _dialog: MdDialog,
    private _pxService: PxService,
    private _paramDms: ParamDmsService,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.parentId = 1
    this.disableBack = false
    this.datas = []
    this.listReturn = new ListReturn()
    this.tableFirst = 0
  }

  ngOnInit() {

    this._route.params
      .subscribe((params: Params) => {
        console.log('params', params)
        if (!isNaN(params['parentId'])) this.parentId = +params['parentId']
        if (params['folderType'] !== undefined) this.parentType = params['folderType']
        if (params['folderName'] !== undefined) {
          this.dmsHeaderName = params['folderName']
          let str = this.dmsHeaderName
          str = str.replace('(', "1%#1%#1");
          str = str.replace(')', "2%#2%#2");

          str = str.replace('1%#1%#1', "(");
          str = str.replace('2%#2%#2', ")");

          this.dmsHeaderName = str
        }
        else { this.dmsHeaderName = 'ระบบจัดเก็บเอกสารฯ' }
        if (!isNaN(params['documentTypeId'])) this.documentTypeId = +params['documentTypeId']
        if (this.parentType === 'F') {
          this.icondmsHeaderName = "folder";
        } else if (this.parentType === 'D') {
          this.icondmsHeaderName = "dns"
        } else {
          this.icondmsHeaderName = "dashboard"
        }


        if (!isNaN(params['folderId'])) this.folderId = +params['folderId']

        this.dmsfolderName = params['folderName']
        // this.getFolders(this.parentId)

        // this.getMenus(this.parentType) // getFolders ด้วย
        // this.getDocumentTypes()
        // this.getDmsFields()
        // this.getDocumentTypeDetail(this.documentTypeId)

        this.checkDocInFolder()
        this.authMenu(this.parentId)
        this.disableBack = false


        if (this.parentType == 'D') {
          this.cached = true
        } else {
          this.cached = false
        }

        this.paramUrl()
      })


  }


  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }


  getFolders(parentId: number): void {
    let offset: number = 0
    this._loadingService.register('main')
    this._folderService
      // .getFolders(parentId) // with out auth?
      // .getFoldersWithAuth(parentId)//with auth
      .getFoldersWithAuthlazy(parentId, offset, limit)
      .subscribe(response => {

        let count: number = 0
        let countAll: number = 0
        let next: number = 0
        if (response.data != null) {
          this.folders = response.data as Folder[]
          count = this.folders.length
          countAll = response.countAll
          if (count >= limit) {
            next = offset + limit;
            if (next >= countAll) {
              next = 0;
            }
          }
        } else {
          this.folders = []
        }
        this.folderListReturn = new ListReturn({ all: countAll, count: count, next: next })
        if (this.folders.length > 0 && this.parentType === 'F') {
          this.menus = this.menus.filter(menu => menu.id == 3 || menu.id == 4 || menu.id == 6 || menu.id == 7 || menu.id == 8);

        }
        this._loadingService.resolve('main')
      })
  }



  getDmsFields(): void {
    // this._loadingService.register('main')
    this._dmsFieldService
      .getDmsFields()
      .subscribe(response => {
        this.dmsField = response as DmsField[]
      })
    // this._loadingService.resolve('main')
  }

  getDocumentTypes(): void {
    // this._loadingService.register('main')
    this._folderService
      .getDocumentTypes()
      .subscribe(response => {
        this.dmsDocumentType = response as DocumentType[]
      })
    // this._loadingService.resolve('main')
  }

  hoverEdit: string = ''
  over(value: string) {
    this.hoverEdit = value
  }
  leave() {
    this.hoverEdit = ''
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
  dmsSearch() {
    let typeSearch = this.typeSearchInput
    this.nowDate = new Date()

    let checkHaveDataSearch = false
    if (this.documentIntComma != null) {
      this.search["documentIntComma"] = this.documentIntComma
    }
    let dataSearch: any = this.search
    //  if (this.search[documentName] != undefined){
    //  }
    let createdDateForm = ''
    let createdDateTo = ''
    let updatedDateForm = ''
    let updatedDateTo = ''
    let documentExpireDateForm = ''
    let documentExpireDateTo = ''
    let documentDate01Form = ''
    let documentDate01To = ''
    let documentDate02Form = ''
    let documentDate02To = ''
    let documentDate03Form = ''
    let documentDate03To = ''
    let documentDate04Form = ''
    let documentDate04To = ''

    let documentFloat01 = -1
    let documentFloat02 = -1
    let documentInt01 = -1
    let documentInt02 = -1
    let documentInt03 = -1
    let documentInt04 = -1
    let documentIntComma = -1
    let documentText01 = ''
    let documentText02 = ''
    let documentText03 = ''
    let documentText04 = ''
    let documentText05 = ''
    let documentVarchar01 = ''
    let documentVarchar02 = ''
    let documentVarchar03 = ''
    let documentVarchar04 = ''
    let documentVarchar05 = ''
    let documentVarchar06 = ''
    let documentVarchar07 = ''
    let documentVarchar08 = ''
    let documentVarchar09 = ''
    let documentVarchar10 = ''
    let updatedBy = ''
    let createdBy = ''
    let documentName = ''

    if (typeSearch == 'b') {//เอกสารหมดอายุ
      this.typeSerach = 'expier'
      let expForm = { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } }
      let expTo = { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } }
      let day = expForm.date.day
      let month = expForm.date.month
      let dayS = ""
      let monthS = ""
      if (day < 10) { dayS = '0' + day; } else { dayS = String(day) }
      if (month < 10) { monthS = '0' + month; } else { monthS = String(month) }

      // documentExpireDateForm = dayS+'/'+monthS+'/'+expForm.date.year
      documentExpireDateTo = dayS + '/' + monthS + '/' + expForm.date.year

    }


    if (this.allField == '' && this.fullText == '' && this.attachName == '') {
      checkHaveDataSearch = false
    } else {
      if (this.allField != undefined || this.fullText != undefined || this.attachName != undefined) {
        checkHaveDataSearch = true
      }
    }


    if (dataSearch.createdDateForm != undefined) { createdDateForm = dataSearch.createdDateForm.formatted; checkHaveDataSearch = true; }
    if (dataSearch.createdDateTo != undefined) { createdDateTo = dataSearch.createdDateTo.formatted; checkHaveDataSearch = true; }
    if (dataSearch.updatedDateForm != undefined) { updatedDateForm = dataSearch.updatedDateForm.formatted; checkHaveDataSearch = true; }
    if (dataSearch.updatedDateTo != undefined) { updatedDateTo = dataSearch.updatedDateTo.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentExpireDateForm != undefined) { documentExpireDateForm = dataSearch.documentExpireDateForm.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentExpireDateTo != undefined) { documentExpireDateTo = dataSearch.documentExpireDateTo.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentDate01Form != undefined) { documentDate01Form = dataSearch.documentDate01Form.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentDate01To != undefined) { documentDate01To = dataSearch.documentDate01To.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentDate02Form != undefined) { documentDate02Form = dataSearch.documentDate02Form.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentDate02To != undefined) { documentDate02To = dataSearch.documentDate02To.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentDate03Form != undefined) { documentDate03Form = dataSearch.documentDate03Form.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentDate03To != undefined) { documentDate03To = dataSearch.documentDate03To.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentDate04Form != undefined) { documentDate04Form = dataSearch.documentDate04Form.formatted; checkHaveDataSearch = true; }
    if (dataSearch.documentDate04To != undefined) { documentDate04To = dataSearch.documentDate04To.formatted; checkHaveDataSearch = true; }

    if (dataSearch.documentFloat01 != undefined) { documentFloat01 = dataSearch.documentFloat01; checkHaveDataSearch = true; }
    if (dataSearch.documentFloat02 != undefined) { documentFloat02 = dataSearch.documentFloat02; checkHaveDataSearch = true; }
    if (dataSearch.documentInt01 != undefined) { documentInt01 = dataSearch.documentInt01; checkHaveDataSearch = true; }
    if (dataSearch.documentInt02 != undefined) { documentInt02 = dataSearch.documentInt02; checkHaveDataSearch = true; }
    if (dataSearch.documentInt03 != undefined) { documentInt03 = dataSearch.documentInt03; checkHaveDataSearch = true; }
    if (dataSearch.documentInt04 != undefined) { documentInt04 = dataSearch.documentInt04; checkHaveDataSearch = true; }
    if (dataSearch.documentIntComma != undefined) { documentIntComma = dataSearch.documentIntComma; }
    if (dataSearch.documentText01 != undefined) { documentText01 = dataSearch.documentText01; checkHaveDataSearch = true; }
    if (dataSearch.documentText02 != undefined) { documentText02 = dataSearch.documentText02; checkHaveDataSearch = true; }
    if (dataSearch.documentText03 != undefined) { documentText03 = dataSearch.documentText03; checkHaveDataSearch = true; }
    if (dataSearch.documentText04 != undefined) { documentText04 = dataSearch.documentText04; checkHaveDataSearch = true; }
    if (dataSearch.documentText05 != undefined) { documentText05 = dataSearch.documentText05; checkHaveDataSearch = true; }
    if (dataSearch.documentInt04 != undefined) { documentInt04 = dataSearch.documentInt04; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar01 != undefined) { documentVarchar01 = dataSearch.documentVarchar01; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar02 != undefined) { documentVarchar02 = dataSearch.documentVarchar02; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar03 != undefined) { documentVarchar03 = dataSearch.documentVarchar03; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar04 != undefined) { documentVarchar04 = dataSearch.documentVarchar04; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar05 != undefined) { documentVarchar05 = dataSearch.documentVarchar05; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar06 != undefined) { documentVarchar06 = dataSearch.documentVarchar06; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar07 != undefined) { documentVarchar07 = dataSearch.documentVarchar07; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar08 != undefined) { documentVarchar08 = dataSearch.documentVarchar08; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar09 != undefined) { documentVarchar09 = dataSearch.documentVarchar09; checkHaveDataSearch = true; }
    if (dataSearch.documentVarchar10 != undefined) { documentVarchar10 = dataSearch.documentVarchar10; checkHaveDataSearch = true; }
    if (dataSearch.updatedBy != undefined) { updatedBy = dataSearch.updatedBy; checkHaveDataSearch = true; }
    if (dataSearch.createdBy != undefined) { createdBy = dataSearch.createdBy; checkHaveDataSearch = true; }
    if (dataSearch.documentName != undefined) { documentName = dataSearch.documentName; checkHaveDataSearch = true; }

    if (this.allField == undefined) { this.allField = '' }
    if (this.fullText == undefined) { this.fullText = '' }
    if (this.attachName == undefined) { this.attachName = '' }

    if (checkHaveDataSearch) {

      //oat-add
      this._paramSarabanService.datas = [this.datas]
      this._paramSarabanService.listReturn = [new ListReturn(this.listReturn)]
      this.tableFirst = this.dt.first
      this._paramSarabanService.tableFirst = [this.tableFirst]
      this._paramSarabanService.dmsFolderId = this.parentId
      this._paramSarabanService.dmsFlagCheck = this.flagCheck

      this._router.navigate(
        [{
          outlets: {
            contentCenter: ['searchFolder', { //ViewDocumentComponent
              folderId: this.parentId,
              documentTypeId: this.documentTypeId,
              folderName: this.dmsHeaderName,
              t: new Date().getTime(),
              typeSerach: this.typeSerach,
              dataSearch: this.search,
              documentName: documentName,

              createdDateForm: createdDateForm,
              createdDateTo: createdDateTo,

              createdBy: createdBy,
              updatedDateForm: updatedDateForm,
              updatedDateTo: updatedDateTo,

              updatedBy: updatedBy,

              documentExpireDateForm: documentExpireDateForm,
              documentExpireDateTo: documentExpireDateTo,
              documentDate01Form: documentDate01Form,
              documentDate01To: documentDate01To,
              documentDate02Form: documentDate02Form,
              documentDate02To: documentDate02To,
              documentDate03Form: documentDate03Form,
              documentDate03To: documentDate03To,
              documentDate04Form: documentDate04Form,
              documentDate04To: documentDate04To,

              documentFloat01: documentFloat01,
              documentFloat02: documentFloat02,
              documentInt01: documentInt01,
              documentInt02: documentInt02,
              documentInt03: documentInt03,
              documentInt04: documentInt04,
              documentText01: documentText01,
              documentText02: documentText02,
              documentText03: documentText03,
              documentText04: documentText04,
              documentText05: documentText05,
              documentVarchar01: documentVarchar01,
              documentVarchar02: documentVarchar02,
              documentVarchar03: documentVarchar03,
              documentVarchar04: documentVarchar04,
              documentVarchar05: documentVarchar05,
              documentVarchar06: documentVarchar06,
              documentVarchar07: documentVarchar07,
              documentVarchar08: documentVarchar08,
              documentVarchar09: documentVarchar09,
              documentVarchar10: documentVarchar10,

              documentIntComma: documentIntComma,

              allField: this.allField,
              fullText: this.fullText,
              fileAttachName: this.attachName,






            }],
          }
        }], { relativeTo: this._route })
    }
  }

  selectFolder(selectFolder: Folder) {
    let str = selectFolder.folderName
    str = str.replace('(', "1%#1%#1");
    str = str.replace(')', "2%#2%#2");

    this._router.navigate(
      ['.', {
        'parentId': selectFolder.id,
        'folderType': selectFolder.folderType,
        'folderName': str,
        'documentTypeId': selectFolder.documentTypeId,
        t: new Date().getTime()
      }],
      { relativeTo: this._route })
  }

  getMenus(parentType: string): void {
    //  this._loadingService.register('main')
    this._folderService
      .getMenus(parentType)
      .subscribe(response => {
        this.menus = response as Menu[]

        this.getFolders(this.parentId)

      })
    // this._loadingService.resolve('main')
  }

  add(menuSelected: Menu) {

    if (menuSelected.type === 'DOC') {
      this._folderService
        .getFolder(this.parentId)
        .subscribe(response => {

          this._router.navigate(
            [{
              outlets: {
                contentCenter: ['createDoc', {
                  folderId: this.parentId,
                  folderTypeExpire: response.folderTypeExpire,
                  folderTypeExpireNumber: response.folderTypeExpireNumber,
                  documentTypeId: this.documentTypeId,
                  t: new Date().getTime()
                }],
              }
            }], { relativeTo: this._route })
        })
    } else {
      if (menuSelected.nameEng === 'copy') {
        if (this.selecArray.length != 0) {
          this.stateCopy = true;
          this.stetaPaste = true;
        }

      } else {
        if (menuSelected.nameEng === 'searchExp') {

          this._router.navigate(
            [{
              outlets: {
                contentCenter: ['ListDocExpComponent', {
                  parentId: this.parentId,
                  menuName: menuSelected.name,
                  menuType: menuSelected.type,
                  documentTypeId: this.documentTypeId,
                  t: new Date().getTime()
                }],
              }
            }], { relativeTo: this._route })

        } else {
          this._router.navigate(
            [{
              outlets: {
                contentCenter: ['add', {
                  parentId: this.parentId,
                  menuName: menuSelected.name,
                  menuType: menuSelected.type,
                  documentTypeId: this.documentTypeId,
                  t: new Date().getTime()
                }],
              }
            }], { relativeTo: this._route })
        }
      }
    }
  }

  searchExp() {
    //oat-add
    this._paramSarabanService.datas = [this.datas]
    this._paramSarabanService.listReturn = [new ListReturn(this.listReturn)]
    this.tableFirst = this.dt.first
    this._paramSarabanService.tableFirst = [this.tableFirst]
    this._paramSarabanService.dmsFolderId = this.parentId
    this._paramSarabanService.dmsFlagCheck = this.flagCheck

    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['ListDocExpComponent', {
            parentId: this.parentId,
            documentTypeId: this.documentTypeId,
            t: new Date().getTime()
          }],
        }
      }], { relativeTo: this._route })

  }

  edit(folder: Folder) {
    this._router.navigate(
      ['../folders/' + folder.id, {
        folderId: folder.id,
        // menuType: menuSelected.type,
        t: new Date().getTime()
      }],
      { relativeTo: this._route })
  }


  auth(folder: Folder) {
    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['auth', {
            parentId: folder.id,
            name: folder.folderName,
            t: new Date().getTime()
          }],
        }
      }], { relativeTo: this._route })
  }

  delete() { }

  tempArray2: Folder[] = []
  selectOther(otherFolder: Folder) {
    this.seeButtonCopy = true

    if (otherFolder.icon == 'done') {
      if (otherFolder.folderType == 'C') {
        otherFolder.icon = 'dashboard'
        otherFolder.iconColor = '#f93550'
      } else if (otherFolder.folderType == 'D') {
        otherFolder.icon = 'dns'
        otherFolder.iconColor = '#4ee832'
      } else if (otherFolder.folderType == 'F') {
        otherFolder.icon = 'folder'
        otherFolder.iconColor = '#e6b800'
      }

      for (let i in this.selecArray) {
        if (this.selecArray[i].id == otherFolder.id) {
          this.selecArray.splice(Number(i), 1)
        }
        if (this.selecArray.length == 0) {
          this.seeButtonCopy = false
          this.stateCopy = false;
          this.stetaPaste = false;
          this.maxFolderTypeSelect = 'F'
        }



      }

    } else {
      let tempArray = new Folder
      tempArray.folderDescription = otherFolder.folderDescription
      tempArray.folderName = otherFolder.folderName
      tempArray.folderNodeLevel = otherFolder.folderNodeLevel
      tempArray.folderParentType = otherFolder.folderParentType
      tempArray.icon = otherFolder.icon
      tempArray.iconColor = otherFolder.iconColor
      tempArray.folderType = otherFolder.folderType
      tempArray.id = otherFolder.id


      this.selecArray.push(tempArray);
      this.tempArray2.push(otherFolder);

      otherFolder.icon = 'done'
      otherFolder.iconColor = '#0d47a1'




    }


  }


  goBack() {
    this.disableBack = true
    this._location.back()
  }
  cancelCopyMove() {
    this.stateCopy = false;
    this.stetaPaste = false;
    this.stateMove = false
    this.seeButtonCopy = false



    for (let i of this.folders) {
      if (i.icon == 'done') {
        if (i.folderType == 'C') {
          i.icon = 'dashboard'
          i.iconColor = '#f93550'
        } else if (i.folderType == 'D') {
          i.icon = 'dns'
          i.iconColor = '#4ee832'
        } else if (i.folderType == 'F') {
          i.icon = 'folder'
          i.iconColor = '#e6b800'
        }
      }
    }


    this.selecArray = []
    this.tempArray2 = []
  }

  paste() {

    let maxFolderType = 'F'

    for (let selec of this.selecArray) {

      if (selec.folderType == 'C') maxFolderType = 'C'
      if (selec.folderType == 'D' && maxFolderType == 'F') maxFolderType = 'D'


      if (this.parentType == 'A') this.stetaCanCopy = true


      if (this.parentType == 'C' && this.maxFolderTypeSelect == 'D') this.stetaCanCopy = true
      if (this.parentType == 'C' && this.maxFolderTypeSelect == 'F') this.stetaCanCopy = true
      if (this.parentType == 'D' && this.maxFolderTypeSelect == 'F') this.stetaCanCopy = true
      if (this.parentType == 'F' && this.maxFolderTypeSelect == 'F') this.stetaCanCopy = true
    }
    if (this.stetaCanCopy) {

      for (let selec of this.selecArray) {
        if (selec.folderType == 'C') {
          selec.icon = 'dashboard'
          selec.iconColor = '#f93550'
          maxFolderType = 'C'
        } else if (selec.folderType == 'D') {
          selec.icon = 'dns'
          selec.iconColor = '#4ee832'
          if (maxFolderType == 'F') maxFolderType = 'D'
        } else if (selec.folderType == 'F') {
          selec.icon = 'folder'
          selec.iconColor = '#e6b800'
        }


        if (this.stateCopy) {

          this._folderService
            .copyFolder(selec, this.parentId)
            .subscribe(response => {
              this.a = response as number
            })
        } else {
          if (selec.id != this.parentId) {
            this._folderService
              .moveFolder(selec, this.parentId)
              .subscribe(response => {
                this.a = response as number
              })
          }
        }




      }


      this.stetaCanCopy = false
      this.stateCopy = false
      this.stetaPaste = false
      this.stateMove = false
      //แก้ที่ติกให้ไม่ติก
      for (let selec of this.tempArray2) {
        if (selec.folderType == 'C') {
          selec.icon = 'dashboard'
          selec.iconColor = '#f93550'
        } else if (selec.folderType == 'D') {
          selec.icon = 'dns'
          selec.iconColor = '#4ee832'
        } else if (selec.folderType == 'F') {
          selec.icon = 'folder'
          selec.iconColor = '#e6b800'
        }

      }
      this.selecArray = []
      this._location.back()
    } else {
      this.selecArray = []
      this.stetaPaste = false
      this.stateMove = false
      maxFolderType = 'F'

    }
  }

  copy() {
    //  this.maxFolderTypeSelect = 'F'
    if (this.selecArray.length != 0) {
      this.maxFolderTypeSelect = 'F'

      for (let selec of this.selecArray) {

        if (this.maxFolderTypeSelect == 'F') {
          if (selec.folderType == 'C') this.maxFolderTypeSelect = 'C'
          if (selec.folderType == 'D') this.maxFolderTypeSelect = 'D'
        }
        if (this.maxFolderTypeSelect == 'D') {
          if (selec.folderType == 'C') this.maxFolderTypeSelect = 'C'

        }
        if (selec.folderType == 'C') this.maxFolderTypeSelect = 'C'

      }
      this.stateCopy = true;
      this.stetaPaste = true;
    }

  }

  move() {
    if (this.selecArray.length != 0) {
      this.maxFolderTypeSelect = 'F'
      this.stateMove = true;
      // this.stetaPaste = true;

      for (let selec of this.selecArray) {

        if (this.maxFolderTypeSelect == 'F') {
          if (selec.folderType == 'C') this.maxFolderTypeSelect = 'C'
          if (selec.folderType == 'D') this.maxFolderTypeSelect = 'D'
        }
        if (this.maxFolderTypeSelect == 'D') {
          if (selec.folderType == 'C') this.maxFolderTypeSelect = 'C'

        }
        if (selec.folderType == 'C') this.maxFolderTypeSelect = 'C'

      }

    }
  }

  reOrder() {
    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['reOrder', {
            parentId: this.parentId,
            t: new Date().getTime()
          }],
        }
      }], { relativeTo: this._route })
  }

  getDocumentTypeDetail(documentTypeId: number): void {//หัว columns
    // this._loadingService.register('main')
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        // for (let dtd of this.documentTypeDetails) {
        // if(dtd.dmsFieldMap == 'createdBy'){
        //    this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
        // }
        // this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
        // }
      })

    // this._loadingService.resolve('main')
  }

  onDateChanged(event: any) {
  }

  //--- pipe
  birthday = new Date(1988, 3, 15); // April 15, 1988
  toggle = true; // start with true == shortDate


  testemail() {
    // this._loadingService.register('main')
    this._folderService
      .testemail()
      .subscribe(response => {

      })
    // this._loadingService.resolve('main')
  }

  checkDocInFolder() {
    this._folderService
      .checkDocumentsInFolderByFolderId(this.parentId)
      .subscribe(response => {
        if (this.parentType === 'F' && response) {
          this.stateCopy = false;
          this.stetaPaste = false;
          this.stateMove = false
          this.seeButtonCopy = false

          this.booleanCheckDocInFolder = true
          this.getDocuments(this.parentId)//this.folderId
          this.getDocumentTypeDetailDoc(this.documentTypeId)
          this.getDmsFields()


        } else {
          this.booleanCheckDocInFolder = false
          this.getMenus(this.parentType)
          this.getDocumentTypes()
          this.getDmsFields()
          this.getDocumentTypeDetail(this.documentTypeId)

          //oat-add
          this._paramSarabanService.datas = null
          this._paramSarabanService.listReturn = null
          this._paramSarabanService.tableFirst = null
          this._paramSarabanService.dmsFolderId = null
          this._paramSarabanService.dmsFlagCheck = null
        }

      })

  }

  ///// document




  getDocuments(folderId: number): void {
    this.datas = []

    //oat-add
    let tmpFolderId: number = (this._paramSarabanService.dmsFolderId) ? this._paramSarabanService.dmsFolderId : 0
    if (folderId == tmpFolderId && this._paramSarabanService.datas) {
      this.datas = this._paramSarabanService.datas[0] as Document[]
      this.allData = this._paramSarabanService.datas[0] as Document[]
      this.listReturn = this._paramSarabanService.listReturn[0]
      this.tableFirst = this._paramSarabanService.tableFirst[0]
      this.flagCheck = this._paramSarabanService.dmsFlagCheck
    } else {
      this._documentService
        .getDocuments(folderId, offset, limit)
        .subscribe(response => {
          this.datas = response.data as Document[]
          this.allData = response.data as Document[]
          this.listReturn = response.listReturn

          for (let i = 0; i < this.allData.length; i++) {
            this.flagCheck[i] = false
          }
        })
    }

  }



  addDocument() {

    let tempFoler = this.folders.filter(folder => folder.id == this.parentId)

    this._folderService
      .getFolder(this.parentId)
      .subscribe(response => {
        this._router.navigate(
          ['../createDoc/', {
            t: new Date().getTime(),
            folderId: this.parentId,
            documentTypeId: this.documentTypeId,
            folderTypeExpire: response.folderTypeExpire,
            folderTypeExpireNumber: response.folderTypeExpireNumber

          }],
          { relativeTo: this._route })
      })
  }

  selectDocument(selectDoc: Document) {
    //oat-add
    this._paramSarabanService.datas = [this.datas]
    this._paramSarabanService.listReturn = [new ListReturn(this.listReturn)]
    this.tableFirst = this.dt.first
    this._paramSarabanService.tableFirst = [this.tableFirst]
    this._paramSarabanService.dmsFolderId = this.parentId
    this._paramSarabanService.dmsFlagCheck = this.flagCheck

    if (this.openDoc) {
      this._router.navigate(
        ['../createDoc/', {
          documentId: selectDoc.id,
          folderId: selectDoc.documentFolderId,
          documentTypeId: this.documentTypeId,
          t: new Date().getTime()

        }],
        { relativeTo: this._route })



    }



  }


  get format() { return this.toggle ? 'shortDate' : 'fullDate'; }
  toggleFormat() { this.toggle = !this.toggle; }


  removeCommas() {

    // if (this.documentIntComma != null) {

    //   this.documentIntComma = this.documentIntComma.replace(/,/g, "");

    // }
  }

  addCommas() {

    // this.documentIntComma = this.documentIntComma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    // this.documentIntComma = this.documentIntComma


  }



  changeIdUserToName(userId: string): string {

    userId = '1'
    let a = ''
    if (userId !== '0') {
      this._documentService
        .getUserprofile(userId)
        .subscribe(response => {
          a = response.fullName


          a = 'aaaaaa'
          return a

        })
    }

    return a

  }


  change() {
    this._router.navigate(
      ['../ListFolderByDoctypeComponent/', {
        t: new Date().getTime(),
        folderId: this.parentId,
        parentId: 0,
        folderName: this.dmsfolderName,

      }],
      { relativeTo: this._route })



  }

  getDocumentTypeDetailDoc(documentTypeId: number): void {//หัว columns
    this.columns = []
    // this._loadingService.register('main')
    this.columns.push({ name: 'count', label: 'ลำดับ', })
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        for (let dtd of this.documentTypeDetails) {
          // if(dtd.dmsFieldMap == 'createdBy'){
          //    this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
          // }
          this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
        }
        this.widthSize = this.columns.length * 250
        this.columns.push({ name: 'borrowStatus', label: 'ยืม-คืน', })
      })

    // this._loadingService.resolve('main')
  }

  openDialog(deleteFolder: Folder): void {
    let dialogRef = this._dialog.open(DeleteDialogComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._folderService
          .deleteFolder(deleteFolder)
          .subscribe(response => {
            this.checkDocInFolder()


          })
      }
    });
  }

  buttonAuth(data: any) {
    if (data.selec == 'edit') {
      this.edit(data.Folder)
    }
    if (data.selec == 'auth') {
      this.auth(data.Folder)
    }

    if (data.selec == 'del') {
      this.openDialog(data.Folder)
    }
  }

  authMenu(folderId: number) {
    this._folderService
      .getMenu(folderId)
      .subscribe(response => {

        this.authEditFolder = false
        this.authAddDoc = false
        this.createFolder = false
        this.openDoc = false
        this.authDelDoc = false
        this.authDocRe = false

        for (let i of response.data) {
          if (i.menuFunction == 'editFolder') {
            this.authEditFolder = true
          }
          if (i.menuFunction == 'creDoc') {
            this.authAddDoc = true
          }

          if (i.menuFunction == 'createFolder') {
            this.createFolder = true
          }

          if (i.menuFunction == 'openDoc') {
            this.openDoc = true
          }

          if (i.menuFunction == 'delDoc') {
            this.authDelDoc = true
          }

          if (i.menuFunction == 'docRe') {
            this.authDocRe = true
          }
        }

        //oat-add
        if (this._paramSarabanService.isArchive) {
          this.authEditFolder = false
          this.authAddDoc = false
          this.createFolder = false
          this.authDelDoc = false
        }

        if (!this.createFolder) {
          //not auth
          this.menus = this.menus.filter(menu => menu.id != 1 && menu.id != 2 && menu.id != 3);
        }
        if (!this.authAddDoc) {
          //not auth
          this.menus = this.menus.filter(menu => menu.id != 5);
        }


      })

  }

  searchRole(): void {



  }

  onEnter(value: string) {
    this.typeSearchInput = 'a'
    this.dmsSearch()
  }

  checkBox: boolean = false
  checkBoxAll: Boolean = false
  flagCheck: Boolean[] = []
  flagCheckOld: Boolean[] = []
  allData: Document[] = []

  clickSave(index: number, checkbox: any) {
    this.checkBox = true
    this.flagCheck[index] = checkbox.checked
    this.checkBox = false
    for (let entry of this.flagCheck) {
      if (entry) {
        this.checkBox = true
        break
      }
    }

  }

  checkAll(any: number, event: any) {
    this.checkBoxAll = event.checked
    this.checkBox = event.checked
    for (let i = 0; i < this.flagCheck.length; i++) {
      this.flagCheck[i] = event.checked
    }
    this.checkBox = false
    for (let entry of this.flagCheck) {
      if (entry) {
        this.checkBox = true
        break
      }
    }


  }

  getDataForSave(): String {
    // this.flagCheck คือ colume
    let dataSave: Document[] = []
    let listDocId = ''
    for (let i = 0; i < this.flagCheck.length; i++) {
      if (this.flagCheck[i]) {
        if (listDocId.length == 0) {
          listDocId = listDocId + this.allData[i].id
        } else {
          listDocId = listDocId + ',' + this.allData[i].id
        }
        dataSave[dataSave.length] = this.allData[i];
      }
    }
    return listDocId;
  }

  listFolderTree() {
    let listDocId = this.getDataForSave()
    let dialogRef = this._dialog.open(DialogListFolderComponent, {
      width: '50%',
    })
    let instance = dialogRef.componentInstance
    instance.FolderId = this.parentId
    let folderId = 0
    dialogRef.afterClosed().subscribe(result => {
      folderId = result.id


      let dialogRef = this._dialog.open(DialogMoveComponent, {

      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {

          this._loadingService.register('main')
          this._documentService
            .moveDocument(listDocId, folderId)
            .subscribe(response => {
              this.checkBox = false
              this.getDocuments(this.parentId)

              this._loadingService.resolve('main')
            })
        }
      });


    });
  }

  showBorrowHistoryList() {
    this._router.navigate(
      ['../listBorrowAll/', {
      }],
      { relativeTo: this._route })
  }

  docBorrow(selectDoc: Document) {
    //oat-add
    this._paramSarabanService.datas = [this.datas]
    this._paramSarabanService.listReturn = [new ListReturn(this.listReturn)]
    this.tableFirst = this.dt.first
    this._paramSarabanService.tableFirst = [this.tableFirst]
    this._paramSarabanService.dmsFolderId = this.parentId
    this._paramSarabanService.dmsFlagCheck = this.flagCheck

    this._router.navigate(
      ['../borrow/', {
        documentId: selectDoc.id,
        documentName: selectDoc.documentName
        // folderId: selectDoc.documentFolderId,
        // documentTypeId: this.documentTypeId
      }],
      { relativeTo: this._route })
  }

  borrow() {
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['borrow', {
            folderId: this.folderId,
            documentTypeId: this.documentTypeId,
            t: new Date().getTime()
          }],
        }
      }], { relativeTo: this._route })
  }

  delDocSelec() {
    let listDocId = this.getDataForSave().split(",");

    let dialogRef = this._dialog.open(DeleteDialogComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let deleteDocument = new Document
        for (let entry of listDocId) {
          deleteDocument.id = +entry
          this._documentService
            .deleteDocument(deleteDocument)
            .subscribe(response => {
            })
        }

        this.checkDocInFolder()
      }
    });

  }

  report() {
    let dialogRef = this._dialog.open(DialogReportOptionComponent, {

    });
    dialogRef.componentInstance.docTypeId = this.documentTypeId
    dialogRef.componentInstance.folderId = this.parentId
    dialogRef.afterClosed().subscribe(result => { //id 1 ทั้งหมด 2 หมดอายุ
      if (result != undefined) {
        let params = new URLSearchParams()
        if (result.length > 0) {
          if (result[0].id == 1) {

            params.set('folderId', '' + this.parentId)
            this._pxService.report('report01_nha', 'pdf', params)
          }
          if (result[0].id == 2) {
            params.set('folderId', '' + this.parentId)
            this._pxService.report('report02_nha', 'pdf', params)

          }
        }
      }

    });

  }

  paramUrl() {
    let tempLevelBar = this._paramDms.getLevelBar()
    let tempLevel = new Level()

    let currentUrl = this._router.url;
    tempLevel.levelName = this.dmsHeaderName
    tempLevel.levelUrl = environment.url + currentUrl
    tempLevelBar.newLevel = tempLevel

    this._folderService.levelBar(tempLevelBar).subscribe(response => {
      this._paramDms.setLevelBar(response.data)
      let a = response.data.listLevelName
      this.lvBar = response.data.listLevel
      this.levleBar = ''
      for (let temp of a) {
        if (this.levleBar == '') { this.levleBar = temp } else {
          this.levleBar = this.levleBar + ' / ' + temp

        }
      }
    })

  }

  lvBarBack(data: any) {
    window.location.href = data.levelUrl;
  }

  // fromRow: number
  // projectAll: number = 1000
  // currentPage: number
  // pageSize: number
  // dataPageIng: any = {
  //   offset: 0,
  //   limit: 25
  // }
  // page(pagingEvent: IPageChangeEvent): void {
  //   this.fromRow = pagingEvent.fromRow
  //   this.currentPage = pagingEvent.page
  //   this.pageSize = pagingEvent.pageSize
  //   this.dataPageIng = {
  //     offset: pagingEvent.fromRow,
  //     limit: pagingEvent.toRow
  //   }

  //   this._loadingService.register('main')
  //   this._folderService
  //     .getFoldersWithAuthlazy(this.parentId, pagingEvent.fromRow - 1, this.pageSize)
  //     .subscribe(response => {
  //       this.folders = response as Folder[]
  //       this._loadingService.resolve('main')
  //     })
  // }

  loadFolder() {
    let offset: number = this.folders.length
    this._loadingService.register('main')
    this._folderService
      .getFoldersWithAuthlazy(this.parentId, offset, limit)
      .subscribe(response => {
        let count: number = 0
        let countAll: number = 0
        let next: number = 0
        if (response.data != null) {
          this.folders = this.folders.concat(response.data)
          count = this.folders.length
          countAll = response.countAll
          if (count >= limit) {
            next = offset + limit;
            if (next >= countAll) {
              next = 0;
            }
          }
        } else {
          
        }
        this.folderListReturn = new ListReturn({ all: response.countAll, count: count, next: next })
        this._loadingService.resolve('main')
      })
  }

  loadMoreContents() {
    this.allCheck = false
    this._documentService
      .getDocuments(this.parentId, this.listReturn.count, limit)
      .subscribe(response => {
        // this.datas = response.data as Document[]
        // this.allData = response.data as Document[]
        this.listReturn = response.listReturn

        this.datas = this.datas.concat(response.data)
        this.allData = this.allData.concat(response.data)

        for (let i = 0; i < this.allData.length; i++) {
          this.flagCheck[i] = false
        }
      })


  }
  allCheck: any
  checkAll2(event: any) {
    for (let i = 0; i < this.flagCheck.length; i++) {
      this.flagCheck[i] = event.checked
    }
    this.checkBox = false
    for (let entry of this.flagCheck) {

      if (entry) {
        this.checkBox = true
        break
      }
    }

  }
  select(index, data, boolean) {

    this.flagCheck[index] = boolean.checked
    this.checkBox = false
    for (let entry of this.flagCheck) {

      if (entry) {
        this.checkBox = true
        break
      }
    }

  }





}
