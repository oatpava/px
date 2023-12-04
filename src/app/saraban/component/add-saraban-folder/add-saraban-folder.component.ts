import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { MdDialog } from '@angular/material'
import { Message, TreeNode, AutoComplete } from 'primeng/primeng'

import { SarabanService } from '../../service/saraban.service'
import { SarabanContentTypeService } from '../../service/saraban-content-type.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

import { SarabanFolder } from '../../model/sarabanFolder.model'
import { ContentType } from '../../model/ContentType.model'
import { ContentType2 } from '../../model/ContentType2.model'

import { DialogSettingSearchFilterComponent } from './dialog-setting-search-filter/dialog-setting-search-filter.component'

@Component({
  selector: 'app-add-saraban-folder',
  templateUrl: './add-saraban-folder.component.html',
  styleUrls: ['./add-saraban-folder.component.styl'],
  providers: [SarabanService, SarabanContentTypeService]
})
export class AddSarabanFolderComponent implements OnInit {
  icon: string = 'book'
  path: string = ''
  type: string = 'แฟ้มทะเบียน'
  title: string
  mode: string
  sarabanFolder: SarabanFolder
  contentTypes: ContentType[] = []
  contentTypes2: ContentType2[]
  isFolder: boolean = true

  dialog: boolean = false
  linkStructure: string = ''
  budgetYear: boolean = false
  disableContentType: boolean = false
  disableLinkStructure: boolean = false

  addSarabanFolderClick: boolean = true

  wfFolderLinkId: number
  msgs: Message[] = []

  showType2: boolean = true

  date_str: string

  structureTree: TreeNode[] = []
  selectedStructure: TreeNode = null

  @ViewChild('acPreBookNo') acPreBookNo: AutoComplete
  preBookNos: string[] = []

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: true
  }

  listWfFolderTypeYearExpires = [
    { value: null, viewValue: '' },
    { value: 'Y', viewValue: 'ปี' },
    { value: 'M', viewValue: 'เดือน' },
    { value: 'D', viewValue: 'วัน' },
  ];

  constructor(
    private _route: ActivatedRoute,
    private _loadingService: TdLoadingService,
    private _sarabanService: SarabanService,
    private _sarabanContentTypeService: SarabanContentTypeService,
    private _location: Location,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.sarabanFolder = new SarabanFolder()
    this.structureTree = this._paramSarabanService.structureTree
    this.path = this._paramSarabanService.path
  }

  ngOnInit() {
    console.log('AddSarabanFolderComponent')
    this._route.params
      .subscribe((params: Params) => {
        this.mode = params['mode']
        if (this.mode == "add") {
          this.title = "เพิ่ม"
          this.sarabanFolder.parentId = params['parentId']
          this.sarabanFolder.wfFolderType = "T"
          if (this.sarabanFolder.parentId == -1) {
            this.isFolder = false
            this.icon = 'chrome_reader_mode'
            this.type = 'หนังสือเวียน'
            this.sarabanFolder.wfFolderType = "CN"
          }
          this.getContentType()
          this.sarabanFolder.wfFolderOwnerId = this._paramSarabanService.userId
          this.sarabanFolder.wfFolderOwnerName = this._paramSarabanService.userName
          let date = new Date()
          this.sarabanFolder.createdDate = { date: { year: (date.getFullYear() + 543), month: date.getMonth() + 1, day: date.getDate() } }
          this.date_str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + (date.getFullYear() + 543)
        } else {
          this.getSarabanFolder(params['sarabanFolderId'])
        }
      })
  }

  getContentType(): void {
    this._loadingService.register('main')
    this._sarabanContentTypeService
      .getContentType()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.contentTypes = response as ContentType[]
        if (this.isFolder) {
          if (this.mode == "add") {
            this.contentTypes = this.contentTypes.filter(ct => ct.id < 5)
          }
        } else {
          this.contentTypes = this.contentTypes.filter(ct => ct.id == 4)
          //this.sarabanFolder.wfContentType.id = 4
        }
      })
  }

  goBack() {
    this._location.back()
  }

  getContentType2_edit(folder: SarabanFolder): void {
    this._loadingService.register('main')
    this._sarabanContentTypeService
      .getContentType2(folder.wfContentType.id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.contentTypes2 = response as ContentType2[]
        this.budgetYear = this._sarabanService.changeBudgetYearShow(folder)//from numbrt to bool
        if (folder.wfContentType.id == 3) {
          this.disableContentType = true
          this.showType2 = false
        } else if (folder.wfContentType.id == 5) {
          this.disableContentType = true
          this.disableLinkStructure = true
        }
        if (folder.wfFolderLinkId != 0) this.getStructureName(folder.wfFolderLinkId)
        this.sarabanFolder = folder
        this.date_str = this.sarabanFolder.createdDate.substr(0, 10)
      })
  }

  getSarabanFolder(sarabanFolderId: number) {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolder(sarabanFolderId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.title = 'แก้ไข'
        if (response.parentId == -1) {
          this.isFolder = false
          this.icon = 'chrome_reader_mode'
          this.type = 'หนังสือเวียน'
        }
        this.getContentType()
        this.getContentType2_edit(response)
        if (response.wfFolderPreBookNo) {
          this.preBookNos = response.wfFolderPreBookNo.split(", ")
        }
      })
  }

  getStructureName(structureId: number): void {
    let node = this.findNode(this.structureTree, structureId)
    if (node) {
      this.selectedStructure = node
      this.linkStructure = node.label
    }
  }

  save(newFolder: SarabanFolder) {
    newFolder = this._sarabanService.changeBudgetYear(newFolder, this.budgetYear)
    newFolder = this._sarabanService.changeBookNoType(newFolder)
    newFolder = this.preparePreBookNo(newFolder, this.preBookNos)
    this._loadingService.register('main')
    this._sarabanService
      .createSarabanFolder(this._sarabanService.convertDateFormat(newFolder))
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.msgs = []
        this.msgs.push({ severity: 'success', summary: 'บันทึกข้อมูลสำเร็จ', detail: 'คุณได้ทำการเพิ่ม' + this.type + ' ' + newFolder.wfFolderName, })
        setTimeout(() => {
          this._location.back()
        }, 1000)
      })
  }

  update(updateFolder: SarabanFolder) {
    updateFolder = this._sarabanService.changeBudgetYear(updateFolder, this.budgetYear)
    updateFolder = this._sarabanService.changeBookNoType(updateFolder)
    updateFolder = this.preparePreBookNo(updateFolder, this.preBookNos)
    this._loadingService.register('main')
    this._sarabanService
      .updateFolder(updateFolder)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.msgs = [];
        this.msgs.push(
          {
            severity: 'success',
            summary: 'บันทึกข้อมูลสำเร็จ',
            detail: 'คุณได้ทำการแก้ไข' + this.type + ' ' + updateFolder.wfFolderName,
          },
        );
        setTimeout(() => {
          this._location.back()
        }, 1000);
      })
  }

  getContentType2(contentTypeId: number): void {
    this._loadingService.register('main')
    this._sarabanContentTypeService
      .getContentType2(contentTypeId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.contentTypes2 = response as ContentType2[]
      })
  }

  setContentTypes2(typeId: number) {
    if (typeId == 3) {
      this.showType2 = false
      this.sarabanFolder.wfContentType2.id = 1
      this.sarabanFolder.wfFolderDetail = ''
    } else if (typeId == 4) {
      this.showType2 = false
      // this.sarabanFolder.wfFolderDetail = this.contentTypes[0].contentTypeName
      // this.sarabanFolder.wfContentType2.id = null
      // this.getContentType2(typeId)
      this.sarabanFolder.wfContentType2.id = 1
    } else {
      this.showType2 = true
      this.sarabanFolder.wfFolderDetail = this.contentTypes[typeId - 1].contentTypeName
      this.sarabanFolder.wfContentType2.id = null
      this.getContentType2(typeId)
    }
  }

  updateFolderName() {
    if (this.sarabanFolder.convertId == 0) {
      let typeId: number = this.sarabanFolder.wfContentType.id
      let type2Id: number = this.sarabanFolder.wfContentType2.id
      if (typeId == 3) {
        this.sarabanFolder.wfFolderName = ""
      } else if (typeId == 4) {
        // if (type2Id == null) this.sarabanFolder.wfFolderName = this.contentTypes[0].contentTypeName
        // this.sarabanFolder.wfFolderName = this.contentTypes[0].contentTypeName + this.contentTypes2[type2Id - 1].wfContentType2Name
        // this.sarabanFolder.wfFolderDetail = this.contentTypes[0].contentTypeName
        this.sarabanFolder.wfFolderName = 'ทะเบียนหนังสือเวียน'
        this.sarabanFolder.wfFolderDetail = 'หนังสือเวียน'
      } else {
        if (type2Id == null) this.sarabanFolder.wfFolderName = this.contentTypes[typeId - 1].contentTypeName + "หนังสือ"
        else this.sarabanFolder.wfFolderName = this.contentTypes[typeId - 1].contentTypeName + "หนังสือ" + this.contentTypes2[type2Id - 1].wfContentType2Name
        this.sarabanFolder.wfFolderDetail = this.contentTypes[typeId - 1].contentTypeName
      }
    }
  }

  openDialogSearchFilter() {
    let dialogRef = this._dialog.open(DialogSettingSearchFilterComponent, {
      width: '30%',
    });
    for (let i = 0; i < this.sarabanFolder.searchField.length; i++) {
      dialogRef.componentInstance.searchfields[i].selected = this.sarabanFolder.searchField[i]
      if (!this.sarabanFolder.searchField[i]) {
        dialogRef.componentInstance.allCheck = false
      }
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for (let i = 0; i < this.sarabanFolder.searchField.length; i++) {
          this.sarabanFolder.searchField[i] = dialogRef.componentInstance.searchfields[i].selected
        }
      }
    })
  }

  nodeSelect(event) {
    if (!event.node.leaf) {
      if (this.linkStructure === event.node.label) {
        this.linkStructure = ''
        this.sarabanFolder.wfFolderLinkId = 0
        this.selectedStructure = null
      } else {
        this.linkStructure = event.node.label
        this.sarabanFolder.wfFolderLinkId = event.id
      }
    } else {
      this.selectedStructure = null
      this.msgs = []
      this.msgs.push({ severity: 'warn', summary: 'เลือกได้เฉพาะหน่วยงานเท่านั้น', detail: event.node.label })
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

  checkInput() {
    let from = this.acPreBookNo.domHandler.findSingle(this.acPreBookNo.el.nativeElement, 'input')

    if (from.value != '') {
      from.value = from.value.replace(", ", ",")
      this.preBookNos.push(from.value)
      from.value = ''
    }
  }

  preparePreBookNo(folder: SarabanFolder, preBookNos: string[]): SarabanFolder {
    folder.wfFolderPreBookNo = preBookNos[0]
    for (let i = 1; i < preBookNos.length; i++) {
      folder.wfFolderPreBookNo += ", " + preBookNos[i]
    }
    return folder
  }

}

