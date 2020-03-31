import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { MdDialog, MdSidenav } from '@angular/material'

import { Message } from 'primeng/primeng';

import { SarabanService } from '../../service/saraban.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

import { Menu } from '../../model/menu.model'
import { SarabanFolder } from '../../model/sarabanFolder.model'
import { SarabanAuth } from '../../model/sarabanAuth.model'

import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { ReportSarabanComponent } from '../report-saraban/report-saraban.component'
import { DialogMoveFolderComponent } from './dialog-move-folder/dialog-move-folder.component'

@Component({
  selector: 'app-list-saraban-folder',
  templateUrl: './list-saraban-folder.component.html',
  styleUrls: ['./list-saraban-folder.component.styl'],
  providers: [SarabanService]
})
export class ListSarabanFolderComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MdSidenav
  icon: string = 'book'
  path: string = ''
  hoverEdit: number = -1
  hoverClicked: boolean = false

  sarabanFolder: SarabanFolder[] = []
  isFolder: boolean = true
  ModeSearch: boolean = true
  search: any[] = []
  menus: Menu[] = []
  menuClick: boolean = false

  parentId: number = 0
  msgs: Message[] = []
  private isArchive: boolean

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: true,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: false
  }

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _sarabanService: SarabanService,
    private _location: Location,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.isArchive = this._paramSarabanService.isArchive
  }

  ngOnInit() {
    console.log('ListSarabanFolderComponent')
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['parentId'])) {
          this.parentId = +params['parentId']
          let path = params['path'].split('x|x').join('(')
          path = path.split('y|y').join(')')
          this._paramSarabanService.path = this.path = path
        } else {
          this.parentId = this._paramSarabanService.folderId
          this._paramSarabanService.path = this.path = 'ทะเบียนส่วนกลาง'
        }
        if (this.parentId == -1) {
          this.isFolder = false
          this.path = 'หนังสือเวียน'
          this.icon = 'chrome_reader_mode'
          this.getCircularNoticesWithAuth()
          this.getAuthMenus('circularNotice', new SarabanAuth({ auth: false }), false)
        } else {
          this.getSarabanFoldersWithAuth(this.parentId)
          if (this._paramSarabanService.userId == 1) {
            this.getAuthMenus('list-folder', new SarabanAuth(), true)
          } else {
            if (this.parentId == 0) {
              this.getAuthMenus('list-folder', new SarabanAuth({ auth: false }), false)
            } else {
              this.getAuthMenus('list-folder', new SarabanAuth({ auth: this._paramSarabanService.tmp_b }), false)
            }
          }
        }
      })
  }

  getCircularNoticesWithAuth() {
    this._loadingService.register('main')
    this._sarabanService
      .listByContentTypeId("CN", 4, 0, 1)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanFolder = response
      })
  }

  getSarabanFoldersWithAuth(parentId: number): void {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFoldersWithAuth(parentId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanFolder = response

        
      })
  }

  goBack() {
    this.menuClick = false
    this._paramSarabanService.path = this._paramSarabanService.pathOld
    this._location.back()
  }

  selectdFolder(selectFolder: SarabanFolder) {
    if (!this.hoverClicked) {
      this.menuClick = false
      this._paramSarabanService.tmp_b = selectFolder.auth[1]
      this._paramSarabanService.pathOld = this._paramSarabanService.path
      this._paramSarabanService.path += ' / ' + selectFolder.wfFolderName

      if (selectFolder.wfContentType.id == 3) {
        let path = this._paramSarabanService.path.split('(').join('x|x')
        path = path.split(')').join('y|y')
        this._router.navigate(
          ['.', {
            parentId: selectFolder.id,
            path: path
          }],
          { relativeTo: this._route })
      } else if (selectFolder.wfContentType.id == 4) {
        this._paramSarabanService.folderId = selectFolder.id
        this._paramSarabanService.folderName = selectFolder.wfFolderName
        this._paramSarabanService.folderParentName = (selectFolder.wfFolderPreContentNo) ? selectFolder.wfFolderPreContentNo : ''
        this._router.navigate(
          ['./', {
            outlets: {
              contentCenter: ['listCN']
            }
          }],
          { relativeTo: this._route })
      } else {
        this._paramSarabanService.folderId = selectFolder.id
        this._paramSarabanService.folderName = selectFolder.wfFolderName
        this._paramSarabanService.folderParentName = selectFolder.wfFolderParentName
        this._paramSarabanService.folderIcon = "list"
        this._paramSarabanService.folderType = this._paramSarabanService
          .getFolderType(selectFolder.wfContentType.id, selectFolder.wfContentType2.id)
        this._paramSarabanService.inboxId = null
        this._paramSarabanService.inboxFlag = { open: 1, action: 1, finish: 1 }
        this._paramSarabanService.mwp = { fromMwp: false, isUser: true, id: this._paramSarabanService.userId, replyTo: null, inboxIndex: null }
        this._router.navigate(
          ['./', {
            outlets: {
              contentCenter: ['content']
            }
          }],
          { relativeTo: this._route })
      }
    }
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }

  sarabanSearch() {
    this.ModeSearch = false;
  }

  add() {
    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['add', {
            mode: 'add',
            parentId: this.parentId,
          }],
        }
      }], { relativeTo: this._route })
  }

  edit(sarabanFolder: SarabanFolder) {
    this._router.navigate(
      ['../sarabanFolders/' + sarabanFolder.id, {
        mode: 'edit',
        sarabanFolderId: sarabanFolder.id,
      }],
      { relativeTo: this._route })
  }

  delete(sarabanFolder: SarabanFolder): void {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._sarabanService
          .deleteFolder(sarabanFolder)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.getSarabanFoldersWithAuth(this.parentId)
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'คุณได้ทำการลบแฟ้มทะเบียน ' + sarabanFolder.wfFolderName })
          })
      }
    })
  }

  authSaraban(sarabanFolder: SarabanFolder): void {
    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['authSaraban', {
            sarabanFolderId: sarabanFolder.id,
            sarabanFolderName: sarabanFolder.wfFolderName
          }],
        }
      }],
      { relativeTo: this._route })
  }

  getAuthMenus(menuType: string, auth: SarabanAuth, isAdmin: boolean) {
    this._loadingService.register('main')
    this._sarabanService
      .getAuthMenus(menuType, auth, this.isArchive, isAdmin)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.menus = response
      })
  }

  openDialogWarning(confirmation: boolean, header: string, message: string) {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.componentInstance.header = header
    dialogRef.componentInstance.message = message
    dialogRef.componentInstance.confirmation = confirmation
  }

  openSidenav() {
    this.sidenav.open()
    this.ModeSearch = false
  }
  closeSideNave() {
    this.sidenav.close()
    this.ModeSearch = true
  }

  menuAction(menu: Menu) {
    switch (menu.id) {
      case (1): this.openSidenav(); break
      case (18): this.add(); break
      case (4): this.report('pdf'); break
      case (5): this.report('xls'); break
      case (22): this.add(); break
      case (23): this.move(); break
    }
  }

  report(reportType: string) {
    let dialogRef = this._dialog.open(ReportSarabanComponent, {
      width: '60%'
    })
    dialogRef.componentInstance.reportType = reportType
    dialogRef.componentInstance.menuType = 'list-folder'
    dialogRef.componentInstance.folderType = (this._paramSarabanService.userId == 1 && this.parentId == 0) ? 1 : 0
    dialogRef.componentInstance.paramValue = [null, null, '' + this.parentId, null, '' + this._paramSarabanService.userId]
  }

  move() {
    let dialogRef = this._dialog.open(DialogMoveFolderComponent, {
      height: '70%'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.msgs.push(dialogRef.componentInstance.msg)
        this.getSarabanFoldersWithAuth(this.parentId)
      }
    })
  }

}
