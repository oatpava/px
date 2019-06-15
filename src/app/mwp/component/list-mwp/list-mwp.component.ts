import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { MdDialog } from '@angular/material'

import { MwpService } from '../../service/mwp.service'
import { SarabanService } from '../../../saraban/service/saraban.service'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

import { Mwp } from '../../model/mwp.model'
import { SarabanFolder } from '../../../saraban/model/sarabanFolder.model'

import { DialogInstructionComponent } from '../../../main/component/dialog-instruction/dialog-instruction.component'

@Component({
  selector: 'app-list-mwp',
  templateUrl: './list-mwp.component.html',
  styleUrls: ['./list-mwp.component.styl'],
  providers: [MwpService, SarabanService]
})
export class ListMwpComponent implements OnInit {
  mwps: Mwp[]
  shortCutSaraban: SarabanFolder[]
  listMenu: string = 'menu'
  ModeSearch: boolean = true

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _mwpService: MwpService,
    private _sarabanService: SarabanService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService
  ) {
    this._paramSarabanService.pathOld = null
    this._paramSarabanService.path = null
    this._paramSarabanService.searchFilters = null
    this._paramSarabanService.searchFilters_tmp = null
    this._paramSarabanService.datas = null
    this._paramSarabanService.tableFirst = null
    this._paramSarabanService.listReturn = null
    this._paramSarabanService.barcodeFilter = null
  }

  ngOnInit() {
    console.log('ListMwpComponent')
    this._route.params
      .subscribe((params: Params) => {
        if (!this._paramSarabanService.isArchive) {
          this.getUserProfileFolders()
          this.getShortcutSarabanFolders()
        }
      })
  }

  getUserProfileFolders(): void {
    this._loadingService.register('main')
    this._mwpService
      .getUserProfileFolders()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.mwps = response as Mwp[]
      })
  }

  getShortcutSarabanFolders(): void {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolderShortcuts()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.shortCutSaraban = response
      })
  }

  selectFolder(selectFolder: Mwp) {
    if (selectFolder.userProfileFolderType === "I") {
      this._paramSarabanService.mwp = { fromMwp: true, isUser: null, id: null, replyTo: null, inboxIndex: 0 }
      this._router.navigate(
        [{
          outlets: {
            contentCenter: ['inbox']
          }
        }],
        { relativeTo: this._route })
    } else if (selectFolder.userProfileFolderType === "O") {
      this._router.navigate(
        [{
          outlets: {
            contentCenter: ['outbox']
          }
        }],
        { relativeTo: this._route })
    } else if (selectFolder.userProfileFolderType === "Z") {
      this._router.navigate(
        [{
          outlets: {
            contentCenter: ['recycleBin']
          }
        }],
        { relativeTo: this._route })
    } else if (selectFolder.userProfileFolderType === "W") {
      this._paramSarabanService.inboxId = null
      this._paramSarabanService.inboxFlag = { open: 1, action: 1, finish: 1 }
      this._paramSarabanService.mwp = { fromMwp: false, isUser: true, id: this._paramSarabanService.userId, replyTo: null, inboxIndex: null }
      this._router.navigate(
        [{
          outlets: {
            contentCenter: ['myWork']
          }
        }],
        { relativeTo: this._route })
    }
  }

  selectShortcutFolder(selectFolder: SarabanFolder) {
    if (selectFolder.wfFolderParentName == null) selectFolder.wfFolderParentName = ""
    this._paramSarabanService.folderId = selectFolder.wfFolderLinkFolderId
    this._paramSarabanService.folderName = selectFolder.wfFolderName
    this._paramSarabanService.folderParentName = selectFolder.wfFolderParentName
    this._paramSarabanService.folderIcon = "list"
    this._paramSarabanService.folderType = this._paramSarabanService
      .getFolderType(selectFolder.wfContentType.id, selectFolder.wfContentType2.id)
    this._paramSarabanService.inboxId = null
    this._paramSarabanService.inboxFlag = { open: 1, action: 1, finish: 1 }
    this._paramSarabanService.mwp = { fromMwp: false, isUser: true, id: this._paramSarabanService.userId, replyTo: null, inboxIndex: null }
    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['toSaraban'],
        }
      }],
      { relativeTo: this._route })
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

  privateGroup() {
    this._router.navigate(
      [{
        outlets: {
          contentCenter: ['privateGroup']
        }
      }],
      { relativeTo: this._route })
  }

  showInstructionDialog() {
    let dialogRef = this._dialog.open(DialogInstructionComponent)
  }

}
