import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { ImportService } from './import-profile.service'
import { MdDialog, MdDialogRef } from '@angular/material'
import { ImportProfile } from '../../saraban/model/importProfile.model'
import { Message } from 'primeng/primeng'
import { DialogWarningComponent } from '../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { ParamSarabanService } from '../../saraban/service/param-saraban.service'
import { DialogAddImportProfileComponent } from './dialog-add-import-profile/dialog-add-import-profile.component'

@Component({
  selector: 'app-import-profile',
  templateUrl: './import-profile.component.html',
  styleUrls: ['./import-profile.component.styl'],
  providers: [ImportService]
})
export class ImportProfileComponent implements OnInit {
  importProfiles: ImportProfile[] = []
  hoverEdit: number = -1
  msgs: Message[] = []

  constructor(
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _dialog: MdDialog,
    private _importService: ImportService,
    private _paramSarabanService: ParamSarabanService,
  ) { }

  ngOnInit() {
    this.listImportProfiles()
  }

  goBack() {
    this._location.back()
  }

  private genMsg(action: string, importProfile: ImportProfile): Message {
    return {
      severity: 'success',
      summary: `${action}ข้อมูลการเชื่อมระบบ`,
      detail: `คุณได้ทำการ${action}ข้อมูลการเชื่อมระบบ ${importProfile.name}`
    }
  }

  private handleError() {
    this._loadingService.resolve('main')
    this.msgs.push({
      severity: 'error',
      summary: 'เกิดข้อผิดพลาด',
    })
  }

  listImportProfiles() {
    this._loadingService.register('main')
    this._importService.listProfile().subscribe({
      next: (data) => {
        this.importProfiles = data
      },
      error: (err) => this.handleError(),
      complete: () => this._loadingService.resolve('main')
    })
  }

  add() {
    const action = 'เพิ่ม'
    const creator = this._paramSarabanService.userProfiles[this._paramSarabanService.userProfileIndex]
    const importPtofile = new ImportProfile({
      createdBy: creator.id,
      creatorFullName: creator.fullName
    })

    const dialogRef = this._dialog.open(DialogAddImportProfileComponent)
    dialogRef.componentInstance.importProfile = importPtofile
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._importService.createProfile(result).subscribe({
          next: (data) => {
            this.importProfiles.push(data)
            this.msgs.push(this.genMsg(action, data))
          },
          error: (err) => this.handleError(),
          complete: () => this._loadingService.resolve('main')
        })
      }
    })
  }

  edit(importProfile: ImportProfile) {
    const action = 'แก้ไข'
    const updater = this._paramSarabanService.userProfiles[this._paramSarabanService.userProfileIndex]
    const tmp = Object.assign({}, importProfile)
    tmp.updatedBy = updater.id
    tmp.updaterFullName = updater.fullName

    const dialogRef = this._dialog.open(DialogAddImportProfileComponent)
    dialogRef.componentInstance.importProfile = tmp
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._importService.updateProfile(result).subscribe({
          next: (data) => {
            const index = this.importProfiles.findIndex(importProfile => importProfile.id == data.id)
            this.importProfiles[index] = data
            this.msgs.push(this.genMsg(action, data))
          },
          error: (err) => this.handleError(),
          complete: () => this._loadingService.resolve('main')
        })
      }
    })
  }

  delete(importProfile: ImportProfile) {
    const action = 'ลบ'

    const dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._importService.removeProfile(importProfile.id, this._paramSarabanService.userId).subscribe({
          next: (data) => {
            this.importProfiles = this.importProfiles.filter(importProfile => importProfile.id != data.id)
            this.msgs.push(this.genMsg(action, data))
          },
          error: (err) => this.handleError(),
          complete: () => this._loadingService.resolve('main')
        })
      }
    })
  }

}