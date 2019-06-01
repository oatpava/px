import { Component, OnInit, Input, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { TreeModule, TreeNode, Message } from 'primeng/primeng'
import { MdDialog, MdDialogRef } from '@angular/material';

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core'
import { IPageChangeEvent } from '@covalent/core'

@Component({
  selector: 'app-organize',
  templateUrl: './organize.component.html',
  styleUrls: ['./organize.component.styl']
})
export class OrganizeComponent implements OnInit {
  parentId: number
  datas: any[] = []
  msgs: Message[] = []
  structureTree = []
  showMenu: boolean = false
  showEditStructure: boolean = false
  showEditUser: boolean = false
  listMenu: string = 'menu'
  parentStructure: any
  showSearchResult: boolean = false
  showMergeStructure: boolean = false
  showMergeUser: boolean = false
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _dataTableService: TdDataTableService,
    private _dialog: MdDialog,
  ) {
    this.parentId = 1
  }

  ngOnInit() {
  }


  selectStructure(event) {
    this.parentStructure = event
    this.showMenu = true
    this.showEditUser = false
    this.showEditStructure = true
    this.showMergeStructure = false
    this.showMergeUser = false
    if (this.parentStructure.code !== null) {
      this.showMergeStructure = true
    }

  }

  manageStructure(modeSelect: string, modeTitleSelect: string) {
    let param = {
      mode: modeSelect,
      modeTitle: modeTitleSelect,
      parentId: this.parentStructure.id,
      t: new Date().getTime()
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['add-outing', param],
        }
      }],
      { relativeTo: this._route })
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



}
