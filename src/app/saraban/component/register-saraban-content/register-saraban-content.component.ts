import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { MdDialogRef } from '@angular/material'

import { SarabanService } from '../../service/saraban.service'

import { SarabanFolder } from '../../model/sarabanFolder.model'

@Component({
  selector: 'app-register-saraban-content',
  templateUrl: './register-saraban-content.component.html',
  styleUrls: ['./register-saraban-content.component.styl'],
  providers: [SarabanService],
})
export class RegisterSarabanContentComponent implements OnInit {
  sarabanContentId: number
  shortCutSaraban: SarabanFolder[] = []
  selectedFolder: SarabanFolder
  isRegister: boolean = true
  title: String = 'เลือกแฟ้มที่จะลงทะเบียน'
  currentFolderId: number

  constructor(
    private _route: ActivatedRoute,
    private _loadingService: TdLoadingService,
    private _sarabanService: SarabanService,
    public dialogRef: MdDialogRef<RegisterSarabanContentComponent>,
  ) { }

  ngOnInit() {
    console.log('RegisterSarabanContentComponent')
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['sarabanContentId'])) this.sarabanContentId = +params['sarabanContentId']
        this.getShortcutSarabanFolders()
      })
  }

  getShortcutSarabanFolders(): void {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolderShortcuts()
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (this.isRegister) {//register
          response.forEach(folder => {
            if (folder.wfContentType2.id != 5) {
              this.shortCutSaraban.push(folder)
            }
          })
        } else {//move
          this.shortCutSaraban = response.filter(folder => 
            folder.wfContentType.id == 1 && 
            folder.wfContentType2.id != 5 && 
            folder.wfFolderLinkFolderId != this.currentFolderId)
        }
      })
  }

  selectShortcutFolder(selectedFolder: SarabanFolder) {
    this.selectedFolder = selectedFolder
    this.dialogRef.close(true)
  }

}
