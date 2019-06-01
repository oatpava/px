import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'

import { FolderService } from '../../service/folder.service'
import { DmsFieldService } from '../../service/dmsField.service'
import { Folder } from '../../model/folder.model'
import { Menu } from '../../model/menu.model'
import { Document } from '../../model/document.model'
import { DmsField } from '../../model/dmsField.model';
import { DocumentType } from '../../model/documentType.model'
import { DocumentTypeDetailService } from '../../service/documentTypeDetail.service'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { PxService } from '../../../main/px.service'
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table'

@Component({
  selector: 'app-list-folder-and-doc',
  templateUrl: './list-folder-and-doc.component.html',
  styleUrls: ['./list-folder-and-doc.component.styl'],
  providers: [FolderService, DmsFieldService, DocumentTypeDetailService],
})
export class ListFolderAndDocComponent implements OnInit {
  parentId: number
  folders: Folder[] = []
  a: number;
  parentType: string = 'A'
  documentTypeId: number = 2
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
  cached:boolean = false

  haveDoc:boolean = false

   datas: any[] = []
   columns: ITdDataTableColumn[] = []


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
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,
    private _dmsFieldService: DmsFieldService,
    private _location: Location,
    private _documentTypeDetailService: DocumentTypeDetailService,
    private pxService: PxService,
  ) {
    this.parentId = 1

  }

  ngOnInit() {
    console.log('---ListFolderComponent---')
    this._route.params
      .subscribe((params: Params) => {
        // console.log('ListFolderComponent ngOnInit this.parentId = '+this.parentId)
        if (!isNaN(params['parentId'])) this.parentId = +params['parentId']
        if (params['folderType'] !== undefined) this.parentType = params['folderType']
        if (params['folderName'] !== undefined) { this.dmsHeaderName = params['folderName'] }
        else { this.dmsHeaderName = 'ระบบจัดเก็บเอกสารฯ' }
        // console.log('ListFolderComponent ngOnInit this.parentId = '+this.parentId)
        if (!isNaN(params['documentTypeId'])) this.documentTypeId = +params['documentTypeId']
        if (this.parentType === 'F') {
          this.icondmsHeaderName = "folder";
        } else if (this.parentType === 'D') {
          this.icondmsHeaderName = "dns"
        } else {
          this.icondmsHeaderName = "dashboard"
        }
        // this.getFolders(this.parentId)
        this.getMenus(this.parentType)
        this.getDocumentTypes()
        this.getDmsFields()
        this.getDocumentTypeDetail(this.documentTypeId)
        if(this.parentType  == 'D'){
          this.cached = true
        }else{
          this.cached = false
        }
        // console.log('this.cached',this.cached)
      })
    // console.log(this.parentType)
  }


  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }


  getFolders(parentId: number): void {
    console.log('-- getFolders ---')
      // console.log('-- his.parentType  ---',this.parentType )
    this._loadingService.register('main')
    this._folderService
      // .ConverseDocTypeToFolder()
      .getFolders2(parentId)
      .subscribe(response => {
        console.log(response)
        // this.pxService.verifyResponseArray(response.json().data)
        // response as Folder[]
        this.folders = response.folder
         this.datas = response.document
         console.log('--his.datas-- ',this.datas.length)
         if(this.datas.length == 0){
           this.haveDoc = false
         }else{
            this.haveDoc = true
         }
        if (this.folders.length > 0 && this.parentType === 'F') {
          // this.menus.
          // console.log('------------')
          
          this.menus = this.menus.filter(menu => menu.id == 3 || menu.id == 4||menu.id == 6||menu.id == 7||menu.id == 8);
          
        }
      })
    this._loadingService.resolve('main')
  }

  getDmsFields(): void {
    this._loadingService.register('main')
    this._dmsFieldService
      .getDmsFields()
      .subscribe(response => {
        this.dmsField = response as DmsField[]
      })
    this._loadingService.resolve('main')
  }

  getDocumentTypes(): void {
    this._loadingService.register('main')
    this._folderService
      .getDocumentTypes()
      .subscribe(response => {
        this.dmsDocumentType = response as DocumentType[]
      })
    this._loadingService.resolve('main')
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
  dmsSearch(typeSearch: string) {
    this.nowDate = new Date()

    // console.log(typeSearch)

    // console.log("this.documentIntComma = " + this.documentIntComma)
    if (this.documentIntComma != null) {
      this.search["documentIntComma"] = this.documentIntComma
    }

    // console.log(this.search);
    // console.log(this.parentId)
    // console.log(this.documentTypeId)

    // console.log(this.search)
    let dataSearch: any = this.search
    //  if (this.search[documentName] != undefined){
    //  console.log(dataSearch.createdDateForm.formatted)
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

    let documentFloat01 = ''
    let documentFloat02 = ''
    let documentInt01 = ''
    let documentInt02 = ''
    let documentInt03 = ''
    let documentInt04 = ''
    let documentIntComma = ''
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

      // console.log(documentExpireDateForm)
      // console.log(documentExpireDateTo)

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



    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['searchFolder', {
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





          }],
        }
      }], { relativeTo: this._route })

  }
  selectFolder(selectFolder: Folder) {

    this._folderService
      .checkDocumentsInFolderByFolderId(selectFolder.id)
      .subscribe(response => {
        // let documents: Document[] = response as Document[]
        let result = response as boolean
        this.docInFolder = result
        // console.log('check has doc : ' + result)
        if (selectFolder.folderType === 'F' && result) {
          console.log('-- list doc --')
          this._router.navigate(
            ['.', {
              outlets: {
                contentCenter: ['documents', {
                  folderId: selectFolder.id,
                  documentTypeId: selectFolder.documentTypeId,
                  folderName: selectFolder.folderName,
                  t: new Date().getTime()
                }],
              }
            }],
            { relativeTo: this._route }
          )
        } else {
          // console.log(this._router)

          this._router.navigate(
            ['.', {
              parentId: selectFolder.id,
              folderType: selectFolder.folderType,
              folderName: selectFolder.folderName,
              documentTypeId: selectFolder.documentTypeId,
              t: new Date().getTime()
            }],
            { relativeTo: this._route })
        }
      })
  }

  getMenus(parentType: string): void {
    // console.log('getFolderType parentType = '+parentType)
    this._folderService
      .getMenus(parentType)
      .subscribe(response => {
        this.menus = response as Menu[]
        this.getFolders(this.parentId)
        // console.log(this.menus)
      })

  }

  add(menuSelected: Menu) {
    // console.log(this._router)
    // console.log(menuSelected)
    if (menuSelected.type === 'DOC') {
      this._router.navigate(
        [{
          outlets: {
            contentCenter: ['createDoc', {
              folderId: this.parentId,
              documentTypeId: this.documentTypeId,
              t: new Date().getTime()
            }],
          }
        }], { relativeTo: this._route })
    } else {
      if (menuSelected.nameEng === 'copy') {
        // console.log('--- copy ---')
        if (this.selecArray.length != 0) {
          this.stateCopy = true;
          this.stetaPaste = true;
        }

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
    // console.log('--- auth ---')
    // console.log(folder)
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
        // console.log(" ----b = " + this.selecArray.length)
        if (this.selecArray.length == 0) {
          this.seeButtonCopy = false
          // console.log('selectOther == 0')
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
    this._location.back()
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


      // console.log("---- stetaCanCopy = " + this.stetaCanCopy)
    }
    if (this.stetaCanCopy) {

      for (let selec of this.selecArray) {
        // console.log('--------')
        // console.log(selec)


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
              // console.log(this.a);
            })
        } else {
          if (selec.id != this.parentId) {
            this._folderService
              .moveFolder(selec, this.parentId)
              .subscribe(response => {
                this.a = response as number
                // console.log(this.a);
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
      console.log('------cant save----- ')
      this.selecArray = []
      this.stetaPaste = false
      this.stateMove = false
      maxFolderType = 'F'

    }
  }

  copy() {
    console.log('----- copy -----')
    //  this.maxFolderTypeSelect = 'F'
    // console.log('maxFolderTypeSelect = '+this.maxFolderTypeSelect)
    if (this.selecArray.length != 0) {
      this.maxFolderTypeSelect = 'F'
      // console.log(this.selecArray)

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
      // console.log('maxFolderTypeSelect = ' + this.maxFolderTypeSelect)
      this.stateCopy = true;
      this.stetaPaste = true;
    }

  }

  move() {
    // console.log('----- move -----')

    // console.log(this.selecArray.length)

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
    // console.log('maxFolderTypeSelect = ' + this.maxFolderTypeSelect)
  }

  reOrder() {
    // console.log('----- reOrder -----')
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
    this._loadingService.register('main')
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        console.log(this.documentTypeDetails)
        for (let dtd of this.documentTypeDetails) {
        
        this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
        }
        console.log(this.columns)
      })

    this._loadingService.resolve('main')
  }

  onDateChanged(event: any) {
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  //--- pipe
  birthday = new Date(1988, 3, 15); // April 15, 1988
  toggle = true; // start with true == shortDate


  testemail() {
    // console.log('--- testemail----')
    this._loadingService.register('main')
    this._folderService
      .testemail()
      .subscribe(response => {

      })
    this._loadingService.resolve('main')
  }

  change(){
    console.log('-- cached --')
    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['ListFolderByDoctypeComponent', {
            parentId: 0,
            t: new Date().getTime(),
            folderName: 'ระบบจัดเก็บเอกสารฯ',
          }],
        }
      }], { relativeTo: this._route })
  }

//////-------------------------------- doc-----------------------

selectDocument(selectDoc: Document) {
    console.log('---selectDoc---', selectDoc)
    this._router.navigate(
      [ {
        outlets: {
          contentCenter: ['createDoc', {
            documentId: selectDoc.id,
            folderId: this.parentId,
            documentTypeId: this.documentTypeId,
            t: new Date().getTime()
          }],
        }
      }], { relativeTo: this._route })
  }
  


}
