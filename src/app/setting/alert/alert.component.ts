import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { AlertService } from './alert.service'
import { MdDialog } from '@angular/material'
import { Alert } from '../model/alert.model'
import { Message } from 'primeng/primeng'
import { DialogWarningComponent } from '../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { ParamSarabanService } from '../../saraban/service/param-saraban.service'
import { DialogAddAlertComponent } from './dialog-add-alert/dialog-add-alert.component'

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.styl'],
  providers: [AlertService]
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = []
  hoverEdit: number = -1
  msgs: Message[] = []

  constructor(
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _dialog: MdDialog,
    private _alertService: AlertService,
    private _paramSarabanService: ParamSarabanService,
  ) { }

  ngOnInit() {
    this.listAlerts()
  }

  goBack() {
    this._location.back()
  }

  private genMsg(action: string, alert: Alert): Message {
    return {
      severity: 'success',
      summary: `${action}ข้อมูลการแจ้งเตือน`,
      detail: `คุณได้ทำการ${action}ข้อมูลการแจ้งเตือน`
    }
  }

  private handleError() {
    this._loadingService.resolve('main')
    this.msgs.push({
      severity: 'error',
      summary: 'เกิดข้อผิดพลาด',
    })
  }

  listAlerts() {
    this._loadingService.register('main')
    this._alertService.list(0, -1).subscribe({
      next: (response) => {
        this.alerts = response.data
      },
      error: (err) => this.handleError(),
      complete: () => this._loadingService.resolve('main')
    })
  }

  add() {
    const action = 'เพิ่ม'

    const dialogRef = this._dialog.open(DialogAddAlertComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._alertService.create(result).subscribe({
          next: (data) => {
            this.alerts.push(data)
            this.msgs.push(this.genMsg(action, data))
          },
          error: (err) => this.handleError(),
          complete: () => this._loadingService.resolve('main')
        })
      }
    })
  }

  edit(alert: Alert) {
    const action = 'แก้ไข'
    const tmp = Object.assign({}, alert)

    const dialogRef = this._dialog.open(DialogAddAlertComponent)
    dialogRef.componentInstance.alert = tmp
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._alertService.update(result).subscribe({
          next: (data) => {
            const index = this.alerts.findIndex(alert => alert.id == data.id)
            this.alerts[index] = data
            this.msgs.push(this.genMsg(action, data))
          },
          error: (err) => this.handleError(),
          complete: () => this._loadingService.resolve('main')
        })
      }
    })
  }

  delete(alert: Alert) {
    const action = 'ลบ'

    const dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._alertService.remove(alert.id).subscribe({
          next: (data) => {
            this.alerts = this.alerts.filter(alert => alert.id != data.id)
            this.msgs.push(this.genMsg(action, data))
          },
          error: (err) => this.handleError(),
          complete: () => this._loadingService.resolve('main')
        })
      }
    })
  }

}
