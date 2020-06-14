import { Component, OnInit, Input, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { TreeModule, TreeNode, Message } from 'primeng/primeng'
import { MdDialog, MdDialogRef } from '@angular/material';

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core'
import { IPageChangeEvent } from '@covalent/core'
import { MoveStructureComponent } from '../../component/move-structure/move-structure.component'
import { OrderStructureComponent } from '../../component/order-structure/order-structure.component'
import { StructureService } from '../../component/structure/structure.service'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-organize',
  templateUrl: './organize.component.html',
  styleUrls: ['./organize.component.styl'],
  providers: [StructureService]
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
    private _structureService: StructureService
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


  orderStructure() {
    console.log(this.parentStructure.id)
    let dialogRef = this._dialog.open(OrderStructureComponent, {
      width: '40%',
    });
    let instance = dialogRef.componentInstance
    instance.structureId = this.parentStructure.id
    instance.type = 'external'
    dialogRef.afterClosed().subscribe(result => {
      this._loadingService.register('main')
      this.structureTree = []
      this._structureService
        .getOutStructures('1.0', '0', '1', '', '', 0)
        .subscribe(response => {
          let i = 0
          for (let node of response) {
            this.structureTree.push({
              "label": node.name,
              "data": node.id,
              "expandedIcon": "fa-home",
              "collapsedIcon": "fa-home",
              "leaf": false,
              "expanded": true,
              "dataObj": node,
              "children": []
            })
            Observable.forkJoin(
              this._structureService.getOutStructures('1.0', '0', '200', 'orderNo', 'asc', node.id),
            ).subscribe((response: Array<any>) => {
              this._loadingService.resolve('main')
              for (let structure of response[0]) {
                this.structureTree[i].children.push({
                  "label": structure.name,
                  "data": structure.id,
                  "expandedIcon": "fa-tag",
                  "collapsedIcon": "fa-tag",
                  "leaf": false,
                  "selectable": true,
                  "dataObj": structure
                })
              }
              i++;
            });
          }
        });
    })
  }

  structureMove() {
    console.log('structureMove', this.parentStructure)
    let dialogRef = this._dialog.open(MoveStructureComponent, {
      width: '40%',
    });
    let instance = dialogRef.componentInstance
    instance.structureData = this.parentStructure
    instance.isOrganize = true
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'บันทึกสำเร็จ',
          detail: 'ย้ายหน่วยงาน' + this.parentStructure.name
        })
        this.structureTree = []
        this._structureService
          .getOutStructures('1.0', '0', '1', '', '', 0)
          .subscribe(response => {
            let i = 0
            for (let node of response) {
              this.structureTree.push({
                "label": node.name,
                "data": node.id,
                "expandedIcon": "fa-home",
                "collapsedIcon": "fa-home",
                "leaf": false,
                "expanded": true,
                "dataObj": node,
                "children": []
              })
              Observable.forkJoin(
                this._structureService.getOutStructures('1.0', '0', '200', 'orderNo', 'asc', node.id),
              ).subscribe((response: Array<any>) => {
                this._loadingService.resolve('main')
                for (let structure of response[0]) {
                  this.structureTree[i].children.push({
                    "label": structure.name,
                    "data": structure.id,
                    "expandedIcon": "fa-tag",
                    "collapsedIcon": "fa-tag",
                    "leaf": false,
                    "selectable": true,
                    "dataObj": structure
                  })
                }
                i++;
              });
            }
          });
      }
    });
  }

}
