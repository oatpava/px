import { Component, OnInit, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { MdSidenav, MdDialog } from '@angular/material'

import { Message, DataTable } from 'primeng/primeng'

import { RecycleBinService } from '../../service/recycleBin.service'
import { RecycleBin } from '../../model/recycleBin.model'

import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'

import { RecycleBinFilter } from '../../model/recyclebinFilter.model'
import { Menu } from '../../model/menu.model'
import { ListReturn } from '../../../main/model/listReturn.model'

const limit: number = 20
@Component({
  selector: 'app-recycle',
  templateUrl: './recycleBin.component.html',
  styleUrls: ['./recycleBin.component.styl'],
  providers: [RecycleBinService]
})

export class RecycleBinComponent implements OnInit {
  @ViewChild('dt') dt: DataTable
  datas: RecycleBin[][]
  listReturn: ListReturn[]
  tableFirst: number[]
  searched: number

  ModeSearch: boolean = true
  msgs: Message[] = []
  path: string[] = ['ถังขยะ', 'ถังขยะ / ผลการค้นหา']

  allCheck: boolean = false
  menuOver: boolean = false
  menus: Menu[] = []
  selectedRow_num: number = 0

  @ViewChild('sidenav') sidenav: MdSidenav
  modules: { id: number, name: string, moduleName: string }[] = [
    { id: 0, name: "ทั้งหมด", moduleName: null },
    { id: 1, name: "หน้าจอส่วนตัว", moduleName: 'mwp' },
    { id: 2, name: "ระบบสารบรรณฯ", moduleName: 'wf' },
    { id: 3, name: "ระบบจัดเก็บเอกสารฯ", moduleName: 'dms' }
  ]
  searchFilters: RecycleBinFilter

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false
  }

  constructor(
    private _loadingService: TdLoadingService,
    private _recycleBinService: RecycleBinService,
    private _location: Location,
    private _paramSarabanService: ParamSarabanService,
    private _dialog: MdDialog
  ) {
    this.searchFilters = new RecycleBinFilter()
    this.datas = [[], []]
    this.listReturn = [new ListReturn(), new ListReturn()]
    this.tableFirst = [0, 0]
    this.searched = 0
  }

  ngOnInit() {
    console.log('RecycleBinComponent')
    this.getRecycleBins(limit)
    this.getMenus()
  }

  getMenus() {
    this._recycleBinService
      .getMenus()
      .subscribe(response => {
        this.menus = response
      })
  }

  getRecycleBins(limit: number): void {
    this._loadingService.register('main')
    this._recycleBinService
      .getRecyclebyUserId(this._paramSarabanService.userId, 0, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas[this.searched] = response.data
        this.listReturn[this.searched] = response.listReturn
        this.tableFirst[this.searched] = 0
      })
  }

  goBack() {
    if (this.searched == 1) {
      this.searched = 0
      this.allCheck = false
      this.searchFilters = new RecycleBinFilter()
    } else {
      this._location.back()
    }
  }


  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true
    }
  }

  openSidenav() {
    this.sidenav.open()
    this.ModeSearch = false
  }

  closeSideNave() {
    this.sidenav.close()
    this.ModeSearch = true
  }

  reset() {
    this.allCheck = false
    this.searched = 0
    this.searchFilters = new RecycleBinFilter()
    this.getRecycleBins(limit)
  }

  search(filters: RecycleBinFilter) {
    this.searched = 1
    this.tableFirst[0] = this.dt.first
    this.dt.first = 0

    let tmp = new RecycleBinFilter(filters)
    if (filters.startDate != null) tmp.startDate = this._paramSarabanService.getStringDateAny(tmp.startDate)
    else tmp.startDate = ''
    if (filters.endDate != null) tmp.endDate = this._paramSarabanService.getStringDateAny(tmp.endDate)
    else tmp.endDate = ''

    this._loadingService.register('main')
    this._recycleBinService
      .search(tmp)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.closeSideNave()
        this.allCheck = false
        this.datas[1] = response
        this.listReturn[1] = new ListReturn({ all: response.length, count: response.length, next: 0 })
        this.tableFirst[1] = 0
      })
  }

  checkAll() {
    this.datas[this.searched].forEach(recyc => recyc.selected = this.allCheck)
    this.selectedRow_num = (this.allCheck) ? this.datas.length : 0
  }

  check(event) {
    if (event.checked) {
      this.selectedRow_num++
    } else {
      this.selectedRow_num--
    }
  }

  menuAction(menu: Menu) {
    switch (menu.id) {
      case (1): this.openSidenav(); break
      case (2): this.deleteList(); break
      case (3): this.restoreList(); break
    }
  }

  deleteList() {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let tmp: any[] = []
        let deleteList: RecycleBin[] = []
        this.datas[this.searched].forEach(re => {
          if (re.selected) {
            tmp.push(this._recycleBinService.deleteRecycle(re))
            deleteList.push(re)
          }
        })
        this._loadingService.register('main')
        Observable.forkJoin(tmp)
          .subscribe((res: any[]) => {
            this._loadingService.resolve('main')
            deleteList.forEach(x => {
              this.deleteData(x, this.searched)
            })
            this.msgs = []
            this.msgs.push({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'คุณได้ทำการลบข้อมูลแล้ว' })
          })
      }
    })
  }

  restoreList() {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.componentInstance.header = "ยืนยันการกู้คืนข้อมูล"
    dialogRef.componentInstance.message = "คุณต้องการกู้คืนข้อมูลใช่ หรือ ไม่"
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let tmp: any[] = []
        let deleteList: RecycleBin[] = []
        this.datas[this.searched].forEach(re => {
          if (re.selected) {
            tmp.push(this._recycleBinService.restore(re))
            deleteList.push(re)
          }
        })
        this._loadingService.register('main')
        Observable.forkJoin(tmp)
          .subscribe((res: any[]) => {
            this._loadingService.resolve('main')
            deleteList.forEach(x => {
              this.deleteData(x, this.searched)
            })
            this.msgs = []
            this.msgs.push({ severity: 'success', summary: 'กู้คืนข้อมูลสำเร็จ', detail: 'คุณได้ทำการกู้คืนข้อมูลแล้ว' })
          })
      }
    })
  }

  loadMoreContents() {
    this._loadingService.register('main')
    this._recycleBinService
      .getRecyclebyUserId(this._paramSarabanService.userId, this.listReturn[this.searched].count, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas[this.searched] = this.datas[this.searched].concat(response.data)
        this.listReturn[this.searched] = response.listReturn
      })
  }

  // loadLastContents() {
  //   this._paramSarabanService.searchFilters = null
  //   this.path = 'ถังชยะ'
  //   this.searchFilters = new RecycleBinFilter()
  //   this.listReturn = new ListReturn(this._paramSarabanService.listReturn)
  //   this._paramSarabanService.listReturn = null
  //   this.getRecycleBins(this.listReturn.count)
  // }

  deleteData(deletedItem: RecycleBin, i: number) {
    let index = this.datas[i].findIndex(x => x.id == deletedItem.id)
    this.datas[i].splice(index, 1)
    this.listReturn[i].count--
    this.listReturn[i].all--

    if (i == 1) {
      this.deleteData(deletedItem, 0)
    }
  }

}
