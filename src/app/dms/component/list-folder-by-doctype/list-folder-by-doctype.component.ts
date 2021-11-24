import { Component, OnInit } from '@angular/core'
import { FolderService } from '../../service/folder.service'
import { DmsFieldService } from '../../service/dmsField.service'
import { Folder } from '../../model/folder.model'
import { DocumentTypeDetailService } from '../../service/documentTypeDetail.service'
import { TdLoadingService } from '@covalent/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { DmsField } from '../../model/dmsField.model';
import { Menu } from '../../model/menu.model'
import { IMyOptions } from 'mydatepicker'
import { Location } from '@angular/common'

@Component({
  selector: 'app-list-folder-by-doctype',
  templateUrl: './list-folder-by-doctype.component.html',
  styleUrls: ['./list-folder-by-doctype.component.styl'],
  providers: [FolderService, DmsFieldService, DocumentTypeDetailService]
})
export class ListFolderByDoctypeComponent implements OnInit {
  parentId: number
  folderId: number
  folders: Folder[] = []
  a: number;
  parentType: string = 'A'
  documentTypeId: number
  dmsHeaderName: string = 'ระบบจัดเก็บเอกสารฯ'
  menus: Menu[] = []
  search: any[] = []
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
  documentIntComma: string = null

  seeButtonCopy: boolean = false
  nowDate: Date
  typeSerach: string = 'normal'

  folderDocType: number = 0
  isWfFolderFromType: String
  isFormListByDocType = 'Y'

  allField: string
  fullText: string
  attachName: string

  typeSearchInput: string = 'a'

  typeSearchInputData: any[] = [
    { id: 1, name: 'เอกสารปกติ', val: 'a' }, { id: 2, name: 'เอกสารหมดอายุ', val: 'b' }
  ]

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


  constructor(
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _documentTypeDetailService: DocumentTypeDetailService,
  ) {
    this.folderId = 0
    this.parentId = 0
    this.documentTypeId = 2
    this.isWfFolderFromType = 'N'
    this.isFormListByDocType = 'Y'
  }

  ngOnInit() {
    this._route.params
      .subscribe((params: Params) => {
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
        if (!isNaN(params['parentId'])) this.parentId = +params['parentId']
        if (!isNaN(params['folderId'])) this.folderId = +params['folderId']
        if (!isNaN(params['documentTypeId'])) this.documentTypeId = +params['documentTypeId']
        if (params['isWfFolderFromType'] !== undefined) this.isWfFolderFromType = params['isWfFolderFromType']
        this.getParam()
        this.getDocumentTypeDetail(this.documentTypeId)
      })
  }

  getFolders(): void {
    if (this.parentId == 0) {
      this._loadingService.register('main')
      this._folderService
        .ConverseDocTypeToFolder()
        .subscribe(response => {
          this.folders = response as Folder[]
        })
      this._loadingService.resolve('main')
    } else {
      this.folders = []
    }
  }

  selectFolder(selectFolder: Folder) {
    let str = selectFolder.folderName
    str = str.replace('(', "1%#1%#1");
    str = str.replace(')', "2%#2%#2");
    this._router.navigate(
      ['../ListDocByDoctypeComponent/', {
        documentTypeId: selectFolder.documentTypeId,
        folderName: str,
        folderId: this.folderId,
        wfTypeId: 0,
        t: new Date().getTime()
      }],
      { relativeTo: this._route })
  }

  change() {
    this._router.navigate(
      ['../folders/', {
        t: new Date().getTime(),
        parentId: 1,
        folderType: 'A',
      }],
      { relativeTo: this._route })
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
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

  getDocumentTypeDetail(documentTypeId: number): void {//หัว columns
    this._loadingService.register('main')
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
      })

    this._loadingService.resolve('main')
  }

  getParam(): void {
    this._loadingService.register('main')
    this._folderService
      .getParam()
      .subscribe(response => {
        this.getFolders();
        this.folderDocType = +response.data.paramValue
      })
    this._loadingService.resolve('main')
  }


  dmsSearch() {
    let typeSearch = this.typeSearchInput
    this.nowDate = new Date()
    if (this.documentIntComma != null) {
      this.search["documentIntComma"] = this.documentIntComma
    }
    let dataSearch: any = this.search
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
      let day = expForm.date.day
      let month = expForm.date.month
      let dayS = ""
      let monthS = ""
      if (day < 10) { dayS = '0' + day; } else { dayS = String(day) }
      if (month < 10) { monthS = '0' + month; } else { monthS = String(month) }
      // documentExpireDateForm = dayS+'/'+monthS+'/'+expForm.date.year
      documentExpireDateTo = dayS + '/' + monthS + '/' + expForm.date.year
    }

    if (dataSearch.createdDateForm != undefined) { createdDateForm = dataSearch.createdDateForm.formatted }
    if (dataSearch.createdDateTo != undefined) { createdDateTo = dataSearch.createdDateTo.formatted }
    if (dataSearch.updatedDateForm != undefined) { updatedDateForm = dataSearch.updatedDateForm.formatted }
    if (dataSearch.updatedDateTo != undefined) { updatedDateTo = dataSearch.updatedDateTo.formatted }
    if (dataSearch.documentExpireDateForm != undefined) { documentExpireDateForm = dataSearch.documentExpireDateForm.formatted }
    if (dataSearch.documentExpireDateTo != undefined) { documentExpireDateTo = dataSearch.documentExpireDateTo.formatted }
    if (dataSearch.documentDate01Form != undefined) { documentDate01Form = dataSearch.documentDate01Form.formatted }
    if (dataSearch.documentDate01To != undefined) { documentDate01To = dataSearch.documentDate01To.formatted }
    if (dataSearch.documentDate02Form != undefined) { documentDate02Form = dataSearch.documentDate02Form.formatted }
    if (dataSearch.documentDate02To != undefined) { documentDate02To = dataSearch.documentDate02To.formatted }
    if (dataSearch.documentDate03Form != undefined) { documentDate03Form = dataSearch.documentDate03Form.formatted }
    if (dataSearch.documentDate03To != undefined) { documentDate03To = dataSearch.documentDate03To.formatted }
    if (dataSearch.documentDate04Form != undefined) { documentDate04Form = dataSearch.documentDate04Form.formatted }
    if (dataSearch.documentDate04To != undefined) { documentDate04To = dataSearch.documentDate04To.formatted }

    if (dataSearch.documentFloat01 != undefined) { documentFloat01 = dataSearch.documentFloat01 }
    if (dataSearch.documentFloat02 != undefined) { documentFloat02 = dataSearch.documentFloat02 }
    if (dataSearch.documentInt01 != undefined) { documentInt01 = dataSearch.documentInt01 }
    if (dataSearch.documentInt02 != undefined) { documentInt02 = dataSearch.documentInt02 }
    if (dataSearch.documentInt03 != undefined) { documentInt03 = dataSearch.documentInt03 }
    if (dataSearch.documentInt04 != undefined) { documentInt04 = dataSearch.documentInt04 }
    if (dataSearch.documentIntComma != undefined) { documentIntComma = dataSearch.documentIntComma }
    if (dataSearch.documentText01 != undefined) { documentText01 = dataSearch.documentText01 }
    if (dataSearch.documentText02 != undefined) { documentText02 = dataSearch.documentText02 }
    if (dataSearch.documentText03 != undefined) { documentText03 = dataSearch.documentText03 }
    if (dataSearch.documentText04 != undefined) { documentText04 = dataSearch.documentText04 }
    if (dataSearch.documentText05 != undefined) { documentText05 = dataSearch.documentText05 }
    if (dataSearch.documentInt04 != undefined) { documentInt04 = dataSearch.documentInt04 }
    if (dataSearch.documentVarchar01 != undefined) { documentVarchar01 = dataSearch.documentVarchar01 }
    if (dataSearch.documentVarchar02 != undefined) { documentVarchar02 = dataSearch.documentVarchar02 }
    if (dataSearch.documentVarchar03 != undefined) { documentVarchar03 = dataSearch.documentVarchar03 }
    if (dataSearch.documentVarchar04 != undefined) { documentVarchar04 = dataSearch.documentVarchar04 }
    if (dataSearch.documentVarchar05 != undefined) { documentVarchar05 = dataSearch.documentVarchar05 }
    if (dataSearch.documentVarchar06 != undefined) { documentVarchar06 = dataSearch.documentVarchar06 }
    if (dataSearch.documentVarchar07 != undefined) { documentVarchar07 = dataSearch.documentVarchar07 }
    if (dataSearch.documentVarchar08 != undefined) { documentVarchar08 = dataSearch.documentVarchar08 }
    if (dataSearch.documentVarchar09 != undefined) { documentVarchar09 = dataSearch.documentVarchar09 }
    if (dataSearch.documentVarchar10 != undefined) { documentVarchar10 = dataSearch.documentVarchar10 }
    if (dataSearch.updatedBy != undefined) { updatedBy = dataSearch.updatedBy }
    if (dataSearch.createdBy != undefined) { createdBy = dataSearch.createdBy }
    if (dataSearch.documentName != undefined) { documentName = dataSearch.documentName }
    if (this.allField == undefined) { this.allField = '' }
    if (this.fullText == undefined) { this.fullText = '' }
    if (this.attachName == undefined) { this.attachName = '' }

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
