import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { Message } from 'primeng/primeng'
import { MdSidenav, MdDialog } from '@angular/material'

import { SarabanContentService } from '../../../saraban/service/saraban-content.service'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

import { SarabanContent } from '../../../saraban/model/sarabanContent.model'

import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrls: ['./my-work.component.styl'],
  providers: [SarabanContentService]
})
export class MyWorkComponent implements OnInit {
  menuOver: boolean = false
  msgs: Message[] = []

  myWorks: any[]
  datas: any[] = []
  selectedRow_num: number = 0
  allCheck: boolean = false

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _dialog: MdDialog,
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _paramSarabanService: ParamSarabanService
  ) { }

  ngOnInit() {
    console.log("MyWorkComponent")
    if (this._paramSarabanService.tmp_i) {
      this._paramSarabanService.tmp_i = null     
      setTimeout(() => this.register(), 1)
    } else {
      if (this._paramSarabanService.msg != null) {
        let dialogRef = this._dialog.open(DialogWarningComponent)
        dialogRef.componentInstance.header = "รายละเอียดการลงทะเบียน"
        dialogRef.componentInstance.message = this._paramSarabanService.tmp
        dialogRef.componentInstance.confirmation = false
        this._paramSarabanService.tmp = null
        this.msgs = []
        this.msgs.push(this._paramSarabanService.msg)
        this._paramSarabanService.msg = null
        setTimeout(() => this.msgs = [], 3000)
        this.deleteNoRecyc(this._paramSarabanService.sarabanContentId)
      } else {
        this.getMyWorks()
      }
    }
  }

  goBack() {
    this._location.back()
  }

  getMyWorks() {
    this._loadingService.register('main')
    this._sarabanContentService
      .getMyWorks()
      .subscribe(response => {
        this._loadingService.resolve('main')     
        this.selectedRow_num = 0  
        response.forEach(wyWork => wyWork.selected = false)   
        this.myWorks = response
        this.datas = response
      })
  }

  reset() {
    this.datas = this.myWorks
  }

  checkAll() {
    this.datas.forEach(myWork => myWork.selected = this.allCheck)
    this.selectedRow_num = (this.allCheck) ? this.datas.length : 0
  }

  check(event) {
    if (event.checked) {
      this.selectedRow_num++
    } else {
      this.selectedRow_num--
    }
  }

  deleteList() {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let tmp: any[] = []
        this.datas.forEach(myWork => {
          if (myWork.selected) {
            tmp.push(this._sarabanContentService.removeMyWork(myWork.id))
          }
        })
        this._loadingService.register('main')
        Observable.forkJoin(tmp)
          .subscribe((res: any[]) => {
            this._loadingService.resolve('main')
            this.msgs = []
            this.msgs.push({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'คุณได้ทำการลบข้อมูลแล้ว' })
            this.getMyWorks()
          })
      }
    })
  }

  select(myWork: any, mode: string) {
    this._paramSarabanService.mode = mode
    if (myWork != null) this._paramSarabanService.sarabanContentId = myWork.id
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['addMyWork']
        }
      }],
      { relativeTo: this._route })
  }

  register() {//from add-myWork, cause deep 4 level cant back()
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['addContent', {
          }],
        }
      }],
      { relativeTo: this._route })
  }

  deleteNoRecyc(id: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .removeMyWork(id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.getMyWorks()
      })
  }

}
