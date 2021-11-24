import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { Message } from 'primeng/primeng'
import { MdDialog } from '@angular/material'
import { ITdDataTableColumn } from '@covalent/core'
import { Observable } from 'rxjs/Observable'

import { MoveStructureComponent } from '../../component/move-structure/move-structure.component'
import { OrderStructureComponent } from '../../component/order-structure/order-structure.component'
import { StructureService } from '../../service/structure.service'

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
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: 'ชื่อหน่วยงาน' },
    { name: 'shortName', label: 'ชื่อย่อหน่วยงาน' },
    { name: 'detail', label: 'รายละเอียด' },
    { name: 'edit', label: '' }
  ]
  showMenu: boolean = false
  showEditStructure: boolean = false
  showEditUser: boolean = false
  listMenu: string = 'menu'
  parentStructure: any
  showSearchResult: boolean = false
  showMergeStructure: boolean = false
  showMergeUser: boolean = false
  organizeName: string = ''
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
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

  searchOrganize() {
    this.datas = []
    this._loadingService.register('main')
    this._structureService
      .listAllByName(this.organizeName)
      .subscribe((response: any[]) => {
        this._loadingService.resolve('main')
        this.showSearchResult = true
        response.forEach(organize => {
          if (organize.shortName == null) organize.shortName = ''
          if (organize.detail == null) organize.detail = ''
          this.datas.push(organize)
        })
      })
  }

  edit(row: any) {
    let param = {
      mode: 'edit',
      modeTitle: 'แก้ไข',
      parentId: row.id,
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

}
